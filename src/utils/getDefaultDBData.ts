import { DBData } from "../interface/DBData";

function getDefaultData():DBData{
    return {
        dbs:[],
        setting:{
            autoRefresh:null,
            removeLimit:10
        },
        version:"0.5.2"
    };
}

export default getDefaultData