var express=require('express')
var router=express.Router()
var controller=require('./controller')
router.get('/',controller.userIndex)



module.exports=router