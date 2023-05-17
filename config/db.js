import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
const url = process.env.DB_URL;
const conectarDB = async () => {
    try {
        const conecction = await mongoose.connect(url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
    } catch (error) {
        console.log(`error : ${error.message}`);
        process.exit(1);
    }
}

export default conectarDB;