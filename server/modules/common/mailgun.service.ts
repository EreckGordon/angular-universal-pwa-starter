import { Component } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as mg from 'nodemailer-mailgun-transport';


@Component()
export class MailgunService {
    nodemailerMailgun = nodemailer.createTransport(mg({
        auth: {
            api_key: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_EMAIL_DOMAIN
        }
    }));

    constructor () { }


}
