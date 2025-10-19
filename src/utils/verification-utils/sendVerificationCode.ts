import {mailTransporter} from "../../config/mailTransporter";
import {env} from "../../config/secrets"
import {createHtmlTemplate} from "../templates/createVerificationCodeHtml";
import ApiError from "../../error/ApiError"


export const sendVerificationEmail = async (
    toEmail: string,
    verificationCode: string,
    mailSubject: string,
    fromName: string
): Promise<void> => {
    const mailOptions = {
        from: `"${fromName}" <${env.EMAIL_HOST_USER}>`,
        to: toEmail,
        subject: mailSubject,
        html: createHtmlTemplate(verificationCode),
    };

    await mailTransporter.sendMail(mailOptions).catch((): void => {
        throw new ApiError(500, `Failed to send verification email to ${toEmail}`);
    });
};