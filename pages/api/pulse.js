import DefaultErrorPage from 'next/error';

export default function pulseHandler(req, res) {
    if (req.method === 'GET') {
        return res.status(200).send('OK');
    }
    return (
        <DefaultErrorPage />
    );
}
