import { DBData } from "../interface/DBData";
import getDefaultData from "../utils/getDefaultDBData";
import dbDataVersionUpgrade from "../utils/dbDataVersionUpdate";
import Logger, { GlobalLogger } from "../utils/logger";

class ChromeStorageBridge{
    _logger:GlobalLogger
    constructor(logger:GlobalLogger = Logger){
        this._logger = logger
    }

    set(dbData:DBData, galleryID:string, callback:() => void = () => {}){
        const debugID = "id : " + Math.floor(Math.random() * 50000)

        this._logger.debug("데이터 저장 시도",debugID,dbData,galleryID)
        chrome.storage.sync.set({["Swiper_"+ galleryID]:dbData},() => {
            Logger.debug("데이터 저장 성공",debugID)
            callback()
    
        });
    }

    load(galleryID:string, callback: (result:DBData) => void ){
        var galleryID:string = "Swiper_" + galleryID
        chrome.storage.sync.get( galleryID,(result:any) => {
            let dbData: DBData | undefined = result[galleryID] as any
            if(dbData == undefined) 
                dbData = getDefaultData();
            dbData = dbDataVersionUpgrade(dbData)
            callback(dbData)
        });
    }
}

export default ChromeStorageBridge