import {getToken} from "next-auth/jwt";
import { PrismaClient } from '@prisma/client'
import db from "@/lib/db";

export const prisma = new PrismaClient()

export default async function handler(req, res) {
    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    if(session){
        await prisma.$connect()
        const fetchDatabase = await db.database.findMany({
            where: {
                userId: session.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                settings: true,
                dbUserPermission: true,
                isProdDb: true,
                createdAt: true,
            }
        })
        await prisma.$disconnect()
        return res.status(200).json(fetchDatabase);
    } else {
        return res.status(400).json({message: 'User not authorized.'})
    }
}
