import { Router } from 'express';
import { julesCoach } from '../services/jules-coach';

export const analyticsRouter = Router();

// Analyze specific metric
analyticsRouter.post('/analyze', async (req, res) => {
  try {
    const { organizationId, metric } = req.body;

    if (!metric) {
      return res.status(400).json({ error: 'Metric is required' });
    }

    const analysis = await julesCoach.analyzeMetrics(
      organizationId || 'org_default',
      metric
    );

    res.json({ analysis, success: true });
  } catch (error: any) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default analyticsRouter;
