import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    
    const token = req.session.token;
    
    if (!token) {
        return res.redirect('/');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        
        if (err) {
            req.session.destroy();
            return res.redirect('/');   
        }
        
        req.name = decoded.name;
        req.userId = decoded.id;
        next();
    });
};