import {env} from "../../config/secrets"

export const createVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const createExpirationDate = (date: Date): Date => {

    return new Date(date.getTime() + parseInt(env.VERIFICATION_CODE_TTL));
}