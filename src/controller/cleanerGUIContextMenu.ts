/**
 *  import materialize from 'materialize-css'
import { DBData_dbs } from '../interface/DBData'
type OnclickData = chrome.contextMenus.OnClickData

interface ContextMenuBehaive{
    toString: ($html:JQuery) => string
    isArise: ($html:JQueryEventObject) => boolean
    onClicked:(onClickData:OnclickData,onContextMenuEvent:JQueryMouseEventObject) => void
    getId:() => string
}


function addCleanerNode(node:DBData_dbs){

}



class BehaiveRegisterBlackListWord implements ContextMenuBehaive{
    onClicked(onClickData: OnclickData): void{
        
    }

    getId(): string{
        return "0"
    }

    toString($html:JQuery){
        return `드래그한 글자를 블랙리스트에 추가`
    }

    isArise(){
        return true
    }


}

class BehaiveRegisterBlackListUsername implements ContextMenuBehaive{
    toString($html:JQuery){
        
        return `${username}을 블랙리스트에 추가 (72시간차단, 글삭제)`
    }

    isArise(){

    }

    onClicked(onClickData:OnclickData){
        onClickData.
    }

    getId():number{ return 1 }
}

class BehaiveRegisterBlackListUserID implements ContextMenuBehaive{
    isArise: ($html: JQueryEventObject) => boolean;
    onClicked: (onClickData: chrome.contextMenus.OnClickData) => void;
    getId: () => string;
    toString(){
        const userID:string = 
        return `${userID}를 블랙리스트에 추가 (72시간차단, 글삭제)`
    }
}

class BehaiveRegisterBlackListUserIP implements ContextMenuBehaive{
    isArise: ($html: JQueryEventObject) => boolean;
    onClicked: (onClickData: chrome.contextMenus.OnClickData) => void;
    getId: () => string;
    toString(){
        const userID:string = 
        return `${userID}를 블랙리스트에 추가 (72시간차단, 글삭제)`
    }
}

class CleanerGUIContextMenu{
    private contextMenuBehaives: ContextMenuBehaive[] = [

    ]

    private contextMenuIDs:Array<string> = [];
    
    constructor(){
        this.initEventListener()
    }

    initEventListener(){
        $("body").on("context",this.onContextMenu)
        $("body").on("click",this.onContextBlur)
        $("body").on("blur",this.onContextBlur)
        
    }

    onContextMenu(){
        this.contextMenuBehaives.forEach(behaive => {
            if(!behaive.isArise) return;
            chrome.contextMenus.create({
                "id": behaive.getId(),
                "title": behaive.toString(),
                "onclick":() => {

                }behaive.onClicked
            })
            this.contextMenuIDs.push(behaive.getId())
        })
    }

    //contextmenu 이벤트 초기화
    onContextBlur(){
        this.contextMenuIDs.forEach( id => {
            chrome.contextMenus.remove(id)
        })
    }

    
}

materialize.toast({html:"작업이 완료되었습니다."})
*/