export interface createUserProfileRepoDto {
    userId: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    avatar?: string;
    companyName?: string;
}

export interface updateUserProfileRepoDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    companyName?: string;
    avatar?: string | null;
}