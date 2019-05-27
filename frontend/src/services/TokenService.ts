import { verify } from 'jsonwebtoken';
import User from '@/classes/user';
import Axios from 'axios';

export class TokenService {
    private secret: string = 'N0uQzxIYpPPjtR9zS6nDtc5OqnjRu5xruzJLXcRBiORHgksfp5bIaPRbgtivEprj';
    private _token: string;

    public authenticate(jwt: string = ''): User | null {
        let decodedJwt: any;
        const jwtLocal = localStorage.getItem('jwt');

        if (jwt === '') {
            if (!jwtLocal) {
                return null;
            } else {
                jwt = jwtLocal;
            }
        }

        decodedJwt = verify(jwt, this.secret, { algorithms: ['HS256'] }, (err: any, decoded: any) => {
            if (err) {
                console.error(err);
            }

            return decoded;
        }) as any;

        this.token = jwt;
        return (decodedJwt ? decodedJwt.identity as User : null);
    }

    public deauthenticate() {
        localStorage.removeItem('jwt');
    }

    public get token(): string | null {
        return this._token || localStorage.getItem('jwt');
    }

    public set token(token: string | null) {
        if (token) {
            localStorage.setItem('jwt', token);
            this._token = token;

            // Add the token in the header of each call
            Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
    }
}

export const tokenService: TokenService = new TokenService();
