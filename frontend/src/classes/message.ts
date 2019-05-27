export default class Message {

    public static newEmpty(): Message {
        return new Message('', '', '');
    }

    public from: string;
    public to: string;
    public direction: string;
    public body: string;
    public dateSent: number;
    public sent: boolean;

    constructor(from: string, to: string, body: string, dateSent: number = 0, sent: boolean = false) {
        this.from = from;
        this.to = to;
        this.body = body;
        this.direction = from + '|' + to;
        this.dateSent = dateSent === 0 ? + new Date().getTime() / 1000 : dateSent;
        this.sent = sent;
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
