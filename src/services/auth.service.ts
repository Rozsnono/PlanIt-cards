export class AuthService {
    constructor() { }

    public async Login(username: string, password: string) {
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
                    throw new Error(data.message);
                }
                this.saveInCookie(data.token);
                return data;
            });
    }

    private saveInCookie(data: string) {
        document.cookie = `token=${data}; expires=${new Date(new Date().setDate(new Date().getDate() + 7)).toString()} path=/`;
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
                    throw new Error(data.message);
                }
                this.saveInCookie(data.token);
                return data;
            });
    }
}