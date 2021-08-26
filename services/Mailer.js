export default class Mailer {
    constructor(mailerService, programmerEmail) {
        this.mailer = mailerService;
        this.programmerEmail = programmerEmail;
    }

    sendWebErrorEmail(err) {
        return this.mailer.sendMail({
            to: this.programmerEmail,
            from: this.programmerEmail,
            subject: 'An error has occurred on the name explorer site',
            text: JSON.stringify(err, Object.getOwnPropertyNames(err), 4),
        });
    }

    sendContactEmail({
        name,
        email,
        message,
    }) {
        return this.mailer.sendMail({
            to: this.programmerEmail,
            from: this.programmerEmail,
            subject: 'A new contact submission from the name explorer site',
            text: `Name: ${name}\n\nEmail: ${email}\n\nMessage: ${message}\n`,
        });
    }
}
