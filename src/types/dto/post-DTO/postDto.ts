export interface createPostDto {
    userId: string;
    title: string;
    content: string;
    isImportant?: boolean;
    cardImageUrl?: Express.Multer.File;
}

export interface findPostDto {
    userId: string;
    postId: string;
}

export interface updatePostDto {
    userId: string;
    postId: string;
    title?: string;
    content?: string;
    isImportant?: boolean;
    cardImageUrl?: Express.Multer.File;
}

export interface deletePostDto {
    userId: string;
    postId: string;
}