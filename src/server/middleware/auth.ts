import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase-admin.js';

export interface AuthRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        // MOCK AUTH FOR DEVELOPMENT
        if (token === 'mock-token') {
            req.user = {
                uid: 'dev-user-123',
                email: 'dev@example.com',
                email_verified: true,
            } as admin.auth.DecodedIdToken;
            return next();
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying auth token:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
