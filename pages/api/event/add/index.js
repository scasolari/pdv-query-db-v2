import {getToken} from "next-auth/jwt";
import db from "@/lib/db";
import moment from "moment";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63343');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const { event_name, user_id, organizationId } = req.body;
    await db.$connect()
    const addDatabase = await db.event.create({
        data: {
            event_name: event_name,
            user_id: user_id,
            organizationId: organizationId,
            createdAt: moment(new Date()).format('L')
        }
    })
    const stringifyResponse = JSON.stringify(addDatabase)
    await db.$disconnect()
    return res.status(201).json(JSON.parse(stringifyResponse))
}
