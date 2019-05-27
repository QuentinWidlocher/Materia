import { verify, decode } from 'jsonwebtoken';
import User from '@/classes/user';

export class TokenService {
    private secret: string = 'N0uQzxIYpPPjtR9zS6nDtc5OqnjRu5xruzJLXcRBiORHgksfp5bIaPRbgtivEprj';

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

        decodedJwt = verify(jwt, this.secret, { algorithms: ['HS256']}, (err: any, decoded: any) => {
            if (err) {
                console.error(err);
            }

            return decoded;
        }) as any;

        localStorage.setItem('jwt', jwt);
        return (decodedJwt ? decodedJwt.identity as User : null);
    }

    public deauthenticate() {
        localStorage.removeItem('jwt');
    }

    public get token(): string | null {
        return localStorage.getItem('jwt');
    }
}

export const tokenService: TokenService = new TokenService();
