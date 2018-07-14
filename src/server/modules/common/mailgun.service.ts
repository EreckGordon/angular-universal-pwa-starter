import { Injectable } from '@nestjs/common';

const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_EMAIL_DOMAIN,
});

@Injectable()
export class MailgunService {
    async sendPasswordResetEmail({ email, token }: { email: string; token: string }): Promise<any> {
        const html = `
            <div>To reset your password for ${process.env.SITENAME_BASE}, please follow
            <a href="${process.env.SITE_URL}/reset-password/?token=${token}">
                this link
            </a></div><br>

            <div>
            The link will expire in 10 minutes.
            </div>
        `;
        return await mailgun.messages().send({
            to: email,
            from: `noreply@${process.env.MAILGUN_EMAIL_DOMAIN}`,
            subject: `Password Reset Request for ${process.env.SITENAME_BASE}`,
            html,
        });
    }
}
