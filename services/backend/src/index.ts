import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { generateSound } from './sounds';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for frontend applications
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:19006'], // Web and Expo
  methods: ['GET'],
  credentials: true
}));

// Serve static sound files
app.use('/sounds', express.static(path.join(__dirname, '..', 'public', 'sounds')));

// Endpoint to generate and return a sound
app.get('/generate-sound/:text', async (req, res) => {
  const text = req.params.text;
  
  try {
    const soundUrl = await generateSound(text);
    // Return the complete URL including hostname
    res.json({ url: `http://localhost:${port}${soundUrl}` });
  } catch (error) {
    console.error('Error in generate-sound endpoint:', error);
    res.status(500).json({ error: 'Failed to generate sound' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
  console.log(`Generate a sound at http://localhost:${port}/generate-sound/hello`);
});
