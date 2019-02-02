import {DBData, DBData_dbs, BoardData} from '../interface/DBData'
import {ProblemData, RemoveNode, BlockNode, CleanerResult  } from '../interface/CleanerInterface'

import DCBoard from '../model/DCBoard'
import CleanerGUI from '../controller/cleanerGUI'
import { GlobalLogger, ILogger } from '../utils/logger'


class Cleaner {
    _allDatas: DBData
    _dcBoard: DCBoard
    _datas: Array<DBData_dbs>;
    _gui: CleanerGUI;
    _logging: ILogger;

    constructor(dcBoard: DCBoard, datas: DBData, gui: CleanerGUI,logger:GlobalLogger) {
        this._dcBoard = dcBoard;
        this._allDatas = datas
        this._datas = datas.dbs;
        this._gui = gui;
        this._logging = logger.get("cleaner")
    }

    _getProblemList(datas: DBData_dbs[]): ProblemData[] {
        const result: ProblemData[] = [];
        datas.forEach((data: DBData_dbs) => {
            const targetBoardDatas = this._dcBoard.inspect(data.condition);
            if (targetBoardDatas.length == 0) return;
            targetBoardDatas.forEach((board: BoardData) => {
                result.push({
                    board: board,
                    dbData: data
                })
            })
        })

        return result;
    }

    _getRemoveList(datas: ProblemData[]): RemoveNode[] {
        return datas
            .filter((data: ProblemData) => data.dbData.isRemove)
            .map((data: ProblemData) => ({
                id: data.board.id,
                $dom: data.board.$dom
            }));
    }

    _getBlockList(datas: ProblemData[]): BlockNode[] {
        return datas
            .filter((data: ProblemData) => data.dbData.block.isBlock)
            .map((data: ProblemData) => ({
                id: data.board.id,
                length: data.dbData.block.length as number,
                reason: data.dbData.block.reason as string,
                $dom: data.board.$dom
            }));
    }



    conductBlock(blockList: BlockNode[]): BlockNode[] {
        blockList.forEach((blockNode: BlockNode) => {
            this._gui.clickBlock(blockNode);
        })
        return blockList;
    }

    conductRemove(removeNodes: RemoveNode[]): RemoveNode[] {
        this._gui.clickRemove(removeNodes);
        return removeNodes
    }

    isLimitCountOver(removeNode: RemoveNode[]){
        if(this._allDatas.setting.removeLimit === null) return false
        return removeNode.length >= this._allDatas.setting.removeLimit;
    }
    /**
     * 차단, 삭제작업을 수행한 후 결과 보고
     */
    start():CleanerResult {
        const datas = this._datas;
        const problemDatas: ProblemData[] = this._getProblemList(datas);
        this._logging.debug("삭제 혹은 차단의 대상이 되는 요소", problemDatas)
        const removeList = this._getRemoveList(problemDatas);
        const blockList = this._getBlockList(problemDatas);
        if( !this.isLimitCountOver(removeList) ){
            const blockResult = this.conductBlock(blockList);
            const removeResult = this.conductRemove(removeList);    
            return {
                remove: removeResult,
                block: blockResult
            }
        } 
        return {
            remove: [],
            block: []
        }
    }
}


export default Cleaner