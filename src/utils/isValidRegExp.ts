function isValidRegExp( string:string ):boolean{
    try{ 
        new RegExp(string) 
    } catch { 
        return false 
    }
    return true
}


export default isValidRegExp