import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { MongoClient } from 'mongodb';

const app = express();
app.set('trust proxy', 1); // Render proxy-r jonno

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Rate limiter: 15 minute-e max 5 ta message
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many messages, try again later.' },
});

// Check MongoDB configuration
console.log('MongoDB URI loaded:', Boolean(MONGODB_URI));

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://kousik1603.github.io',
    // 'https://tomar-site.vercel.app',  // Vercel deploy-er por uncomment kore asol URL dao
  ]
}));

app.use(express.json());

// Database variable
let db;

// Start server after connecting to MongoDB
async function startServer() {
  let client;

  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is missing from the .env file');
    }

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    db = client.db('portfolio');
    console.log('MongoDB connected successfully!');

    // Home route
    app.get('/', (req, res) => {
      res.send('Hello Kousik! Your Backend is working.');
    });

    // Profile route
    app.get('/api/profile', (req, res) => {
      res.json({
        name: 'Kousik Das',
        role: 'Full Stack Developer',
        skills: ['HTML', 'CSS', 'JavaScript', 'React']
      });
    });

    // Get all contact messages
    app.get('/api/messages', async (req, res) => {
      try {
        const messages = await db
          .collection('messages')
          .find({})
          .sort({ createdAt: -1 })
          .toArray();

        res.json(messages);
      } catch (error) {
        console.error('Failed to fetch messages:', error.message);
        res.status(500).json({ error: 'Failed to fetch messages.' });
      }
    });

    // Save a new contact message (rate limit shudhu POST-e)
    app.post('/api/messages', contactLimiter, async (req, res) => {
      console.log('POST /api/messages route reached');

      try {
        const { name, email, message, website } = req.body || {};

        // Honeypot: bot hole chupchap ignore
        if (website) {
          return res.status(200).json({ ok: true });
        }

        // Validate required fields
        if (
          typeof name !== 'string' || !name.trim() ||
          typeof email !== 'string' || !email.trim() ||
          typeof message !== 'string' || !message.trim()
        ) {
          return res.status(400).json({
            error: 'Name, email, and message are required.'
          });
        }

        if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
          return res.status(400).json({ error: 'Invalid email.' });
        }

        if (message.trim().length > 1000) {
          return res.status(400).json({ error: 'Message is too long.' });
        }

        // Prepare the document
        const newMessage = {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          createdAt: new Date()
        };

        // Insert into MongoDB
        const result = await db.collection('messages').insertOne(newMessage);

        console.log('Contact message saved:', result.insertedId.toString());

        return res.status(201).json({
          message: 'Message saved successfully!',
          insertedId: result.insertedId
        });
      } catch (error) {
        console.error('Failed to save message:', error.message);
        return res.status(500).json({ error: 'Failed to save message.' });
      }
    });

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`Backend server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);

    if (client) {
      await client.close().catch(() => {});
    }

    process.exitCode = 1;
  }
}

startServer();