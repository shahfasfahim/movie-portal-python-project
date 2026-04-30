import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import groqRouter from './server/groq.js';

console.log('[Backend] GROQ_API_KEY loaded:', process.env.GROQ_API_KEY ? 'yes' : 'no');
console.log('[Backend] PYTHON_BACKEND_URL:', process.env.PYTHON_BACKEND_URL || 'http://localhost:8000');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use('/api/groq', groqRouter);
app.use('/api', groqRouter);

app.get('/', (req, res) => {
  res.json({ status: 'Movie Portal Groq backend is running' });
});

app.use((err, req, res, next) => {
  console.error('[Backend] Error:', err);
  res.status(500).json({ error: 'Server error', details: err.message });
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
