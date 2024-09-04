var data = require('../../configue/database')
var mongo = require('mongodb')
const { ObjectId } = require('mongodb');

exports.adminIndex = (req, res) => {
    res.render('admin/admin', { admin: true })
}

exports.addIndex = (req, res) => {
    data.then((dbase) => {
        dbase.collection('adduser').find().toArray().then((result) => {
            res.render('admin/add', { admin: true, result })
console.log(result)
        })
    })

};
exports.catagoryIndex = (req, res) => {
    data.then((dbase => {
        dbase.collection('adduser').find().toArray().then((result) => {
            res.render('admin/catagory', { admin: true, result })
            // console.log(

            // );
            
        })
    }))

};


 exports.deletesad=(req,res)=>{
    let deleid = req.params.id;
    data.then((db)=>{
    db.collection('adduser')
    .deleteOne({_id:new mongo.ObjectId(deleid)})
    .then((deleteRes)=>{
      console.log(deleteRes)
    });
  res.redirect('/admin/catagory')
 });
 };


exports.editIndex=(req,res)=>{
    let editad=req.params.id;
    if(!ObjectId.isValid(editad)){
        return res.status(400).send('Invalid Id format.')
    }
    data.then((db)=>{
        db.collection('adduser')
        .findOne({_id: new mongo.ObjectId(editad)}).then((result)=>{
            console.log(result);
            res.render('admin/edit',{result,admin:true});
        });
    });
};





exports.subcatagoryIndex = (req, res) => {
    data.then((dbase) => {
        dbase.collection('adduser').find().toArray().then((result) => {
            res.render('admin/subcatagory', { admin: true, result })
             console.log(result)
        })
    })

};

// exports.subcatagorytableIndex = (req, res) => {
//     data.then((dbase)=>{
//         dbase.collection('subcatagory').find().toArray().then((resultss)=>{
//             res.render('admin/subcatagorytable',{admin:true,resultss})
//         })   
//     })
   
//   }


exports.subtableIndex = (req, res) => {
    let tabl=req.params.id;
    data.then(async(base)=>{
       
       
        
         const sub=await base.collection('adduser').find().toArray()
        
       
         const tab=await base.collection('subcatagory').aggregate([
            {
                '$addFields':{'catagoryId':{'$toObjectId':'$catagories'}}
            },
            {
                $lookup:{
                    from:'adduser',
                    localField:'catagoryId',
                    foreignField:'_id',
                    as:'subcata'
                }
            },
            {$unwind:'$subcata'}
        ]).toArray()
        res.render('admin/subcatagorytable', { admin: true,tab,sub })
        console.log(tab)
    })
}
    



exports.subdeleteIndex=(req,res)=>{
    let deleid = req.params.id;
    
    data.then((db)=>{
    db.collection('subcatagory')
    .deleteOne({_id:new mongo.ObjectId(deleid)})
    .then((deleteRes)=>{
      console.log(deleteRes)
    });
  res.redirect('/admin/subcatagorytable')
 });
 };



 exports.subeditIndex=(req,res)=>{
    let params=req.params.id;
    if(!ObjectId.isValid(params)){
        return res.status(400).send('Invalid Id format.')
    }
    data.then(async(base)=>{
        const results= await base.collection('adduser').find().toArray()
        const resu =await base.collection('subcatagory').findOne({_id: new mongo.ObjectId(params)});
        res.render('admin/subedit',{results,resu,admin:true})
    })
}



exports.productIndex = (req, res) => {
    let params=req.params.id;
   
   
    data.then(async(base) => {
      const result=await base.collection('adduser').find().toArray()
       const data=await base.collection("subcatagory").find().toArray()
       res.render("admin/product",{result,data,admin:true})
        });
    
  };
   

  

  exports.produtableIndex = (req, res) => {
    
            res.render('admin/produtable', { admin: true })
            
            
        }



        exports.prouctableIndex = (req, res) => {
            let pro=req.params.id;
            data.then(async(base)=>{
               
               
                
                 const subs=await base.collection('product').find().toArray()
                
               
                 const tabs=await base.collection('product').aggregate([
                    {
                        '$addFields':{'catagoryId':{'$toObjectId':'$catagoryName'}}
                    },
                    {
                        $lookup:{
                            from:'adduser',
                            localField:'catagoryId',
                            foreignField:'_id',
                            as:'procata'
                        }
                    },
                    {$unwind:'$procata'},
                    {
                        '$addFields':{'subcatagory':{'$toObjectId':'$SubcatagoryName'}}
                    },
                    {
                        $lookup:{
                            from:'subuser',
                            localField:'subcatagory',
                            foreignField:'_id',
                            as:'subprocata'
                        }
                    },
                    {$unwind:'$subprocata'}
                ]).toArray()
                res.render('admin/prouctable', { admin: true,tabs,subs })
                console.log(tabs)
            })
        }