import {Server, Socket} from "socket.io";

export default function userSocket(_io: Server, socket: Socket) {
    const { userId, page } = socket.handshake.auth || {};
    if (userId && page === "list") {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} in the chat list room`);
    }
}
