import {getToken} from "next-auth/jwt";
import db from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
});

export default async function handler(req, res) {
    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const { form } = req.body;
    if(session){

        const moderation_name = await openai.moderations.create({ input: form.name });
        const moderation_string = await openai.moderations.create({ input: form.settings });
        if(moderation_name.results[0].flagged === true || moderation_string.results[0].flagged === true){
            return res.status(400).json({
                message: 'Your inputs violating Placedv Query\'s content policy.'
            })
        }

        await db.$connect()
        const addDatabase = await db.database.create({
            data: {
                userId: session.id,
                name: form.name,
                settings: form.settings,
                dbUserPermission: form.dbUserPermission,
                isProdDb: form.isProdDb,
            }
        })
        const stringifyResponse = JSON.stringify(addDatabase)
        await db.$disconnect()
        return res.status(201).json(JSON.parse(stringifyResponse))
    } else {
        return res.status(400).json({message: 'User not authorized.'})
    }
}
