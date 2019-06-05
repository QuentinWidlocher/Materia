import Message from './message';
import { ContactRow } from './contactRow';

export default class User {

    public static newEmpty(): User {
        return new User('', '', '', []);
    }

    public id: string;
    public username: string;
    public password: string;
    public contacts: ContactRow[];
    public active: boolean;

    constructor(id: string, username: string, password: string, contacts: ContactRow[]) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.contacts = contacts;
    }

    public toJSON(): object {
        const plainObject: object = {
            username: this.username,
            password: this.password,
        };

        return plainObject;
    }
}
