import { verify } from 'jsonwebtoken';
import User from '@/classes/user';

export class TokenService {
    private secret: string = 'secret';

    public authenticate(jwt: string = ''): User | null {

        const jwtLocal = localStorage.getItem('jwt');
        if (jwt === '') {
            if (!jwtLocal) {
                return null;
            } else {
                return (verify(jwtLocal, this.secret) as any).user as User;
            }

        }

        const decodedJwt = verify(jwt, this.secret) as any;
        localStorage.setItem('jwt', jwt);
        return decodedJwt.user as User;
    }
}

export const tokenService: TokenService = new TokenService();
