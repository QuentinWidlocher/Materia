import Axios from 'axios';
import ApiConfig from '@/ApiConfig';
import User from '@/classes/user';

export default class UserApi {

    public static getUser(id: string): Promise<User> {
        return new Promise((rslv) => {
            Axios.get(ApiConfig.userUnique.replace(':id', id)).then((response) => {
                rslv(response.data as User);
            });
        });
    }

}
