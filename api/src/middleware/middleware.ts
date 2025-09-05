import jwt from "jsonwebtoken";

const { ACCESS_TOKEN_SECRET = "secret" } = process.env;

interface Iuser {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    rank: number;
    numberOfGames: {
        [date: string]: { wins: number, losses: number };
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function isLoggedIn(req: any, res: any, next: any, auth?: Array<string>, hasAllAuth?: boolean) {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            if (token) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const payload: Iuser | string | any = await jwt.verify(token, ACCESS_TOKEN_SECRET);
                if (payload) {
                    req.user = payload;
                    if (auth && hasAllAuth && auth.every((a) => payload.auth.includes(a))) {
                        next();
                    } else if (auth && auth.some((a) => payload.auth.includes(a))) {
                        next();
                    } else {
                        res.status(403).json({ error: "Access denied" });
                    }
                } else {
                    res.status(400).json({ error: "token verification failed" });
                }
            } else {
                res.status(400).json({ error: "malformed auth header" });
            }
        } else {
            res.status(400).json({ error: "No authorization header" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
}

function hasAuth(role: Array<string>, hasAllAuth = false) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (req: any, res: any, next: any) {
        isLoggedIn(req, res, next, role, hasAllAuth);
    }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getIDfromToken(req: any) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const payload: Iuser | string | any = jwt.verify(token, ACCESS_TOKEN_SECRET);
            if (payload) {
                return payload._id;
            }
        }
    }
    return null;
}

async function getCustomIdFromToken(req: any) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const payload: Iuser | string | any = jwt.verify(token, ACCESS_TOKEN_SECRET);
            if (payload) {
                return payload.customId;
            }
        }
    }
    return null;
}

export { isLoggedIn, hasAuth, getIDfromToken, getCustomIdFromToken };