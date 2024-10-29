import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Github from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/",
        signOut: "/",
        error: "/"
    },
    providers: [
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
        session: async ({ session, token }) => {
            if(session?.user) {
                session.user.id = token.id
                session.user.role = token.role
                session.user.provider = token.provider
                session.user.access_token = token.access_token
                session.user.stripeCurrentPeriodEnd = token.stripeCurrentPeriodEnd
                session.user.stripeCustomerId = token.stripeCustomerId
                session.user.stripePriceId = token.stripePriceId
                session.user.stripeSubscriptionId = token.stripeSubscriptionId
                session.user.stripeCancelledSubscription = token.stripeCancelledSubscription
                session.user.databaseCount = token.databaseCount
                session.user.is2FAEnabled = token.is2FAEnabled
                session.user.twoFASecret = token.twoFASecret
            }
            return session;
        },
        jwt: async ({ user, token , account, req}) => {
            if(user) {
                token.id = user.id
                token.role = user.role
                token.provider = account.provider
                token.access_token = account.access_token
                token.stripeCurrentPeriodEnd = user.stripeCurrentPeriodEnd
                token.stripeCustomerId = user.stripeCustomerId
                token.stripePriceId = user.stripePriceId
                token.stripeSubscriptionId = user.stripeSubscriptionId
                token.stripeCancelledSubscription = user.stripeCancelledSubscription
                token.databaseCount = user.databaseCount
                token.is2FAEnabled = user.is2FAEnabled
            }
            return token;
        },
    }
});
