import express from 'express';
import { env } from '../config/env.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    version: env.APP_VERSION || '1.0'
  });
});

export default router;
