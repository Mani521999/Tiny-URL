import express from 'express';
import { query } from '../config/db.js';
import { isValidUrl } from '../utils/validateUrl.js';
import { generateCode, isValidCode } from '../utils/code.js';

const router = express.Router();

function mapLinkRow(row) {
  return {
    code: row.code,
    url: row.url,
    clickCount: Number(row.click_count) || 0,
    createdAt: row.created_at,
    lastClickedAt: row.last_clicked_at
  };
}

// POST /api/links
router.post('/', async (req, res, next) => {
  try {
    const { url, code } = req.body || {};

    if (!url || !isValidUrl(url)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid or missing URL', status: 400 }
      });
    }

    let finalCode = code;

    if (finalCode) {
      if (!isValidCode(finalCode)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Code must be 6-8 alphanumeric characters',
            status: 400
          }
        });
      }
    }

    // If no code provided, generate one and ensure uniqueness
    if (!finalCode) {
      let attempts = 0;
      const maxAttempts = 5;
      while (!finalCode && attempts < maxAttempts) {
        attempts += 1;
        const candidate = generateCode(6);
        const existing = await query(
          'SELECT 1 FROM links WHERE code = $1 LIMIT 1',
          [candidate]
        );
        if (existing.rowCount === 0) {
          finalCode = candidate;
        }
      }
      if (!finalCode) {
        return res.status(500).json({
          success: false,
          error: {
            message: 'Could not generate unique code',
            status: 500
          }
        });
      }
    }

    try {
      const result = await query(
        'INSERT INTO links (code, url) VALUES ($1, $2) RETURNING code, url, click_count, created_at, last_clicked_at',
        [finalCode, url]
      );
      const link = mapLinkRow(result.rows[0]);
      return res.status(201).json({
        success: true,
        data: link
      });
    } catch (err) {
      // Unique violation
      if (err.code === '23505') {
        return res.status(409).json({
          success: false,
          error: {
            message: 'Code already exists',
            status: 409
          }
        });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

// GET /api/links
router.get('/', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT code, url, click_count, created_at, last_clicked_at FROM links ORDER BY created_at DESC',
      []
    );
    const links = result.rows.map(mapLinkRow);
    res.json({
      success: true,
      data: links
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/links/:code
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await query(
      'SELECT code, url, click_count, created_at, last_clicked_at FROM links WHERE code = $1 LIMIT 1',
      [code]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Link not found',
          status: 404
        }
      });
    }
    const link = mapLinkRow(result.rows[0]);
    res.json({
      success: true,
      data: link
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/links/:code
router.delete('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await query('DELETE FROM links WHERE code = $1', [code]);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Link not found',
          status: 404
        }
      });
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
