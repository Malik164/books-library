module.exports={
    ensureAuth:function(req,res,next) {
        if (!req.isAuthenticated()) {
            req.flash('err_msg','Please Log in first to view page!')
            res.redirect('/')
            return
        }
        next()
    },
    alreadyAuth:function (req,res,next) {
        if (req.isAuthenticated()) {
            req.flash('success_msg','Logged in already!')
            res.redirect('/books/add')
            return
        }
        next()
    }
}