
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;


// Allow requests from the local React frontend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://kousik1603.github.io'
  ]
}));

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Hello Kousik! Your Backend is working.');
});

// Profile API
app.get('/api/profile', (req, res) => {
  res.json({
    name: 'Kousik Das',
    role: 'Full Stack Developer',
    skills: ['HTML', 'CSS', 'JavaScript', 'React']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
