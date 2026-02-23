const bcrypt = require('bcrypt');
const express = require('express');
const PORT = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // assuming register.html is in /public folder


const app = express();
app.use(cors());
app.use(bodyParser.json());
const path = require('path');
app.use(express.static(path.join(__dirname, 'backend')));


// ✅ Add this route to test in browser
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Input validation middleware
const validateRegistration = (req, res, next) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ 
            field: 'username',
            message: 'All fields are required' 
        });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ 
            field: 'password',
            message: 'Password must be at least 6 characters' 
        });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ 
            field: 'email',
            message: 'Invalid email format' 
        });
    }
    
    next();
};

app.post('/register', validateRegistration, async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const checkUser = await new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM users WHERE username = ? OR email = ?',
                [username, email],
                (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });

        if (checkUser.length > 0) {
            const existingField = checkUser[0].username === username ? 'username' : 'email';
            return res.status(400).json({ 
                field: existingField,
                message: `${existingField === 'username' ? 'Username' : 'Email'} already exists`
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });

        res.json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM users WHERE username = ?',
                [username],
                (err, results) => {
                    if (err) reject(err);
                    resolve(results[0]);
                }
            );
        });

        if (!user) {
            return res.status(401).json({ 
                field: 'username',
                message: 'Invalid username' 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                field: 'password',
                message: 'Invalid password' 
            });
        }

        res.json({ 
            message: 'Login successful',
            username: user.username,
            email: user.email
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
