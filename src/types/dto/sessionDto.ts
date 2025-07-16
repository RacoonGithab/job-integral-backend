export interface createSessionDto {
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface updateSessionDto {
    id: string;
    updatedAt: Date;
}

export interface refreshTokenDto {
    userId: string;
    sessionId: string;
}