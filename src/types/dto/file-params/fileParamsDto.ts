import {MessageType} from "../../../modules/chat/database/enums/message.enums";

export interface uploadFileParams {
    chatId: string;
    senderId: string;
    file: Express.Multer.File;
    messageType: MessageType;
}

export interface uploadedFileInfo {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
}

export interface getFirebasePathDto {
    chatId: string,
    senderId: string,
    messageType: MessageType,
    filename: string
}