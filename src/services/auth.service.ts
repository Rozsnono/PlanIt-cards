export function Login(username: string, password: string) {
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
            saveInCookie(data.token);
            return data;
        });
}

function saveInCookie(data: string) {
    document.cookie = `token=${data}; path=/`;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Register(register: any) {

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
            saveInCookie(data.token);
            return data;
        });
}