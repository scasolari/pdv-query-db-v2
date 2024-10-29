import {getToken} from "next-auth/jwt";
import db from "@/lib/db";

export default async function handler(req, res) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!session) {
        return res.status(401).json({ message: 'User not authorized.' });
    }

    try {
        await prisma.$connect();
        const fetchDatabase = await db.organization.findMany({
            where: {
                OR: [
                    { userId: session.id },
                    {
                        members: {
                            some: {
                                email: session.email,
                                status: "accepted"
                            }
                        }
                    }
                ]
            },
            orderBy: {
                createdAt: 'asc'
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                members: {
                    where: {
                        status: "accepted" // Filtra i membri da restituire
                    },
                    select: {
                        email: true
                    }
                }
            }
        });
        return res.status(200).json(fetchDatabase);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    } finally {
        await prisma.$disconnect();
    }
}
