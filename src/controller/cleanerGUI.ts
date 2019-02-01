import { DBData } from '../interface/DBData'
import { GlobalLogger, ILogger } from '../utils/logger'
import { BlockNode, CleanerResult, RemoveNode, } from '../interface/CleanerInterface'

/**
 * 
 * @param e 
 */
function getCookie(e:string){
    for (var t = e + "=", o = document.cookie.split(";"), i = 0; i < o.length; i++) {
        for (var n = o[i]; " " == n.charAt(0); )
            n = n.substring(1);
        if (0 == n.indexOf(t))
            return n.substring(t.length, n.length)
    }
    return ""
}

interface GUIalertInfo{
    $dom:JQuery,
    classType:GUIalertInfo_ClassType,
    detail:string
}
enum GUIalertInfo_ClassType{
    WARNING = "hsl(61, 100%, 87%)",
    ERROR = "hsl(0, 100%,87%)"
}

/**
 * 실제 차단과 관련된 작업을 수행하는 클래스
 */
class CleanerGUI {
    private _logging:ILogger
    constructor(datas: DBData, logging:GlobalLogger) {
        this._logging = logging.get("CleanerGUI")
    }


    /**
     * 글의 id값으로 tr 엘리멘트 획득
     * @param id 포스트의 id
     */
    private _getPostTrElement(id: number):JQuery{
        return $(`.ub-content[data-no=${id}]`)
    }

    
    /**
     * 게시글이 삭제되면 안되는 게시글인지 체크,
     * ex) 공지사항이나 설문조사인 경우
     * @param id 체크할 게시글의 id
     */
    private _isSignificantPost(id:number): boolean{
        const $tr = this._getPostTrElement(id)
        const gallNum = $tr.find(".gall_num").text()
        return ["공지","설문"].includes(gallNum) ? true : false
    }

    /**
     * 특정 게시물 체크박스 활성화
     * 공지나 설문조사 게시물이면 체크하지 않음
     * @param id 체크할 게시물의 id
     */
    public check(id: number | number[],ischeck:boolean = true) {
        // id의 타입이 array인 경우
        if( id instanceof Array ){
            id.forEach( singleId => this.check( singleId ))
            return
        }
            
        // id의 타입이 number인 경우
        if( this._isSignificantPost(id) ) return
        const checkbox: JQuery<HTMLInputElement> = this._getPostTrElement(id).find("list_chkbox") as JQuery<HTMLInputElement>
        checkbox[0].checked = ischeck;
    }

    /**
     * 눈에 보이는 게시물의 모든 id 획득
     */
    public getAllIds(){
        return $(".gall_list tr")
        .toArray()
        .map( el => $(el).data("no"))
        .filter(id => id !== undefined)
    }

    /**
     * 화면에 보이는 게시글 테이블의 모든 체크박스 체크
     */
    public checkAll(ischeck:boolean) {
        const ids = this.getAllIds()
        this.check(ids,ischeck)
    }

    /**
     * 게시글을 남긴 특정유저 차단
     * @param blockNode 차단 데이터가 담긴 객체
     * @param callback 차단 성공시 콜백
     * @param errCallback 차단 실패시 콜백
     */
    public clickBlock(
        blockNode: BlockNode,
        callback = (data: any) => { },
        errCallback = (data: any) => { }
    ) {
        const allVals = [blockNode.id].map(v => v+"");
        const data = {
            ci_t: getCookie('ci_c'),
            id: $("#gallery_id").val(),
            nos: allVals,
            avoid_hour: blockNode.length,
            avoid_reason: "0",
            parent: "",
            avoid_reason_txt: blockNode.reason
        }
        this._logging.debug("차단작업 수행 폼 데이터", data)

        $.ajax({
            type: "POST",
            dataType : 'json',
            cache : false,
            url: "/ajax/minor_manager_board_ajax/update_avoid_list",
            data: data,
            success: (data) => callback(data),
            error: (data) => errCallback(data),
        });

    }

    /**
     * 특정 게시글 삭제
     * @param removeNodes 게시글을 삭제할 정보가담긴 객체
     * @param callback 게시글 삭제 성공시 콜백
     * @param errCallback 게시글 삭제 실패시 콜백
     */
    public clickRemove(removeNodes: RemoveNode[], callback = (data: any) => { }, errCallback = (data: any) => { }) {
        var nos = removeNodes.map(v => v.id);
        if( nos.length === 0 ) return
        this._logging.debug("삭제작업 수행 폼 데이터", nos)

        $.ajax({
            type: "POST",
            url: "/ajax/minor_manager_board_ajax/delete_list",
            data: { 
                'ci_t': getCookie('ci_c'), 
                'id': $("#gallery_id").val(),
                'nos': nos },
            dataType: 'json',
            success: (data) => callback(data),
            error: (data) => errCallback(data)
        });
    }

    private _getAlertList(cleanerResults: CleanerResult):GUIalertInfo[]{
        const alertList:GUIalertInfo[] = [];
        cleanerResults.remove.forEach(result => {
            alertList.push({
                $dom:result.$dom,
                classType:GUIalertInfo_ClassType.WARNING,
                detail:"삭제됨 ",
            })
        })
        cleanerResults.block.forEach(result => {
            alertList.push({
                $dom:result.$dom,
                classType:GUIalertInfo_ClassType.ERROR,
                detail:`${result.reason}로 ${result.length}시간 차단됨 `,
            })
        })

        return alertList;
    }

    private _alertToDom(alertList:GUIalertInfo[]):void{
        alertList.forEach((alertinfo:GUIalertInfo) => {

            alertinfo.$dom.css("background-color",alertinfo.classType)
                     .find(".gall_tit").append(`<small>${alertinfo.detail}</small>`);
        })
    }

    /**
     * 삭제 및 차단 결과를 받아 실제 dom에 표시
     * @param result 
     */
    public doAlert(result: CleanerResult) {
        const alertList:GUIalertInfo[] = this._getAlertList(result);
        this._alertToDom(alertList);
    }
}

export default CleanerGUI