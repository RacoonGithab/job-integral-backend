export const error = {

    // server errors
    INVALID_CREDENTIALS: "Invalid credentials",
    FORBIDDEN: "Access is denied",
    BAD_REQUEST: "Bad request",
    INTERNAL_SERVER_ERROR: "Internal server error",

    // users errors
    USER_NOT_FOUND:  "User not found",
    USER_BLOCKED:  "User blocked",
    EMAIL_NOT_VERIFIED:  "Email not verified",

    // Unauthorized errors
    INCORRECT_PASSWORD: "Password must be a valid password",
    ACTIVE_SESSION_EXISTS: "There is an active session",
    INVALID_AUTHORIZATION_HEADER: "Unauthorized - Invalid Authorization header",
    INVALID_TOKEN_HEADER: "Unauthorized - Invalid token",

    // Verification code errors
    VERIFICATION_CODE_NOT_FOUND: "Verification code not found",
    VERIFICATION_CODE_EXCEEDED_ATTEMPTS_LIMIT: "Verification code entry limit reached, please try sending the code again",
    VERIFICATION_CODE_MISMATCH: "Verification code does not match",
    VERIFICATION_CODE_EXPIRED: "Verification code is expired",
    REQUEST_LIMIT_EXHAUSTED: "Request limit exhausted",
    VERIFICATION_CODE_LIMIT_REACHED: "Daily verification code limit reached",

    // chat errors
    CANNOT_CHAT_WITH_SELF: "You can't create a chat with yourself",
    NOT_ENOUGH_USERS: "Group chat must have at least 2 members",
    CHAT_NOT_FOUND: "The chat does not exist",
    CHAT_ALREADY_DELETED: "Chat has already been deleted",
    WRONG_CHAT_TYPE: "Wrong type",
    CHAT_ARCHIVED: "The chat is already archived",
    TRANSFER_OWNER_REQUIRED: "The creator can't just leave - a transfer of rights is required",
    REPLY_DIFFERENT_CHAT: "Reply DIFFERENT_CHAT",

    // message errors
    TEXT_REQUIRED: "Text is required for TEXT message",
    MAX_TEXT_LEN: "Text is too long (max 4096 characters)",
    INVESTMENT_REQUIRED: "Attachments are required for IMAGE message",
    MESSAGE_NOT_FOUND: "The message was not found.",
}