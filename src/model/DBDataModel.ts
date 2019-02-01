import {Reject, Resolve} from '../interface/Promise'
import { DBData } from '../interface/DBData'


class DBDataModel {
    private _databaseName = "Swiper" + "_" + new URL(location.href).searchParams.get("id");
    private _defaultForm = {
        dbs: []
    };
    constructor() {

    }

    loadData(): Promise<DBData> {
        const promise = new Promise<boolean>(
            (res, rej) => this._hasNotData(res)
        ).then((hasNotData: boolean) => new Promise<void>((res) => {
            if (hasNotData) this._createNewData(res as any);
            else res()
        })).then(() => new Promise<DBData>((res) => {
            this._loadData(res)
        })).then((result: DBData) => new Promise<DBData>((res) => {
            res(result)
        }))
        return promise;

    }

    private _createNewData(resolve: Resolve<void>) {
        chrome.storage.sync.set(
            { [this._databaseName]: this._defaultForm }, () => {
                resolve();
            });
    }

    private _loadData(resolve: Resolve<DBData>) {
        const databaseName = this._databaseName;

        chrome.storage.sync.get(this._databaseName, (result) => {
            resolve(result[databaseName]);
        });
    }

    private _hasNotData(resolve: Resolve<boolean>) {
        const databaseName = this._databaseName;
        new Promise((res) => {
            this._loadData(res);
        }).then(result => {
            resolve(result == undefined);
        })
    }
}

export default DBDataModel