export class AuthService {
    constructor() { }

    public async Login(username: string, password: string, remember: boolean) {
        return fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'error') {
                    throw new Error(data.error);
                }
                this.saveInCookie(data.token, remember);
                return data;
            });
    }

    private saveInCookie(data: string, remember: boolean = false) {
        document.cookie = `token=${data}; expires=${new Date(new Date().setDate(new Date().getDate() + (remember ? 7 : 0))).toString()} path=/`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async Register(register: any) {

        return fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(register),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'error') {
                    throw new Error(data.error);
                }
                this.saveInCookie(data.token);
                return data;
            });
    }
}