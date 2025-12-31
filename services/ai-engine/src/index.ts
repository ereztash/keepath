import express from 'express';
import cors from 'cors';
import { chatRouter } from './routes/chat';
import { missionsRouter } from './routes/missions';
import { analyticsRouter } from './routes/analytics';

const app = express();
const port = process.env.AI_PORT || 4001;

app.use(cors({
  origin: [
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
  ],
  credentials: true,
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ai-engine' });
});

// Routes
app.use('/ai/chat', chatRouter);
app.use('/ai/missions', missionsRouter);
app.use('/ai/analytics', analyticsRouter);

app.listen(port, () => {
  console.log(`🤖 AI Engine running on http://localhost:${port}`);
});
