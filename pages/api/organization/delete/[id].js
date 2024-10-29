import {getToken} from "next-auth/jwt";
import db from "@/lib/db";

export default async function handler(req, res) {
    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const { id } = req.query;
    console.log(id)
    if(session){
        await db.$connect()
        await db.member.deleteMany({
            where: {
                organizationId: id
            }
        })
        await db.organization.delete({
            where: {
                id: id
            }
        })
        const stringifyResponse = JSON.stringify({message: "Organization deleted successfully."})
        await db.$disconnect()
        return res.status(201).json(JSON.parse(stringifyResponse))
    } else {
        return res.status(400).json({message: 'User not authorized.'})
    }
}
