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
    originalName?: string;
}

export interface getFirebasePathDto {
    chatId: string,
    senderId: string,
    messageType: MessageType,
    filename: string
}

export interface getFirebaseAvatarPathDto {
    userId: string;
    filename: string
}

export interface uploadAvatarParamsDto {
    file: Express.Multer.File;
    userId: string;
}

export interface uploadPostCardsParamsDto {
    file: Express.Multer.File;
    postId: string;
    userId: string;
}

export interface getFirebasePostCardsPathDto {
    userId: string;
    postId: string;
    filename: string
}

