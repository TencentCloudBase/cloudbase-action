import * as Geo from './geo/index';
import { CollectionReference } from './collection';
import { Command } from './command';
import { ServerDateConstructor } from './serverDate/index';
import { RegExpConstructor } from './regexp/index';
import { startTransaction, runTransaction } from './transaction';
export class Db {
    constructor(config) {
        this.config = config;
        this.Geo = Geo;
        this.serverDate = ServerDateConstructor;
        this.command = Command;
        this.RegExp = RegExpConstructor;
        this.startTransaction = startTransaction;
        this.runTransaction = runTransaction;
    }
    collection(collName) {
        if (!collName) {
            throw new Error('Collection name is required');
        }
        return new CollectionReference(this, collName);
    }
    createCollection(collName) {
        let request = new Db.reqClass(this.config);
        const params = {
            collectionName: collName
        };
        return request.send('database.addCollection', params);
    }
}
