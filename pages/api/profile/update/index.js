import {getToken} from "next-auth/jwt";
import db from "@/lib/db";

export default async function handler(req, res) {
    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const { name, id } = req.body;
    if(session){
        await db.$connect()
        const addDatabase = await db.user.update({
            where: {
                id: id
            },
            data: {
                name: name,
            }
        })
        const stringifyResponse = JSON.stringify(addDatabase)
        await db.$disconnect()
        return res.status(201).json(JSON.parse(stringifyResponse))
    } else {
        return res.status(400).json({message: 'User not authorized.'})
    }
}
