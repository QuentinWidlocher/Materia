export default class ApiConfig {
    public static urlBase: string = 'http://127.0.0.1:5000';
    public static apiBase: string = ApiConfig.urlBase + '/api';

    public static userBase: string = ApiConfig.apiBase + '/users';
    public static userUnique: string = ApiConfig.userBase + '/:id';
    public static userLogin: string = ApiConfig.userBase + '/login';

    public static messageBase: string = ApiConfig.apiBase + '/messages';
    public static messageDirection: string = ApiConfig.messageBase + '/:idFrom/:idTo';
    public static messageLast: string = ApiConfig.messageDirection + '/last';

}
