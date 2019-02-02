import { DBData } from "../interface/DBData";
import getDefaultData from "./getDefaultDBData";

function singleUpgrade(data:DBData):DBData{
    data.version += ""
    switch(data.version){
        case "0.5": case "0.5.1":
            data.version = "0.5.2"
            if(data.setting.autoRefresh == undefined) data.setting.autoRefresh = null
            if(data.setting.removeLimit == undefined) data.setting.removeLimit = null
        break;
    }
    return data
}

function dbDataVersionUpgrade(data:DBData):DBData{
    const nowVersion = data.version
    data = singleUpgrade(data)
    const upgradedVersion = data.version
    const newVersion = getDefaultData().version

    // 최신버전으로 업그레이드가 완료된 경우
    if( nowVersion === upgradedVersion){
        return data
    }

    // 버전이 올라갔으나 아직 최신버전이 아닌 경우
    if( nowVersion !== upgradedVersion && upgradedVersion !== newVersion){
        return dbDataVersionUpgrade(data)
    }
    
    // 버전이 올라가지 않고 최신버전이 아닌 경우
    if( nowVersion === upgradedVersion && nowVersion !== newVersion){
        console.error("db데이터의 버전 업그레이드 지원 필요")
        return data
    }

    return data
}


export default dbDataVersionUpgrade