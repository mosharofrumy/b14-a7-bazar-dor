import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.MONGODB_URL as string;

// সার্ভারলেসে বারবার কানেকশন ওপেন হওয়া রোধ করতে গ্লোবাল ভেরিয়েবল ব্যবহার
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    // ডেভেলপমেন্ট মোডে গ্লোবাল ভেরিয়েবল ব্যবহার করা যাতে হট রিলোডিংয়ে অতিরিক্ত কানেকশন না হয়
    if (!(global as any)._mongoClientPromise) {
        client = new MongoClient(uri);
        (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
} else {
    // প্রডাকশন (ভার্সেল) মোডের জন্য
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

// ডাটাবেজ ইনস্ট্যান্স ইনিশিয়ালাইজ করার জন্য অ্যাসিনক্রোনাস ব্যবস্থা বা প্রমিজ হ্যান্ডেলিং
const getDb = async () => {
    const connectedClient = await clientPromise;
    return connectedClient.db("bazardor");
};

// Better Auth কনফিগারেশন
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
    database: mongodbAdapter(await getDb(), {
        client: await clientPromise,
    }),
});