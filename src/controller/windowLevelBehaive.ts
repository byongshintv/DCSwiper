import { SettingData } from '../interface/DBData'
function autoRefresh(setting:SettingData){
    const autoRefresh = setting.autoRefresh
    //재시작
    if( autoRefresh !== null)
        setTimeout( () => {
            location = location
        },autoRefresh * 10)
}

export  { autoRefresh }