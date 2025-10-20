export interface createPostRepoDto {
    title: string;
    content: string;
    isImportant?: boolean;
    cardImageUrl?: string | null;
}


export interface updatePostRepoDto {
    postId: string;
    title?: string;
    content?: string;
    isImportant?: boolean;
    cardImageUrl?: string | null;
}