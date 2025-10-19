import { v4 as uuidv4 } from 'uuid';
import {MessageType} from "../../modules/chat/database/enums/message.enums";
import {getBucket} from "../../config/connectFirebase";
import {uploadedFileInfo, uploadFileParams} from "../../types/dto/file-params/fileParamsDto";
import {fireBaseConstants} from "../constants/fireBaseConstatnts";
import {filePathHelper} from "./filePathHelper";

const uploadFile = async (params: uploadFileParams): Promise<uploadedFileInfo> => {
    const fileExtension = params.file.originalname.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;

    const firebasePath = filePathHelper.getFirebasePath({
        chatId: params.chatId,
        senderId: params.senderId,
        messageType: params.messageType,
        filename: uniqueFilename
    });

    const bucket = getBucket();
    const fileRef = bucket.file(firebasePath);

    await fileRef.save(params.file.buffer, {
        metadata: {
            contentType: params.file.mimetype,
            metadata: {
                originalName: params.file.originalname,
                uploadedBy: params.senderId,
                chatId: params.chatId,
                messageType: params.messageType
            }
        }
    });


    await fileRef.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${firebasePath}`;

    return {
        url: publicUrl,
        filename: params.file.originalname,
        size: params.file.size,
        mimeType: params.file.mimetype
    };
};

const validateFile = (file: Express.Multer.File, messageType: MessageType): void => {
    switch (messageType) {
        case MessageType.IMAGE:
            if (!file.mimetype.startsWith('image/')) {
                throw new Error('File must be an image');
            }
            if (file.size > fireBaseConstants.MAX_IMAGE_SIZE) {
                throw new Error('Image size must not exceed 10MB');
            }
            break;

        case MessageType.FILE:
            if (file.size > fireBaseConstants.MAX_FILE_SIZE) {
                throw new Error('File size must not exceed 50MB');
            }
            break;

        case MessageType.VOICE:
            if (!file.mimetype.startsWith('audio/')) {
                throw new Error('File must be an audio');
            }
            if (file.size > fireBaseConstants.MAX_VOICE_SIZE) {
                throw new Error('Voice message size must not exceed 10MB');
            }
            break;

        default:
            throw new Error('Invalid message type');
    }
};

export const fileUploadUtil = {
    uploadFile,
    validateFile
};