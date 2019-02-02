/*
    DB에 저장하는 용도로 사용될 인터페이스
*/
interface DBData {
    dbs: Array<DBData_dbs>
    version: string,
    setting: SettingData
}

interface SettingData {
    autoRefresh: null|number,
    removeLimit: null|number
}

interface DBData_dbs {
    condition: Array<DBData_condition>,
    isRemove: boolean,
    block: {
        isBlock: boolean,
        length?: (1 | 6 | 24 | 72),
        reason?: string
    }
}

interface DBData_condition {
    target: DBDATA_CONDITIONTARGET,
    test: string,
    type: DBDATA_CONDITIONTYPE
}

enum DBDATA_CONDITIONTARGET {
    NAME = 0,
    TITLE = 2,
    IP = 1,
    ID = 3
}
enum DBDATA_CONDITIONTYPE {
    STRING,
    REGEX
}

interface BoardData {
    user: {
        name: string
        isLogin: boolean,
        ip?: string,
        isRightNick?: boolean,
        id?: string,
    },
    title: string,
    id: number,
    $dom: JQuery
}

export {DBData, DBData_dbs, DBData_condition, SettingData,
    DBDATA_CONDITIONTARGET, DBDATA_CONDITIONTYPE, BoardData}