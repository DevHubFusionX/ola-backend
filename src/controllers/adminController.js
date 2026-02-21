const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'moderate_ustaz_secret_key_2024';

const Admin = require('../../models/Admin');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    console.log('Password length:', password ? password.length : 0);

    try {
        const cleanedEmail = email ? email.trim().toLowerCase() : '';
        const admin = await Admin.findOne({ email: cleanedEmail });

        if (!admin) {
            console.log('Admin not found in database for truncated/lower email:', cleanedEmail);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await admin.comparePassword(password);
        if (!validPassword) {
            console.log('Invalid password for:', cleanedEmail);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('Login successful for:', cleanedEmail);
        const token = jwt.sign({ email: admin.email, id: admin._id }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const { email } = req.user;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const validPassword = await admin.comparePassword(currentPassword);
        if (!validPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        admin.password = newPassword;
        await admin.save();
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.changeEmail = async (req, res) => {
    const { currentPassword, newEmail } = req.body;
    const { email } = req.user;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const validPassword = await admin.comparePassword(currentPassword);
        if (!validPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        admin.email = newEmail;
        await admin.save();
        res.json({ message: 'Email changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.verifyToken = (req, res) => {
    res.json({ valid: true, user: req.user });
};
