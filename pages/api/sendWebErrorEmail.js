import { MailerService } from '../../services';

export default async function sendWebErrorEmailHandler(req, res) {
    if (req.method === 'post') {
        await MailerService.sendWebErrorEmail(req.body);
    }
    res.status(200).end();
}
