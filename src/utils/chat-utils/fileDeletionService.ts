import {getBucket} from "../../config/connectFirebase";

const deleteFile = async (fileUrl: string): Promise<void> => {
    const bucket = getBucket();

    const urlParts = fileUrl.split(`${bucket.name}/`);
    if (urlParts.length < 2) {
        console.error('Invalid file URL:', fileUrl);
        return;
    }

    const filePath = urlParts[1];
    const fileRef = bucket.file(filePath);

    await fileRef.delete();
};

const deleteUserFiles = async (chatId: string, userId: string): Promise<void> => {
    const bucket = getBucket();
    const folders = ['images', 'files', 'voices'];

    for (const folder of folders) {
        const prefix = `chats/${chatId}/${folder}/${userId}/`;

        const [files] = await bucket.getFiles({ prefix });

        await Promise.all(
            files.map(file => file.delete())
        );
    }
};

const deleteChatFiles = async (chatId: string): Promise<void> => {
    const bucket = getBucket();
    const prefix = `chats/${chatId}/`;

    const [files] = await bucket.getFiles({ prefix });

    await Promise.all(
        files.map(file => file.delete())
    );
};

export const fileDeletionService = {
    deleteFile,
    deleteUserFiles,
    deleteChatFiles
}