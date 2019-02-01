var Comment = {
    _insertContent: (message) => $("#memo,#comment_memo").val(message()),
    _clickWrite: () => $("#re_member_write,#submit_comment").trigger("click"),
    _insertName: (name) => $("#name").val(name),
    _insertPassword: (password) => $("#password").val("password"),
    write: function(message,name,password){
        name && this._insertName(name);
        password && this._insertPassword(password);
        this._insertContent(message);
        setTimeout(() => this._clickWrite(), 600);
    }
}

var Pageno = {
    _getThisNo: () => {
        const no = new URL(window.location.href).searchParams.get("no");
        if(no == null) throw new Error("글번호를 찾을 수 없습니다.")
        return parseInt(no);
    },
    _getLastNo: () => {
        
        let url = $(".list_best li a").eq(0).attr("href");
        if($(".list_best li a").eq(0).attr("href") == undefined) return NaN
        let no = new URL(url).searchParams.get("no");
        return parseInt(no);
    },
    isLast: function(){
        return this._getThisNo() == this._getLastNo()
    },
    goNext: function(){
        if(this.isLast()) throw new Error("마지막페이지므로 다음 페이지로 이동 할 수 없습니다.");
        this.go( this._getThisNo() + 1 ); 
    },
    go: (pageno) => {
        window.location = "http://m.dcinside.com/view.php?id=aoegame&no=" + pageno;
    }
}

const refresh = (timing) => setTimeout(() => location = location, timing)
function commentBot(message,name,timing = 4000){
    if( $(".guide").html() == "해당게시물은 삭제 되었습니다." ) window.location = "http://m.dcinside.com/list.php?id=aoegame"; 
    try{
        Pageno._getThisNo();
    } catch (e){
        Pageno.go(Pageno._getLastNo());
    }
    if( Pageno.isLast() ){
        refresh(timing)
    } else{
        Comment.write(message,name)
        setTimeout(() => Pageno.goNext(),timing)
    }
}

const getRandomMessage = () => "ㄹㅇ" + "ㅋ".repeat(Math.random() * 15)
commentBot(getRandomMessage,"ㅇㅇ")