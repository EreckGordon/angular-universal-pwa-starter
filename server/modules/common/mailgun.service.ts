import { Component } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as mg from 'nodemailer-mailgun-transport';


@Component()
export class MailgunService {
	
    private nodemailerMailgun = nodemailer.createTransport(
        mg({
            auth: {
                api_key: process.env.MAILGUN_API_KEY,
                domain: process.env.MAILGUN_EMAIL_DOMAIN
            }
        })
    );

    async sendPasswordResetEmail({email, token}: {email: string; token:string;}): Promise<any> {
    	const html = `
    		<div>To reset your password for ${process.env.SITENAME_BASE}, please follow this link:
    		<a href="${process.env.SITE_URL}/reset-password/?token=${token}&email=${email}">
    			${process.env.SITE_URL}/reset-password/?email=${email}&token=${token}
    		</a></div><br>

    		<div>
    		The link will expire in 10 minutes.
    		</div>
    	`
        return await this.nodemailerMailgun.sendMail({
            to: email,
            from: `noreply@${process.env.MAILGUN_EMAIL_DOMAIN}`,
            subject: `Password Reset Request for ${process.env.SITENAME_BASE}`,
            html
        })
    }

}
