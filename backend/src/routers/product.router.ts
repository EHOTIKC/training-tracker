import { Router } from 'express';
import { AppService } from '../controllers/product.controller';

const router = Router();
const appService = new AppService();

router.get('/sessions', async (req, res) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 6;
  const search = (req.query.search as string) || '';
  const category = (req.query.category as string) || 'all';
  const status = (req.query.status as string) || 'all';
  const tag = (req.query.tag as string) || '';
  const sortBy = (req.query.sortBy as string) || 'default';

  const result = await appService.getSessions({
    page, limit, search, category, status, tag, sortBy,
  });

  res.status(200).json(result);
});

router.get('/categories', async (req, res) => {
  const categories = await appService.getCategories();
  res.json(categories);
});

router.get('/stats', async (req, res) => {
  const stats = await appService.getStats();
  res.json(stats);
});

router.post('/sessions', async (req, res) => {
  const newSession = await appService.createSession(req.body);
  res.status(201).json(newSession);
});

router.get('/sessions/:id', async (req, res) => {
  const foundSession = await appService.findSessionById(req.params.id);
  if (!foundSession) {
    return res.status(404).json({ message: 'Session not found' });
  }
  res.json(foundSession);
});

router.patch('/sessions/:id', async (req, res) => {
  const { id } = req.params;
  const updatedSession = await appService.updateSession(id, req.body);

  if (!updatedSession) {
    return res.status(404).json({ message: `Session with ID: ${id} not found` });
  }

  res.status(200).json(updatedSession);
});

router.delete('/sessions/:id', async (req, res) => {
  const { id } = req.params;
  const isDeleted = await appService.deleteSession(id);
  
  if (!isDeleted) {
    return res.status(404).json({ message: `Session with ID: ${id} not found` });
  }

  res.status(200).json({ message: `Session with ID: ${id} deleted successfully` });
});

export default router;