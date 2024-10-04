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
        [date: string]: {wins: number, losses: number};
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function isLoggedIn(req: any, res: any, next: any, role?: Array<string>) {
    try {
        // check if auth header exists
        if (req.headers.authorization) {
            // parse token from header
            const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
            if (token) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const payload: Iuser | string | any = await jwt.verify(token, ACCESS_TOKEN_SECRET);
                if (payload) {
                    // store user data in request object
                    req.user = payload;
                    if (role && role.includes(payload.auth)) {
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

function hasAuth(role: Array<string>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (req: any, res: any, next: any) {
        isLoggedIn(req, res, next, role);
    }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getIDfromToken(req: any) {
    if (req.headers.authorization) {
        // parse token from header
        const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
        if (token) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const payload: Iuser | string | any = jwt.verify(token, ACCESS_TOKEN_SECRET);
            if (payload) {
                // store user data in request object
                return payload.id;
            }
        }
    }
    return null;
}

export { isLoggedIn, hasAuth, getIDfromToken };