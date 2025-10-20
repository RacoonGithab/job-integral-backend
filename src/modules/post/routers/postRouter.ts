import express from "express";
import {accessTokenValidation} from "../../../middlewares/accessTokenValidation";
import {requireRole} from "../../../middlewares/roleCheckMiddleware";
import {validateRequestBody} from "../../../middlewares/validateRequestBody";
import {catchAsync} from "../../../middlewares/catchAsync";
import {postController} from "../controllers/postControler";
import {createPostSchema} from "../schema/createPostSchema";
import {upload} from "../../../config/multerConfig";
import {validateImageFile} from "../../../middlewares/validateAvatarFile";

const postRouter = express.Router();

postRouter.post(
    "/",
    upload.single("cardImageUrl"),
    accessTokenValidation,
    validateImageFile,
    requireRole("ADMIN"),
    validateRequestBody(createPostSchema),
    catchAsync(postController.createPost)
);

postRouter.get(
    "/",
    accessTokenValidation,
    catchAsync(postController.findPosts)
);

postRouter.get(
    "/:postId",
    accessTokenValidation,
    catchAsync(postController.findPostById)
);

postRouter.patch(
    "/:postId",
    upload.single("cardImageUrl"),
    accessTokenValidation,
    validateImageFile,
    requireRole("ADMIN"),
    validateRequestBody(createPostSchema.partial()),
    catchAsync(postController.updatePost)
);

postRouter.delete(
    "/:postId",
    accessTokenValidation,
    requireRole("ADMIN"),
    catchAsync(postController.deletePost)
);

export default postRouter;