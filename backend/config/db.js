const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // ✅ Change MONGO_URI to MONGODB_URI to match your Render settings
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1); 
    }
};

module.exports = connectDB;