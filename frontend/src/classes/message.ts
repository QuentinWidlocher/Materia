export default class Message {
    public from: string;
    public to: string;
    public direction: string;
    public body: string;
    public dateSent: number;

    constructor(from: string, to: string, body: string, dateSent: number = 0) {
        this.from = from;
        this.to = to;
        this.body = body;
        this.direction = from + '|' + to;
        this.dateSent = dateSent === 0 ? + new Date() : dateSent;
    }

    public toJSON(): object {
        const plainObject: object = {
            from: this.from,
            to: this.to,
            body: this.body,
        };

        return plainObject;
    }
}
