import {getToken} from "next-auth/jwt";
import { PrismaClient } from '@prisma/client'
import db from "@/lib/db";

export default async function handler(req, res) {
    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const { email } = req.body;
    if(session){
        await db.$connect()
        const fetchDatabase = await db.member.findMany({
            where: {
                email: email,
                AND: {
                    status: "pending"
                }
            },
            orderBy: {
                createdAt: 'asc'
            },
            select: {
                id: true,
                email: true,
                status: true,
                organizationId: true,
                organizationName: true
            }
        })
        await db.$disconnect()
        return res.status(201).json(fetchDatabase)
    } else {
        return res.status(400).json({message: 'User not authorized.'})
    }
}
