import {
    uploadedFileInfo,
    uploadPostCardsParamsDto
} from "../../types/dto/file-params/fileParamsDto";
import {v4 as uuidv4} from "uuid";
import {filePathHelper} from "../chat-utils/filePathHelper";
import {getBucket} from "../../config/connectFirebase";

const uploadCardFile = async (params: uploadPostCardsParamsDto): Promise<uploadedFileInfo> => {
    const fileExtension = params.file.originalname.split('.').pop();

    const uniqueFilename = `${uuidv4()}.${fileExtension}`;

    const firebasePath = filePathHelper.getFirebasePostCardPath({
        userId: params.userId,
        postId: params.postId,
        filename: uniqueFilename
    });

    const bucket = getBucket();
    const fileRef = bucket.file(firebasePath);

    await fileRef.save(params.file.buffer, {
        metadata: {
            contentType: params.file.mimetype,
            metadata: {
                originalName: params.file.originalname,
                uploadedBy: params.userId,
                fileType: 'avatar',
            }
        }
    });


    await fileRef.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${firebasePath}`;

    return {
        url: publicUrl,
        filename: uniqueFilename,
        size: params.file.size,
        mimeType: params.file.mimetype,
    };
};


const deleteFileIfExists = async (fileUrl?: string) => {
    if (!fileUrl) return;

    const bucket = getBucket();
    const bucketName = bucket.name;

    const storageBaseUrl = `https://storage.googleapis.com/${bucketName}/`;

    if (!fileUrl.startsWith(storageBaseUrl)) return;

    const filePath = fileUrl.substring(storageBaseUrl.length);
    const fileRef = bucket.file(filePath);

    const [exists] = await fileRef.exists();
    if (exists) {
        await fileRef.delete();
    }
};

export const cardServiceUtil = {
    uploadCardFile,
    deleteFileIfExists,
}