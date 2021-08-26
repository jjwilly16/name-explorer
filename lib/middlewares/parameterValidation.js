import withJoi from 'next-joi';

export default withJoi({
    onValidationError: (_, res, _error) => {
        return res.status(400).end();
    },
});
