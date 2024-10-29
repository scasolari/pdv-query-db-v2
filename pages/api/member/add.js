import { getToken } from "next-auth/jwt";
import db from "@/lib/db";

export default async function handler(req, res) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { email, name, id, organizationOwner } = req.body;

    if (session) {
        await db.$connect();

        // Controlla se l'email esiste nella tabella user
        const userExists = await db.user.findUnique({
            where: { email: email }
        });

        if (!userExists) {
            await db.$disconnect();
            return res.status(404).json({ message: 'The user you are inviting was not found on Placedv. Make sure the user has signed up for Placedv.' });
        }

        // Controlla se l'email esiste già nella tabella members per la stessa organizzazione
        const memberExists = await db.member.findFirst({
            where: {
                email: email,
                organizationId: id // Assumendo che l'organizzazioneId sia unico per ogni membro
            }
        });

        if (memberExists) {
            await db.$disconnect();
            return res.status(409).json({ message: 'User is already a member of this organization.' });
        }

        // Controlla se l'email del nuovo membro è uguale a quella del proprietario dell'organizzazione
        if (email === organizationOwner) {
            await db.$disconnect();
            return res.status(400).json({ message: 'User cannot be the owner of the organization.' });
        }

        // Aggiungi il nuovo membro
        const addDatabase = await db.member.create({
            data: {
                email: email,
                organizationId: id,
                organizationName: name,
                organizationOwner: organizationOwner
            }
        });

        await db.$disconnect();
        return res.status(201).json(addDatabase);
    } else {
        return res.status(401).json({ message: 'User not authorized.' });
    }
}
