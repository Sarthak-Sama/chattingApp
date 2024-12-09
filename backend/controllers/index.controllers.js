module.exports.homepage = (req, res, next) =>{
    try {
        res.render("index")
    } catch (error) {
        next(error);
        
    }
}

module.exports.chatpage = (req, res, next) =>{
    try {
        res.render("chat")
    } catch (error) {
        next(error);
        
    }
}