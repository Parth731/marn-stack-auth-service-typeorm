import express from 'express';

const router = express.Router();

router.post('/', (req, res): void => {
  res.status(201).json({ message: 'Hello World' });
});

export default router;
