import {DBData_condition, DBDATA_CONDITIONTARGET, DBDATA_CONDITIONTYPE, BoardData} from '../interface/DBData'
import Logger from '../utils/logger';
/*
    게시글 하나에 해당하는 파싱된 인터페이스
*/


class DCBoard {
    /**
     * 게시글 데이터
     */
    private _datas: Array<BoardData>

    constructor() {
        this._datas = this._parse();
    }

    /** 
     * 생성자의 하위 메서드, 돔요소를 BoardData의 배열로 반환함
     * @returns 데이터로 저장할 BoardData의 배열형태
    */
    private _parse(): Array<BoardData> {
        const $dom: JQuery = this._getJqueryArrayFromDOM();
        return this._parseDOMToObject($dom);
    }

    /**
     * 디씨 게시글에 해당되는 돔요소를 긁어와 JQuery 오브젝트 형태로 변환, 공지사항만 필터링
     * @return 변환된 JQuery 오브젝트
     */
    private _getJqueryArrayFromDOM(): JQuery {
        let $dom: JQuery = $(".gall_list tbody > tr")
            .filter(
                (i, d) => !["설문","이슈","공지"].includes( $(d).find(".gall_num").text() )
            )
        return $dom;
    }

    /**
     * JQuery오브젝트를 BoardData의 배열형태로 변환
     * @param $dom 변환 대상이 될 JQuery 오브젝트
     * @return 변환된 BoardData의 배열
     */
    private _parseDOMToObject($dom: JQuery): BoardData[] {
        let $boardDatas = $dom.map((i, d) => {
            const getHTML = (selector: string) => $(d).find(selector).text();
            const isLogin = $(d).find(".ip").length === 0;
            let data: BoardData = {
                user: {
                    name: getHTML(".nickname"),
                    isLogin,
                },
                title: getHTML(".gall_tit a"),
                id: parseInt( $(d).find(".gall_num").text() ),
                $dom: $(d)
            }

            if (isLogin) {
                data.user.isRightNick = $(d).find(".writer_nikcon img").attr("src") != "http://nstatic.dcinside.com/dc/w/images/nik.gif";
                data.user.id = $(d).find(".gall_writer").data("uid");
            } else {
                data.user.ip = $(d).find(".gall_writer").data("ip");
            }
            return data;
        })

        return $boardDatas.toArray();
    }

    /**
     * 파라미터로 제시한 조건을 충족하는 게시글을 배열로 반환
     * 조건은 and연산됨
     * @param conditions 제시한 조건
     */
    inspect(conditions: Array<DBData_condition>): Array<BoardData> {
        const result: Array<BoardData> = [];
        this._datas.forEach(data => {
            Logger.info(data, conditions, "조건검사")
            if (this._inspectSingle(data, conditions))
                result.push(data);
        })

        return result;
    }

    /**
     * 게시글 하나가 and연산으로 조건에 충족되는지 검사
     * @param data 검사할 게시글
     * @param conditions 조건
     */
    private _inspectSingle(data: BoardData, conditions: Array<DBData_condition>): boolean {

        const getValue = (target: DBDATA_CONDITIONTARGET, data: BoardData): string|null => {
            let value: string|null = null;
            switch (target) {
                case DBDATA_CONDITIONTARGET.IP:
                    if (!data.user.isLogin) value = data.user.ip as string;
                    break;
                case DBDATA_CONDITIONTARGET.NAME:
                    value = data.user.name;
                    break;
                    case DBDATA_CONDITIONTARGET.TITLE:
                    value = data.title;
                    break;
                case DBDATA_CONDITIONTARGET.ID:
                    if (data.user.isLogin) value = data.user.id as string;
                    break;
                default:
            }
            return value;
        }

        const getRegex = (condition: DBData_condition): string | RegExp => {
            let regex: string | RegExp = "";
            switch (condition.type) {
                case DBDATA_CONDITIONTYPE.REGEX: regex = new RegExp(condition.test); break;
                case DBDATA_CONDITIONTYPE.STRING: regex = condition.test; break;
            }
            return regex;
        }

        return conditions.every(condition => {
            let regex: RegExp | string = getRegex(condition);
            let value: string | null = getValue(condition.target, data);
            Logger.info(regex, value, "상세조건검사")
            //값이 null일 경우 충족 반환
            if (value == null) return false;
            //검사한값이 제대로 나오지 않는 경우 충족 반환
            if (value.match(regex) != null) return true;
            

            // 모든 조건 충족시 false 반환
            return false;
        })
    }

    public getBoardDatas(){
        return this._datas;
    }

}

export default DCBoard