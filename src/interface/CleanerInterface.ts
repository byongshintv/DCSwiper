import { BoardData, DBData_dbs } from './DBData'
interface RemoveNode {
    id: number,
    $dom: JQuery,
}

interface BlockNode {
    id: number,
    length: number,
    reason: string,
    $dom: JQuery
}

interface ProblemData {
    board: BoardData,
    dbData: DBData_dbs
}

interface CleanerResult { 
    remove: RemoveNode[]; 
    block: BlockNode[]; 
}

export {RemoveNode, BlockNode, ProblemData, CleanerResult }