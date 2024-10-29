import {getToken} from "next-auth/jwt";
import * as fs from "fs";
import * as pg from 'pg';
const { Sequelize } = require('sequelize');



export default async function handler(req, res) {
    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const { form } = req.body;
    if(session){
        const sequelize = process.env.NODE_ENV === "development"
            ? new Sequelize(form.settings)
            : new Sequelize(form.settings, {dialectOptions: {
                    ssl: {
                        minVersion: 'TLSv1.2',
                        ca: fs.readFileSync(process.env.PATH_TLS, "utf8"),
                        rejectUnauthorized: false
                    },
                    dialectModule: [require('mysql2'), pg],
                }})
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
            await sequelize.close()
            return res.status(200).json({message: 'Connection has been established successfully.'})
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            await sequelize.close()
            return res.status(400).json({message: 'Unable to connect to the database:', error})
        }
    } else {
        return res.status(400).json({message: 'User not authorized.'})
    }
}
