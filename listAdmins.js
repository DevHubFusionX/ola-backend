require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const listAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const admins = await Admin.find({});
        console.log('Admins in DB:', admins.map(a => ({ email: a.email, id: a._id })));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listAdmins();
