import {createPostDto, deletePostDto, findPostDto, updatePostDto} from "../../../types/dto/post-DTO/postDto";
import {userRepository} from "../../auth/repositories/userRepository";
import ApiError from "../../../error/ApiError";
import {error} from "../../../utils/constants/errorMasseges";
import {postRepository} from "../repositories/postRepository";
import {cardServiceUtil} from "../../../utils/post-utils/cardServiceUtil";
import {Post} from "@prisma/client";


const createPost = async (data: createPostDto): Promise<void> => {
    const userDb = await userRepository.getUserById(data.userId)

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (userDb.isBlocked) {
        throw new ApiError(401, error.USER_BLOCKED)
    }

    let cardImageUrl: string | null = null;

    if (data.cardImageUrl) {
        const uploadedFile = await cardServiceUtil.uploadCardFile({
            file: data.cardImageUrl,
            userId: data.userId,
            postId: "",
        });
        cardImageUrl = uploadedFile.url;
    }

    await postRepository.createPostById({
        title: data.title,
        content: data.content,
        isImportant: data.isImportant,
        cardImageUrl,
    })
}

const findPosts = async (userId: string): Promise<Post[]> => {
    const userDb = await userRepository.getUserById(userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (userDb.isBlocked) {
        throw new ApiError(401, error.USER_BLOCKED)
    }

    return postRepository.findUserPosts()
}

const findPostById = async (data: findPostDto): Promise<Post | null> => {
    const userDb = await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (userDb.isBlocked) {
        throw new ApiError(401, error.USER_BLOCKED)
    }

    return postRepository.findPostById(data.postId)
}

const updatePost = async (data: updatePostDto): Promise<void> => {
    const userDb = await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (userDb.isBlocked) {
        throw new ApiError(401, error.USER_BLOCKED)
    }

    const postDb = await postRepository.findPostById(data.postId);

    if (!postDb) {
        throw new ApiError(404, error.NOT_FOUND)
    }

    let cardImageUrl = postDb.cardImageUrl;

    if (data.cardImageUrl) {
        await cardServiceUtil.deleteFileIfExists(postDb.cardImageUrl ?? undefined);

        const uploadedFile = await cardServiceUtil.uploadCardFile({
            file: data.cardImageUrl,
            userId: data.userId,
            postId: data.postId,
        });

        cardImageUrl = uploadedFile.url;
    }

    await postRepository.updatePostById({
        postId: data.postId,
        title: data.title,
        content: data.content,
        isImportant: data.isImportant,
        cardImageUrl,
    });
}

const deletePost = async (data: deletePostDto): Promise<void> => {
    const userDb = await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (userDb.isBlocked) {
        throw new ApiError(401, error.USER_BLOCKED)
    }

    const postDb = await postRepository.findPostById(data.postId);

    if (!postDb) {
        throw new ApiError(404, error.NOT_FOUND)
    }

    await cardServiceUtil.deleteFileIfExists(postDb.cardImageUrl ?? undefined);

    await postRepository.deletePostById(data.postId);
}

export const postService = {
    createPost,
    findPosts,
    findPostById,
    updatePost,
    deletePost
}
