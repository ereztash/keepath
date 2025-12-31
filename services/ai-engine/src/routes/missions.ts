import { Router } from 'express';
import { julesCoach } from '../services/jules-coach';

export const missionsRouter = Router();

// Generate mission suggestions
missionsRouter.post('/suggest', async (req, res) => {
  try {
    const { organizationId } = req.body;

    const suggestions = await julesCoach.generateMissionSuggestions(
      organizationId || 'org_default'
    );

    res.json({ suggestions, success: true });
  } catch (error: any) {
    console.error('Mission suggestion error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default missionsRouter;
