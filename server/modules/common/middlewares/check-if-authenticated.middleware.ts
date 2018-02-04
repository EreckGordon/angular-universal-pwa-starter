export const checkIfAuthenticatedMiddleware = (req, res, next) => {
    if (req['user']) {
        next();
    } else {
        res.sendStatus(403);
    }
};
