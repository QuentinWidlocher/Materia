import Dexie from 'dexie';
import Message from '@/classes/message';

// A class that extends Dexie and allow us to easily manage the IndexedDB
class IndexedDbService extends Dexie {

    // Tables are public
    public discussions: Dexie.Table<IDiscussion, string>;

    constructor() {
        super('Materia');

        // We try to make the storage persistant
        if (navigator.storage && navigator.storage.persist) {
            navigator.storage.persist().then((granted: boolean) => {
                if (granted) {
                    console.log('IndexedDB : Storage will not be cleared except by explicit user action');
                } else {
                    console.warn('IndexedDB : Storage may be cleared under storage pressure.');
                }
            });
        }

        // We declare the structure of the database
        this.version(1).stores({
            discussions: '&between',
        });

        // We link the structure to the properties
        this.discussions = this.table('discussions');
    }
}

export interface IDiscussion {
    between: string;
    messages: Message[];
}

export const indexedDB: IndexedDbService = new IndexedDbService();

