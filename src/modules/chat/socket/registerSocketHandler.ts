import chatSocket from "./chat/chatSocket";
import userSocket from "./user/userSocket";
import {Server, Socket} from "socket.io";

export default function registerSocketHandler(io: Server) {
    io.on("connection", (socket: Socket) => {
        chatSocket(io, socket);
        userSocket(io, socket);

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
}
