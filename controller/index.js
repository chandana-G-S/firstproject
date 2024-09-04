var express=require('express')
var router=express.Router()
var userr=require('./user')
var admin=require('./admin')
// var cat=require('./cata')
// var addform=require('./form')


router.use('/',userr),
router.use('/admin',admin),

// router.use('/',cat)
// router.use('/',addform)


module.exports=router