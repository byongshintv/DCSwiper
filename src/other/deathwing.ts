
/*
function deathWing(gui:CleanerGUI,dcBoard:DCBoard){
    const removes:RemoveNode[] = [];

    dcBoard.getBoardDatas().map((boardData) =>{
        gui.clickBlock({
            id:boardData.id,
            length:72,
            reason:`${$(".one_line").html()}가 차단했음 ㅇㅇ 꼬우면 맞짱뜨자`,
            $dom:boardData.$dom
        });
        removes.push({
            id:boardData.id,
            $dom:boardData.$dom
        })
    })
    
    gui.clickRemove(removes);
    window.location.href = window.location.href
    
}

export default deathWing

*/