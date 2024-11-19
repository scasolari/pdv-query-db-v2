// pages/api/daily-events.js
import db from "@/lib/db"; // Assicurati di avere una configurazione Prisma in /lib/prisma.js

export default async function handler(req, res) {
    const {organizationId} = req.query;
    try {
        const events = await db.event.groupBy({
            by: ['createdAt'],
            _count: {
                event_name: true,
            },
            where: {
                organizationId: organizationId,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        const formattedData = events.map(event => ({
            day: event.createdAt,
            events: event._count.event_name,
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error fetching daily events", error);
        res.status(500).json({ error: "Error fetching daily events" });
    }
}
