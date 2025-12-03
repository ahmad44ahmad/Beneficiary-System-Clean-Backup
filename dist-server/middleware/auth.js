import admin from '../config/firebase-admin.js';
export const authenticate = async (req, res, next) => {
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
            };
            return next();
        }
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    }
    catch (error) {
        console.error('Error verifying auth token:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
