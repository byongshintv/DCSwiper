import { DBData_dbs, DBData_condition, SettingData,
    DBDATA_CONDITIONTYPE, DBDATA_CONDITIONTARGET, DBData } from "./interface/DBData";
import Logger from './utils/logger';

function isValidRegExp( string:string ):boolean{
    try{ 
        new RegExp(string) 
    } catch { 
        return false 
    }
    return true
}

class BodyGUI{
    showMessage(message:string){
        $(".hide.message")
        .clone().appendTo("body").removeClass("hide").css("display","hide")
        .html(message)
        .fadeIn().delay(2000).fadeOut(function(this:HTMLElement){
            $(this).remove()
        })
    }

    private _resetNumbering(){
        $(".filterItem").not(".hide").each((i,self) => {
            $(self).find(".titleWrap > span").html("#" + i)
        })
    }

    /**
     * 새로운 노드 추가
     */
    addNode():JQuery{  
        const $target = $(".filterItem.hide")
            .clone()
            .prependTo("#filterList")
            .removeClass("hide")
            .css("display","none")
            .fadeIn()

        $target.find(".card-image img")
            .attr("src",`imgs/${Math.floor( Math.random() * 14 )}.jpg`)
        this._resetNumbering();
        this._bindNodeEvent($target);
        return $target;
    }

    
    /**
     * 노드에 이벤트 구속
     * @param target 이벤트를 바인딩할 노드의 htmlelement
     */
    private _bindNodeEvent($target:JQuery){
        const self = this;
        //노드 삭제 버튼 클릭시 노드 삭제되는 이벤트 바인딩
        $target.find(".removeNode").click(function(){
            self.removeNode( $(this).closest(".filterItem") );
        });
        
        //사용자를 차단하려고 했을때 상세 차단정보가 나타나게 함
        $target.find(".isBlock").click(function(){
            $(this).closest(".behaiveWrap")
                .find(".blockDetailWrap")
                .fadeToggle()
        })
    
        // materialize select 이벤트 정의
        $target.find('.length').formSelect();

        //새로운 조건 추가
        self.addCondition( $target )
    }


    /**
     * 기존의 노드 삭제
     * @param $node 삭제할 노드의 jquery element
     */
    removeNode($node:JQuery){
        $node.slideUp({
            complete:function(){
                $(this).remove();
            },
        });
        this._resetNumbering();
    }

    //모든 노드 삭제
    removeAllNode(){
        $(".filterItem").not(".hide").remove();
    }

    //새로운 조건 추가
    addCondition($node:JQuery){
        const $list = $node.find(".conditionList");
        const $clonedTarget = $("#forClone.hide .condition")
          .clone()
        $clonedTarget
            .appendTo($list)
            .hide()
            .slideDown(100);

        this._bindConditionEvent($clonedTarget, $node);
        return $clonedTarget;
    }

    /**
     * 차단조건 element가 새롭게 생성될때 차단조건에 이벤트 바인딩
     * @param $target 이벤트를 정의할 차단조건 요소
     * @param $node 차단조건 요소의 부모노드
     */
    private _bindConditionEvent($target:JQuery,$node:JQuery){
        const self = this;

        // 마테리얼라이즈 셀렉트 이벤트 정의
        $target.find('select').formSelect();
        
        // 입력한 검열단어가 맨 마지막일 경우 필터 추가
        $target.find(".test").keyup(function(){
            const $inputbox = $(this) 
            const selfIndex = $(this).closest(".condition").index() + 1
            const condtionLength = $(this).closest(".conditionList").find(".condition").length
            const isLastCondition = selfIndex === condtionLength
            if($inputbox.val() !== "" && isLastCondition)
                self.addCondition( $node )
        });

        // 마지막이 아닌 검열단어에 입력이 없을경우 필터 삭제
        $target.find(".test").blur(function(){
            const $inputbox = $(this)
            const $condition = $(this).closest(".condition") 
            const selfIndex = $condition.index() + 1
            const condtionLength = $(this).closest(".conditionList").find(".condition").length
            const isLastCondition = selfIndex === condtionLength
            if($inputbox.val() == "" && !isLastCondition)
                self.removeCondition( $condition )
        });

        // 검열형태가 정규식일때 검열단어가 올바른 정규식이 아닌 경우 툴팁 출력
        $target.find(".test").blur(function(){
            const $input: JQuery = $(this)
            const inputval: string = $input.val() as string
            const $type: JQuery = $(this).closest(".condition").find(".type")
            let tooltipInstance: M.Tooltip = M.Tooltip.getInstance($input[0])
            let isValid:boolean = isValidRegExp(inputval)

            
            // 남아있는 tooltip intance 삭제
            if(tooltipInstance !== undefined){
                tooltipInstance.destroy()
                $input.removeClass("invalid")
            }

            if( $type.val() == DBDATA_CONDITIONTYPE.REGEX && !isValid){
                tooltipInstance = M.Tooltip.init($input,{
                    position:"top",
                    html:"올바르지 않은 정규식입니다."
                })[0]
                $input.addClass("invalid")
                tooltipInstance.open()
            }
                
            

        })
    }

    //기존의 조건 삭제
    public removeCondition($condition:JQuery){
        $condition.slideUp({
            complete:function(){
                $(this).remove();
            },
        });
    }


    public setNodes(dbs:DBData_dbs[]){
        this.removeAllNode();
        dbs.forEach( db => {
            if(db.condition.length === 0) return
            const $target = this.addNode()
            this._setNode($target,db);
        });
    }

    //db데이터로 노드 갱신
    private _setNode($target:JQuery,db:DBData_dbs){
        $target.find(".condition").remove()

        if(db.isRemove) $target.find(".isRemove").trigger("click");
        if(db.block.isBlock) $target.find(".isBlock").trigger("click");
        $target.find(".length").val(db.block.length as number).formSelect();
        $target.find(".reason").val(db.block.reason as string);
        db.condition.forEach((option) => {
            const $condiction = this.addCondition($target);
            $condiction.find(".target").val(option.target).formSelect();
            $condiction.find(".test").val(option.test);
            $condiction.find(".type").val(option.type).formSelect();         
        })

    }

    public toJSON():DBData_dbs[]{
        return $(".filterItem")
        .not(".hide")
        .toArray()
        .map( node => {
            return this.nodeToJson( $(node) )
        })
        .filter( node => {
            return node.condition.length !== 0
        })
    }

    public nodeToJson($node:JQuery):DBData_dbs{
            const $target = $node
            const conditions:DBData_condition[] = $node
                .find(".condition")
                .not(".hide")
                .toArray()
                .map(condition => {
                    const $condition = $(condition)
                    return this._conditionToJson($condition)
                })
                //검열단어가 비어있는 조건 필터링
                .filter(
                    condition => condition.test !== ""
                )

            return {
                condition:conditions,
                isRemove:$node.find(".isRemove").is(":checked"),
                block:{
                    isBlock:$node.find(".isBlock").is(":checked"),
                    length:$node.find(".length").val() as (1|6|24|72),
                    reason:$node.find(".reason").val() as string
                }	
            }
    }

    private _conditionToJson($condition:JQuery) : DBData_condition{
        return {
            target:parseInt( $condition.find(".target").val() as string) as DBDATA_CONDITIONTARGET ,
            test:$condition.find(".test").val() as string,
            type:parseInt( $condition.find(".type").val() as string ) as DBDATA_CONDITIONTYPE,
        }
    }
}
const bodyGUI = new BodyGUI();

class OtherGUI{
    public printExportData(dbData: DBData): void {
        const textData:string = JSON.stringify(dbData);        
        $("#exportData").html(textData)

    }

    private $refreshInterval = $("#refreshInterval")
    private $removeLimitCount = $("#removeLimitCount")
    constructor(){
        this._initEventListener();
    }

    /**
     * 이벤트 정의
     */
    private _initEventListener(){
        const { $refreshInterval, $removeLimitCount } = this
        /**
         * 자동 새로고침의 여부, 간격 설정
         * #refreshInterval .value에 저장됨
         */

        $refreshInterval
            .on("input",function(){
                const $this = $(this);
                const id:string = this.id;
                let value:number = parseInt( $(this).val() as string ) / 100 ;
                const message = value === 0?
                    "자동 새로고침 해제" :
                    `자동 새로고침 간격 <span class="value">${value}</span>초`
                $(`#${id}Descript`).html(message)
            })

        /**
         * 최대 삭제갯수 제한 설정
         * #refreshInterval .value에 저장됨
         */
        $removeLimitCount
            .on("input",function(){
                const $this = $(this);
                const id:string = this.id;
                let value:number = parseInt( $(this).val() as string );
                const message = value === 0?
                    '삭제 갯수 제한 해제':
                    `1회 최대 삭제 갯수 <span class="value">${value}</span>개`
                $(`#${id}Descript`).html(message)
            })

        $([$refreshInterval, $removeLimitCount])
            .val(0)
            .trigger("input")

        /**
         * materiallize에서 제공되는 기본 이벤트 정의
         */
        //사이드 네비게이션
        $("#sideNav").sidenav();
        $('.collapsible').collapsible();
    }

    public getSettingJSON():SettingData{
        let autoRefresh:undefined|number = undefined
        let removeLimit: undefined|number = undefined


        if($("#refreshIntervalDescript .value").length !== 0) 
            autoRefresh = $("#refreshInterval").val() as number

        if($("#removeLimitCount .value").length !== 0) 
            removeLimit = $("#refreshInterval").val() as number

        return {
            autoRefresh,
            removeLimit
        }
    }

    public setSetting(setting:SettingData):void{
        let { autoRefresh, removeLimit } = setting
        const { $refreshInterval, $removeLimitCount } = this

        autoRefresh = autoRefresh || 0
        removeLimit = removeLimit || 0
        $refreshInterval.val(autoRefresh).trigger("input")
        $removeLimitCount.val(removeLimit).trigger("input")
    }


}

class ChromeStorageBridge{
    set(dbData:DBData, galleryID:string, callback:() => void = () => {}){
        const debugID = "id : " + Math.floor(Math.random() * 50000)

        logger.debug("데이터 저장 시도",debugID,dbData,galleryID)
        chrome.storage.sync.set({["Swiper_"+ galleryID]:dbData},() => {
            logger.debug("데이터 저장 성공",debugID)
            callback()
    
        });
    }

    load(galleryID:string, callback: () => void ){

    }
}

const chromeStorageBridge = new ChromeStorageBridge()

const otherGUI = new OtherGUI();
const logger = Logger
logger.useDefaults({
    defaultLevel: Logger.DEBUG,
    formatter: function (messages, context) {
        messages.unshift(new Date().toUTCString())
    }
})

function getDefaultData():DBData{
    return {
        dbs:[],
        setting:{
            autoRefresh:undefined,
            removeLimit:10
        },
        version:0.5
    };
}

let isEnableSave = true
function saveData(){
    // loadData 함수 실행중일경우 종료
    if(!isEnableSave) return
    const dbData:DBData = {
        dbs:bodyGUI.toJSON(),
        setting:otherGUI.getSettingJSON(),
        version:0.5
    };
    otherGUI.printExportData(dbData)
    
    const galleryID: string = $("#search").val() as string;
    chromeStorageBridge.set(dbData,galleryID)

}

// 노드 추가
$("#addNode").click( bodyGUI.addNode.bind(bodyGUI) )

// 검색기능
$("#search").keyup((e) => {
    isEnableSave = false
    var galleryID:string = "Swiper_" + $("#search").val();
    chrome.storage.sync.get( galleryID,function(result){
        let dbData: DBData | undefined = result[galleryID] as any
        if(dbData == undefined) 
            dbData = getDefaultData();
        bodyGUI.setNodes(dbData.dbs);
        otherGUI.setSetting(dbData.setting);
        isEnableSave = true
    });

})

//세부요소 삭제시 자동 세이브 기능 탑재
$("#wrap").on("DOMNodeRemoved",(fn) => {
    // 검색중인경우 자동세이브 무효화
    if ( $("#search").is(':focus')) return

	const classList = fn.target.classList
    if(classList.contains("filterItem") || classList.contains("condition") ){
        logger.debug("DOMNodeRemoved 이벤트 발생, 데이터 저장 시도",fn)
        saveData()
    }
        

})

//노드 추가시 자동 세이브 기능 탑재
$("#wrap").on("change input",function(fn){
    logger.debug("change input 이벤트 발생, 데이터 저장 시도",fn)
    saveData()
})

$("#sideNav").on("mouseup",function(fn){
    logger.debug("sidenav click 이벤트 발생, 데이터 저장 시도",fn)
    saveData() 
})