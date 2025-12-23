import { Router } from 'express';
import { query } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { toCamelCase, toSnakeCase } from '../utils/caseConverter.js';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticate);

// GET all beneficiaries
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        let sql = 'SELECT * FROM beneficiaries';
        const params: any[] = [];

        if (status) {
            sql += ' WHERE status = $1';
            params.push(status);
        }

        sql += ' ORDER BY created_at DESC';

        const result = await query(sql, params);
        res.json(toCamelCase(result.rows));
    } catch (error) {
        console.error('Error fetching beneficiaries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET beneficiary by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM beneficiaries WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Beneficiary not found' });
        }

        res.json(toCamelCase(result.rows[0]));
    } catch (error) {
        console.error('Error fetching beneficiary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST create beneficiary
router.post('/', async (req, res) => {
    try {
        const {
            full_name,
            national_id,
            gender,
            dob,
            enrollment_date,
            status,
            room_number,
            bed_number,
            guardian_name,
            guardian_phone,
        } = toSnakeCase(req.body);

        const sql = `
      INSERT INTO beneficiaries (
        full_name, national_id, gender, dob, enrollment_date, status,
        room_number, bed_number, guardian_name, guardian_phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

        const values = [
            full_name,
            national_id,
            gender,
            dob,
            enrollment_date || new Date(),
            status || 'active',
            room_number,
            bed_number,
            guardian_name,
            guardian_phone,
        ];

        const result = await query(sql, values);
        res.status(201).json(toCamelCase(result.rows[0]));
    } catch (error) {
        console.error('Error creating beneficiary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT update beneficiary
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = toSnakeCase(req.body);

        // Construct dynamic update query
        const fields = Object.keys(updates);
        const values = Object.values(updates);

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No updates provided' });
        }

        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
        const sql = `UPDATE beneficiaries SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`;

        const result = await query(sql, [id, ...values]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Beneficiary not found' });
        }

        res.json(toCamelCase(result.rows[0]));
    } catch (error) {
        console.error('Error updating beneficiary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE beneficiary
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Hard delete for now, can be changed to soft delete (update status to 'archived')
        const result = await query('DELETE FROM beneficiaries WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Beneficiary not found' });
        }

        res.json({ message: 'Beneficiary deleted successfully' });
    } catch (error) {
        console.error('Error deleting beneficiary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
