export const checkCSRFTokenMiddleware = (req, res, next) => {
    const csrfCookie = req.cookies["XSRF-TOKEN"];
    const csrfHeader = req.headers['x-xsrf-token'];
    if (csrfCookie && csrfHeader && csrfCookie === csrfHeader) {
        next();
    }
    else {
        res.sendStatus(403);
    }
};
