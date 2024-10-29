import {getToken} from "next-auth/jwt";
import { PrismaClient } from '@prisma/client'
import db from "@/lib/db";

export const prisma = new PrismaClient()

export default async function handler(req, res) {
    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const {organizationId} = req.query;
    if(session){
        await prisma.$connect()
        const fetchDatabase = await db.member.delete({
            where: {
                organizationId: organizationId,
            }
        })
        await prisma.$disconnect()
        return res.status(201).json(fetchDatabase)
    } else {
        return res.status(400).json({message: 'User not authorized.'})
    }
}
