module.exports = {
    isActive: (req, res, next) => {
        if(req.user.isActive){
            next()
        }else{
            res.status(401).json(unauthorized)
        }
    }, 

    isSuperAdmin: (req,res,next) => {
        if(req.user.isSuperAdmin){
            next()
        }else{
            res.status(401).json(unauthorized)
        }
    }
}