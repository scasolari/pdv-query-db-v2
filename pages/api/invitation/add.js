import { getToken } from "next-auth/jwt";
import db from "@/lib/db";

export default async function handler(req, res) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { id } = req.body; // Estrai email e organizationId da req.body

    if (session) {
        await db.$connect();

        const updatedMember = await db.member.update({
            where: { id: id }, // Usa l'id per aggiornare
            data: {
                status: "accepted",
            }
        });

        await db.$disconnect();
        return res.status(201).json(updatedMember);
    } else {
        return res.status(400).json({ message: 'User not authorized.' });
    }
}
