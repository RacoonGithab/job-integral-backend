import {Server, Socket} from "socket.io";
import {chatMembersRepository} from "../../repositories/chatMembersRepository";
import {messageService} from "../../services/messageService";
import {sendMessageDto} from "../../../../types/dto/message-DTO/messageDto";
import {messageRepository} from "../../repositories/messageRepository";

const onlineUsers = new Map();

export default function chatSocket(io: Server, socket: Socket) {
    const { userId, chatId } = socket.handshake.auth || {};

    if (!userId) {
        socket.disconnect();
        return;
    }

    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    if (chatId) {
        socket.join(chatId);
        socket.broadcast.to(chatId).emit("user online", userId);

        chatMembersRepository.findActiveMembersByChatId(chatId)
            .then(participants => {

                const onlineInChat = participants
                    .filter(p => p.userId.toString() !== userId && onlineUsers.has(p.userId.toString()))
                    .map(p => p.userId.toString());

                socket.emit("users online", onlineInChat);

            }).catch(console.error);
    }

    socket.on("leave chat", ({ chatId }) => {
        socket.leave(chatId);
        onlineUsers.get(userId)?.delete(socket.id);

        if (!onlineUsers.has(userId) || onlineUsers.get(userId).size === 0) {
            socket.broadcast.to(chatId).emit("user offline", userId);
            onlineUsers.delete(userId);
        }
    });

    socket.on("disconnect", () => {
        onlineUsers.get(userId)?.delete(socket.id);
        if (!onlineUsers.has(userId) || onlineUsers.get(userId).size === 0) {
            socket.broadcast.to(chatId).emit("user offline", userId);
            onlineUsers.delete(userId);
        }
    });

    socket.on("chat message", async (msg) => {
        if (!msg?.text?.trim()) return;

        try {
            const messageDto: sendMessageDto = {
                chatId,
                senderId: userId,
                type: msg.type,
                text: msg.text,
                attachments: msg.attachments,
                replyTo: msg.replyTo,
                systemType: msg.systemType,
            };

            const message = await messageService.sendMessage(messageDto);

            const readByUserIds = message.readBy instanceof Map
                ? Array.from(message.readBy.keys())
                : [];

            const messageForClient = {
                id: message._id || message.id,
                text: message.content.text,
                senderId: message.senderId,
                name: message.senderInfo?.displayName,
                createdAt: message.timestamp,
                chatId,
                readBy: readByUserIds,
            };


            io.to(chatId).emit("chat message", messageForClient);

            const participants = await chatMembersRepository.findActiveMembersByChatId(chatId);

            for (const p of participants) {
                if (p.userId.toString() !== userId) {
                    const unreadCount = await messageRepository.getUnreadCount({chatId, userId: p.userId});
                    io.to(`user:${p.userId}`).emit("chat updated", {
                        chatId,
                        lastMessage: messageForClient,
                        unreadCount,
                    });
                }
            }
        } catch (err) {
            console.error("Error sending message:", err);
        }
    });

    socket.on("mark as read", async ({ messageId, chatId }) => {
        try {
            await messageRepository.markMessageRead({messageId, userId});
            io.to(chatId).emit("chat read", {
                chatId,
                messageIds: [messageId],
                readerId: userId,
            });
        } catch (err) {
            console.error("Error while marking as read:", err);
        }
    });
}
