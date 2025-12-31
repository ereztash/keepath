import { Router } from 'express';
import { julesCoach } from '../services/jules-coach';

export const chatRouter = Router();

// Standard chat endpoint
chatRouter.post('/', async (req, res) => {
  try {
    const { userId, organizationId, message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await julesCoach.chat(
      userId || 'user_default',
      organizationId || 'org_default',
      message,
      history || []
    );

    res.json({ response, success: true });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Streaming chat endpoint
chatRouter.post('/stream', async (req, res) => {
  try {
    const { userId, organizationId, message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await julesCoach.chatStream(
      userId || 'user_default',
      organizationId || 'org_default',
      message,
      history || [],
      (chunk) => {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }
    );

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Stream error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

export default chatRouter;
