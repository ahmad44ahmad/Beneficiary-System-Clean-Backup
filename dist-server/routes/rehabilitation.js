import { Router } from 'express';
import { query } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { toCamelCase, toSnakeCase } from '../utils/caseConverter.js';
const router = Router();
router.use(authenticate);
// GET rehabilitation plans
router.get('/', async (req, res) => {
    try {
        const { beneficiary_id } = req.query;
        let sql = `
      SELECT rp.*, 
             json_agg(rg.*) as goals 
      FROM rehabilitation_plans rp
      LEFT JOIN rehabilitation_goals rg ON rp.id = rg.plan_id
    `;
        const params = [];
        if (beneficiary_id) {
            sql += ' WHERE rp.beneficiary_id = $1';
            params.push(beneficiary_id);
        }
        sql += ' GROUP BY rp.id ORDER BY rp.created_at DESC';
        const result = await query(sql, params);
        res.json(toCamelCase(result.rows));
    }
    catch (error) {
        console.error('Error fetching rehabilitation plans:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// POST create rehabilitation plan
router.post('/', async (req, res) => {
    try {
        const { beneficiary_id, start_date, end_date, created_by } = toSnakeCase(req.body);
        const sql = `
      INSERT INTO rehabilitation_plans (beneficiary_id, start_date, end_date, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const result = await query(sql, [beneficiary_id, start_date, end_date, created_by]);
        res.status(201).json(toCamelCase(result.rows[0]));
    }
    catch (error) {
        console.error('Error creating rehabilitation plan:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// POST add goal to plan
router.post('/goals', async (req, res) => {
    try {
        const { plan_id, title, description, category, target_date } = toSnakeCase(req.body);
        const sql = `
      INSERT INTO rehabilitation_goals (plan_id, title, description, category, target_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const result = await query(sql, [plan_id, title, description, category, target_date]);
        res.status(201).json(toCamelCase(result.rows[0]));
    }
    catch (error) {
        console.error('Error adding goal:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// PUT update goal progress
router.put('/goals/:id/progress', async (req, res) => {
    try {
        const { id } = req.params;
        const { progress } = req.body;
        const sql = `
      UPDATE rehabilitation_goals 
      SET progress = $1, updated_at = NOW() 
      WHERE id = $2 
      RETURNING *
    `;
        const result = await query(sql, [progress, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Goal not found' });
        }
        res.json(toCamelCase(result.rows[0]));
    }
    catch (error) {
        console.error('Error updating goal progress:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// PUT approve plan
router.put('/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
      UPDATE rehabilitation_plans 
      SET status = 'active', updated_at = NOW() 
      WHERE id = $1 
      RETURNING *
    `;
        const result = await query(sql, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Plan not found' });
        }
        res.json(toCamelCase(result.rows[0]));
    }
    catch (error) {
        console.error('Error approving plan:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;
