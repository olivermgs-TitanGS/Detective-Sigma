const db = require('../database/connection');
const logger = require('../utils/logger');

class CasesController {
  async getAllCases(req, res) {
    try {
      const { status, subject_focus, difficulty } = req.query;
      
      let query = 'SELECT * FROM cases WHERE status = $1';
      let params = ['Published'];
      let paramCount = 1;

      if (subject_focus) {
        paramCount++;
        query += ` AND subject_focus = $${paramCount}`;
        params.push(subject_focus);
      }

      if (difficulty) {
        paramCount++;
        query += ` AND difficulty = $${paramCount}`;
        params.push(difficulty);
      }

      query += ' ORDER BY chapter_order ASC';

      const result = await db.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      logger.error('Error fetching cases:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch cases' });
    }
  }

  async getCaseById(req, res) {
    try {
      const { id } = req.params;
      
      const result = await db.query(
        'SELECT * FROM cases WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Case not found' });
      }

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      logger.error('Error fetching case:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch case' });
    }
  }

  async createCase(req, res) {
    try {
      const { title, description, difficulty, subject_focus, cover_image, briefing_video_url, master_clue_fragment } = req.body;

      const result = await db.query(
        `INSERT INTO cases (title, description, difficulty, subject_focus, cover_image, briefing_video_url, master_clue_fragment, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'Draft')
         RETURNING *`,
        [title, description, difficulty, subject_focus, cover_image, briefing_video_url, master_clue_fragment]
      );

      logger.info('Case created:', { caseId: result.rows[0].id });
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      logger.error('Error creating case:', error);
      res.status(500).json({ success: false, error: 'Failed to create case' });
    }
  }

  async updateCase(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const fields = Object.keys(updates);
      const values = Object.values(updates);
      
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      
      const result = await db.query(
        `UPDATE cases SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id, ...values]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Case not found' });
      }

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      logger.error('Error updating case:', error);
      res.status(500).json({ success: false, error: 'Failed to update case' });
    }
  }

  async deleteCase(req, res) {
    try {
      const { id } = req.params;

      const result = await db.query(
        'DELETE FROM cases WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Case not found' });
      }

      res.json({ success: true, message: 'Case deleted successfully' });
    } catch (error) {
      logger.error('Error deleting case:', error);
      res.status(500).json({ success: false, error: 'Failed to delete case' });
    }
  }

  async startCase(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Check if case exists
      const caseResult = await db.query('SELECT * FROM cases WHERE id = $1', [id]);
      if (caseResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Case not found' });
      }

      // Create or update progress
      const progressResult = await db.query(
        `INSERT INTO progress (user_id, case_id, status, started_at)
         VALUES ($1, $2, 'in_progress', NOW())
         ON CONFLICT (user_id, case_id) 
         DO UPDATE SET status = 'in_progress', started_at = NOW()
         RETURNING *`,
        [userId, id]
      );

      res.json({ success: true, data: progressResult.rows[0] });
    } catch (error) {
      logger.error('Error starting case:', error);
      res.status(500).json({ success: false, error: 'Failed to start case' });
    }
  }

  async solveCase(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { culprit_id } = req.body;

      // Verify culprit
      const suspectResult = await db.query(
        'SELECT * FROM suspects WHERE id = $1 AND case_id = $2',
        [culprit_id, id]
      );

      if (suspectResult.rows.length === 0) {
        return res.status(400).json({ success: false, error: 'Invalid suspect' });
      }

      const isCorrect = suspectResult.rows[0].is_culprit;

      if (isCorrect) {
        // Update progress to solved
        const progressResult = await db.query(
          `UPDATE progress 
           SET status = 'solved', completed_at = NOW(), score = score + 100
           WHERE user_id = $1 AND case_id = $2
           RETURNING *`,
          [userId, id]
        );

        res.json({ 
          success: true, 
          correct: true,
          message: 'Case solved! Excellent detective work.',
          data: progressResult.rows[0]
        });
      } else {
        res.json({
          success: true,
          correct: false,
          message: 'Wrong suspect. The real culprit escaped.'
        });
      }
    } catch (error) {
      logger.error('Error solving case:', error);
      res.status(500).json({ success: false, error: 'Failed to solve case' });
    }
  }
}

module.exports = new CasesController();
