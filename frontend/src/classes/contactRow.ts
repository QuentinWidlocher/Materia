import User from './user';

import Message from './message';

export class ContactRow {
    public user: User;
    public lastMessage: Message | null;
};