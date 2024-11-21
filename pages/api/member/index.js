import {getToken} from "next-auth/jwt";
import { PrismaClient } from '@prisma/client'
import db from "@/lib/db";

export default async function handler(req, res) {
    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const {organizationId} = req.query;
    if(session){
        await db.$connect()
        const fetchDatabase = await db.member.findMany({
            where: {
                organizationId: organizationId,
            },
            orderBy: {
                createdAt: 'asc'
            },
            select: {
                id: true,
                email: true,
                status: true,
                createdAt: true,
                organizationOwner: true
            }
        })
        await db.$disconnect()
        return res.status(201).json(fetchDatabase)
    } else {
        return res.status(400).json({message: 'User not authorized.'})
    }
}
