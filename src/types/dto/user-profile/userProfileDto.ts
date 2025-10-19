export interface createUserProfileDto {
    userId: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    companyName?: string;
}


export interface createUserProfileDtoExtended extends createUserProfileDto {
    avatarFile?: Express.Multer.File;
}


export interface updateUserProfileDto {
    userId: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    companyName?: string;
    avatarFile?: Express.Multer.File;
}