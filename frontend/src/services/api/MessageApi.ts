import Axios, { AxiosResponse } from 'axios';
import ApiConfig from '@/ApiConfig';
import Message from '@/classes/message';
import { indexedDB, IDiscussion } from '../IndexedDB';

export default class MessageApi {

    // We return a cached list of message if we have one, and another promise of the discussion from the server
    public static getDiscussion(from: string, to: string): Promise<{ cache: Message[], server: Promise<Message[]>}> {
        return this.getDiscussionFromCache(from, to).then((messagesFromCache: Message[]) => {
            return {
                cache: messagesFromCache,
                server: this.getDiscussionFromServer(from, to),
            };
        });
    }

    private static getDiscussionFromCache(from: string, to: string): Promise<Message[]> {

        // We get the cached discussion from the IDB
        return indexedDB.discussions.get(from + '|' + to).then((discussion: IDiscussion | undefined) => {
            if (discussion) {
                return discussion.messages;
            } else {
                return [];
            }
        });
    }

    private static getDiscussionFromServer(from: string, to: string): Promise<Message[]> {
        return new Promise((rslv) => {

            // We fetch the messages between the user and the interlocutor from the server
            return Axios.get(ApiConfig.messageDirection.replace(':idFrom', from).replace(':idTo', to))
                .then((response: AxiosResponse) => {

                    // We store the new data in the IDB
                    indexedDB.discussions.put({ between: from + '|' + to, messages: response.data } as IDiscussion);

                    rslv(response.data as Message[]);
                });

        });
    }

}
