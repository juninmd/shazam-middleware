export const getip = (req: any) => {
    return req.ip ||
        req._remoteAddress ||
        (req.connection && req.connection.remoteAddress) ||
        undefined;
};