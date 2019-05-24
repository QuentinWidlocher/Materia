export default class User {

    public static newEmpty(): User {
        return new User('', '', '');
    }

    public id: string;
    public username: string;
    public password: string;

    constructor(id: string, username: string, password: string) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    public toJSON(): object {
        const plainObject: object = {
            username: this.username,
            password: this.password,
        };

        return plainObject;
    }
}
