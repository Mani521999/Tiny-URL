import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// GET /:code -> redirect
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;

    // Ignore special paths like favicon.ico
    if (code === 'favicon.ico') {
      return res.status(404).send('Not found');
    }

    const result = await query(
      'SELECT url FROM links WHERE code = $1 LIMIT 1',
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Not found');
    }

    const url = result.rows[0].url;

    // Update click count & last_clicked_at asynchronously
    query(
      'UPDATE links SET click_count = click_count + 1, last_clicked_at = NOW() WHERE code = $1',
      [code]
    ).catch((err) => {
      console.error('Failed to update click count', err);
    });

    return res.redirect(302, url);
  } catch (err) {
    next(err);
  }
});

export default router;
