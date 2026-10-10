import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.MONGODB_URL as string;

const globalForMongo = global as unknown as {
    _mongoClientPromise?: Promise<MongoClient>;
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    if (!globalForMongo._mongoClientPromise) {
        const client = new MongoClient(uri);
        globalForMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalForMongo._mongoClientPromise;
} else {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
}

const client = await clientPromise;
const db = client.db("bazardor");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
    database: mongodbAdapter(db, {
        client,
    }),
});