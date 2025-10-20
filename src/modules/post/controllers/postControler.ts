import { Request, Response } from 'express';
import {postService} from "../services/postService";

const createPost  = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const { title, content, isImportant} = req.body;

    await postService.createPost({
        userId,
        title,
        content,
        isImportant,
        cardImageUrl: req.file,
    });

    res.status(201).json({});
}

const findPosts = async (req: Request, res: Response) => {
    const userId = req.body.userId;

    const posts = await postService.findPosts(userId);

    res.status(201).json({posts});
}

const findPostById  = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const postId = req.params.postId;

    const post = await postService.findPostById({ userId, postId });

    res.status(201).json({post})
}

const updatePost = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const postId = req.params.postId;
    const { title, content, isImportant } = req.body;

    await postService.updatePost({
        userId,
        postId,
        title,
        content,
        isImportant,
        cardImageUrl: req.file,
    });

    res.status(201).json({});
}

const deletePost = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const postId = req.params.postId;

    await postService.deletePost({ userId, postId });

    res.status(204).json({});
}

export const postController = {
    createPost,
    findPosts,
    findPostById,
    updatePost,
    deletePost
}