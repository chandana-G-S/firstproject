var express= require('express');
var router=express.Router();
var controller=require('./controller');
var data=require('../../configue/database');
var mongo=require('mongodb');


router.get('/',controller.adminIndex);
router.get('/add',controller.addIndex);
router.get('/edit/:id',controller.editIndex);
router.get('/subcatagory',controller.subcatagoryIndex);
router.get('/subcatagorytable',controller.subtableIndex);
router.get('/subcatagorytable/:id',controller.subdeleteIndex);
router.get('/subedit/:id',controller.subeditIndex)
router.get('/product',controller.productIndex);
router.get('/produtable',controller.produtableIndex);
// router.get('/produtable/:id',controller.productdeleteIndex);
// router.get('/proedit',controller.proeditIndex);



router.post('/add',(req,res)=>{
    let params={
        catagory:req.body.catagory,
        image:req.files.image.name,
        discription:req.body.discription,
    }
    data.then((db)=>{
        db.collection('adduser').insertOne(params).then((result)=>{
            const fileUp=req.files.image;
            fileUp.mv("public/images/"+params.image).then((resrimg)=>{
                console.log(resrimg);
            })
            console.log(result);
        })
    })
    res.redirect('/admin/catagory')
});
router.get('/catagory',controller.catagoryIndex);

router.get('/catagory/:id',controller.deletesad);




router.post('/edit/:id',(req,res)=>{
    let upadid= req.params.id;
    let params={
        catagory:req.body.catagory,
        image: req.files?.image.name,
        discription:req.body.discription,
    } 
    let newassign="";
    if(req.files?.image){
        newassign={
            catagory:params.catagory,
            image:params.image,
            discription:params.discription,
        };
        const fileup=req.files.image;
        fileup.mv("public/images/" + params.image) 
    } 
    else{
        newassign={ 
            catagory:params.catagory,
            discription:params.discription ,  
    };
}
    
    data.then((db)=>{
        db.collection('subcatagory').updateOne({_id:new mongo.ObjectId(upadid)})
        .then((result)=>{
            console.log(result);
          
        });
    });
    res.redirect('/admin/subcatagories');
});
   


router.post('/subcatagory',(req,res)=>{
    let params={
      catagories:req.body.catnames,
      subcatagories:req.body.subcatagories,

    }
    data.then((db)=>{
      db.collection('subcatagory').insertOne(params).then((tablresult)=>{
        console.log(tablresult)
      })
    })
res.redirect('/admin/subcatagory')
  })  


router.post('/subedit/:id',(req,res)=>{
    let upeditId=req.params.id;
    let params={
        catagories:req.body.catnames,
        subcatagories:req.body.subcatagories,   
    };
    data.then((db)=>{
        db.collection('subcatagory').updateOne({_id:new mongo.ObjectId(upeditId)},{$set:params}).then((result)=>{
            console.log(result)
            res.redirect("/admin/subcatagorytable")
        })
    })
})




// router.post('/product',(req,res)=>{
//     let params={
//         catagoryName:req.body.catagoryName,
//       SubcatagoryName:req.body.SubcatagoryName,
//       productName:req.body.productName,
//       ProductDiscription:req.body.ProductDiscription,
      
//        ProductPrice:req.body.ProductPrice,

//       productimage: req.files?.productimage.name,
  
  
//     }
//     data.then((db)=>{
//       db.collection('product').insertOne(params).then((subresult)=>{
//         // const fileUp=req.files.image;
//         //       fileUp.mv("public/images/"+params.image).then((resrimg)=>{
//             console.log(subresult)
//                 //   console.log(resrimg);


//               })
//         console.log(subresult)
//       })
//       res.redirect('/admin/product')
//     })
 
// //   })




router.post('/product', (req, res) => {
    let params = {
        catagoryName: req.body.catagoryName,
        SubcatagoryName: req.body.SubcatagoryName,
        productName: req.body.productName,
        ProductDiscription: req.body.ProductDiscription,
        ProductPrice: req.body.ProductPrice,
        productimage: req.files?.productimage?.name
    };
  console.log(params , "params");
    data.then((db) => {
        db.collection('product').insertOne(params)
            .then((subresult) => {
                console.log(subresult);
                
                if (req.files?.productimage) {
                    const fileUp = req.files.productimage;
                    return fileUp.mv("public/images/" + params.productimage);
                }
            })
            .then(() => {
                res.redirect('/admin/product');
            })
            .catch((error) => {
                console.error("Error inserting product or uploading image:", error);
                res.status(500).send("Error adding product");
            });
    }).catch((error) => {
        console.error("Database connection error:", error);
        res.status(500).send("Database connection error");
    });
  });
module.exports=router