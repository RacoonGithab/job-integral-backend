import {MessageType} from "../../modules/chat/database/enums/message.enums";
import {getFirebasePathDto} from "../../types/dto/file-params/fileParamsDto";

const getTypeFolder = (messageType: MessageType): string => {
    switch (messageType) {
        case MessageType.IMAGE:
            return 'images';
        case MessageType.FILE:
            return 'files';
        case MessageType.VOICE:
            return 'voices';
        default:
            throw new Error('Invalid message type for file upload');
    }
};

const getFirebasePath = (data: getFirebasePathDto): string => {
    const typeFolder = getTypeFolder(data.messageType);
    return `chats/${data.chatId}/${typeFolder}/${data.senderId}/${data.filename}`;
};

export const filePathHelper = {
    getTypeFolder,
    getFirebasePath,
}