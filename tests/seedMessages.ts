import { createTestMessages } from "./createdMessagesUsers";
import {connectMongo} from "../src/config/connectMongo";

async function run() {
    try {
        await connectMongo();

        const chatId = "68ebd33461a153f1d2536380";
        const userIds = [
            "68ebd33461a153f1d2536382",
            "68ebd33461a153f1d2536383",
            "68ebd33461a153f1d2536384"
        ];
        const messagesPerUser = 25;

        const createdMessages = await createTestMessages({
            chatId,
            userIds,
            messagesPerUser,
            baseText: "Hello from seed"
        });

        console.log(`Created ${createdMessages.length} messages`);
        process.exit(0);
    } catch (err) {
        console.error("Error creating test messages:", err);
        process.exit(1);
    }
}

run();
