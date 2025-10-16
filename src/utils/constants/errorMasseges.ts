export const error = {

    // server errors
    INVALID_CREDENTIALS: "Invalid credentials",
    FORBIDDEN: "Access is denied",
    BAD_REQUEST: "Bad request",
    INTERNAL_SERVER_ERROR: "Internal server error",
    SERVER_ERROR: "Server error",

    // users errors
    USER_NOT_FOUND:  "User not found",
    USER_BLOCKED:  "User blocked",
    EMAIL_NOT_VERIFIED:  "Email not verified",
    NOT_PROFILE:"user does not have a profile",

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
    USER_ALREADY_MEMBER: "User already exists",
    CHAT_MEMBERS_LIMIT_REACHED: "Chat member is reactable",
    TARGET_USER_NOT_MEMBER: "There is no user member",
    CANNOT_CHANGE_OWN_ROLE: "Can't change owner",
    CANNOT_CHANGE_CREATOR_ROLE: "You can't change the CREATOR role (only one CREATOR per chat)",
    USE_TRANSFER_OWNERSHIP: "You can assign the CREATOR role (use TransferOwnership)",
    ADMIN_CANNOT_APPOINT_ADMIN: "ADMIN cannot assign other ADMINs (only CREATOR can)",
    INVALID_ROLE: "Invalid ROLE",
    ROLE_ALREADY_SET: "Role already exists",
    USE_LEAVE_CHAT: "Exit the chat",
    CANNOT_DELETE_MEMBER: "Cannot remove this member",

    // message errors
    TEXT_REQUIRED: "Text is required for TEXT message",
    MAX_TEXT_LEN: "Text is too long (max 4096 characters)",
    INVESTMENT_REQUIRED: "Attachments are required for IMAGE message",
    MESSAGE_NOT_FOUND: "The message was not found.",
    EDIT_WINDOW_EXPIRED: "Post edit period has expired",
}