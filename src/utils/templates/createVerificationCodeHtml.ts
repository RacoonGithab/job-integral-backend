export const createHtmlTemplate = (verificationCode: string): string => {
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verification Code</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                        color: #333;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        padding: 20px;
                        text-align: center;
                    }
                    .email-header {
                        background-color: #000000;
                        color: #ffffff;
                        padding: 20px;
                        border-radius: 8px 8px 0 0;
                    }
                    .email-header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .email-body {
                        padding: 20px;
                        font-size: 16px;
                        line-height: 1.5;
                        color: #333;
                    }
                    .verification-code {
                        font-size: 32px;
                        font-weight: bold;
                        color: #000000;
                        margin: 20px 0;
                    }
                    .footer {
                        font-size: 14px;
                        color: #888;
                        margin-top: 20px;
                    }
                    .footer a {
                        color: #000000;
                        text-decoration: none;
                    }
                    @media screen and (max-width: 600px) {
                        .email-container {
                            padding: 15px;
                        }
                        .email-header h1 {
                            font-size: 20px;
                        }
                        .email-body {
                            font-size: 14px;
                        }
                        .verification-code {
                            font-size: 28px;
                        }
                        .footer {
                            font-size: 12px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                        <h1>Account Verification</h1>
                    </div>
                    <div class="email-body">
                        <p>Hello,</p>
                        <p>To complete your registration and verify your account, please use the following verification code:</p>
                        <div class="verification-code">
                            ${verificationCode}
                        </div>
                        <p>Enter this code on the corresponding page on our website.</p>
                        <p>If you did not request this code, please ignore this message.</p>
                    </div>
                    <div class="footer">
                        <p>Best regards, the team at <strong>Migrostore</strong></p>
                        <p><a href="https://www.migrostore.com">Visit our website</a></p>
                    </div>
                </div>
            </body>
    </html>`;
}