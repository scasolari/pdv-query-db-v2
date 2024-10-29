import {getToken} from "next-auth/jwt";
import db from "@/lib/db";

export default async function handler(req, res) {
    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const { name } = req.body;
    const { id } = req.query;
    if(session){
        await db.$connect()
        const addDatabase = await db.organization.update({
            where: {
                id: id
            },
            data: {
                userId: session.id,
                name: name,
            }
        })
        await db.member.updateMany({
            where: {
                organizationId: id
            },
            data: {
                organizationName: name
            }
        })
        const stringifyResponse = JSON.stringify(addDatabase)
        await db.$disconnect()
        return res.status(201).json(JSON.parse(stringifyResponse))
    } else {
        return res.status(400).json({message: 'User not authorized.'})
    }
}
