import {Request, Response} from "express";
import {userProfileService} from "../service/userProfileService";

const createUserprofile = async (req: Request, res: Response) => {
    const userId = req.body.userId;

    const { firstName, lastName, email, phoneNumber, companyName } = req.body;

    await userProfileService.createUserProfile({
        firstName,
        lastName,
        userId,
        email,
        phoneNumber,
        avatarFile: req.file,
        companyName
    });

    res.status(201).json();
}

const updateUserProfile = async (req: Request, res: Response) => {
    const userId = req.body.userId;

    const { firstName, lastName, email, phoneNumber, companyName } = req.body;

    await userProfileService.updateUserProfile({
        firstName,
        lastName,
        userId,
        email,
        phoneNumber,
        avatarFile: req.file,
        companyName
    });

    res.status(201).json();
}

const getUserProfile = async (req: Request, res: Response) => {
    const userId = req.body.userId;

    const userProfile = await userProfileService.getUserProfile(userId);

    res.status(200).json(userProfile);
}


export const userProfileController = {
    createUserprofile,
    updateUserProfile,
    getUserProfile
}