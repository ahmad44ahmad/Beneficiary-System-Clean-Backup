import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import beneficiariesRouter from './routes/beneficiaries.js';
import rehabilitationRouter from './routes/rehabilitation.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/beneficiaries', beneficiariesRouter);
app.use('/api/rehabilitation', rehabilitationRouter);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
