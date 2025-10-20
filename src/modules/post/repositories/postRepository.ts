import {prismaClient} from "../../../config/prismaClient";
import {createPostRepoDto, updatePostRepoDto} from "../../../types/dto/post-DTO/postRepoDto";
import {Post} from "@prisma/client";

const createPostById = async (data: createPostRepoDto): Promise<void> => {
    await prismaClient.post.create({data})
}

const findUserPosts = async (): Promise<Post[]> => {
    return prismaClient.post.findMany({
        orderBy: { createdAt: 'desc' },
    });
};

const findPostById = async (postId: string): Promise<Post | null> => {
    return prismaClient.post.findUnique({
        where: { id: postId }
    })
}

const updatePostById = async (data: updatePostRepoDto): Promise<void> => {
    await prismaClient.post.update({
        where: {
            id: data.postId
        },
        data: {
            title: data.title,
            content: data.content,
            isImportant: data.isImportant,
            cardImageUrl: data.cardImageUrl,
        },
    })
}

const deletePostById = async (postId: string): Promise<void> => {
    await prismaClient.post.delete({
        where: {id: postId}
    })
}

export const postRepository = {
    createPostById,
    findUserPosts,
    findPostById,
    updatePostById,
    deletePostById
}