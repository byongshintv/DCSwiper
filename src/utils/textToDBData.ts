import { DBData } from "../interface/DBData";
import { classBody } from "babel-types";



function textToDBData(textData:string): DBData | null{
    try{
        // 올바르지 않은 json형식일 경우 syntaxError 반환
        const convertedData:DBData = JSON.parse( textData ) as DBData
        const {dbs, setting, version} = convertedData;

        return {
            dbs: dbs.map(({condition, isRemove, block}) => {
                return {
                    condition,
                    isRemove,
                    block
                }
            }),
            setting:{
                autoRefresh: setting.autoRefresh || null,
                removeLimit: setting.removeLimit || null,
            },
            version:convertedData.version
        }

    } catch (SyntaxError){
        return null
    }
}

export default textToDBData