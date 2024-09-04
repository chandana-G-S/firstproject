var data = require('../../configue/database')
var mongo = require('mongodb')
const { ObjectId } = require('mongodb');

exports.adminIndex = (req, res) => {
    res.render('admin/admin', { admin: true })
}

exports.addIndex = (req, res) => {
    data.then((dbase) => {
        dbase.collection('catagory').find().toArray().then((result) => {
            res.render('admin/add', { admin: true, result })
            console.log(result)
        })
    })

};
exports.catagoryIndex = (req, res) => {
    data.then((dbase => {
        dbase.collection('catagory').find().toArray().then((result) => {
            res.render('admin/catagory', { admin: true, result })
            // console.log(

            // );

        })
    }))

};


exports.deletesad = (req, res) => {
    let deleid = req.params.id;
    data.then((db) => {
        db.collection('catagory')
            .deleteOne({ _id: new mongo.ObjectId(deleid) })
            .then((deleteRes) => {
                console.log(deleteRes)
            });
        res.redirect('/admin/catagory')
    });
};


exports.editIndex = (req, res) => {
    let editad = req.params.id;
    if (!ObjectId.isValid(editad)) {
        return res.status(400).send('Invalid Id format.')
    }
    data.then((db) => {
        db.collection('catagory')
            .findOne({ _id: new mongo.ObjectId(editad) }).then((result) => {
                console.log(result);
                res.render('admin/edit', { result, admin: true });
            });
    });
};





exports.subcatagoryIndex = (req, res) => {
    data.then((dbase) => {
        dbase.collection('catagory').find().toArray().then((result) => {
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
    let tabl = req.params.id;
    data.then(async (base) => {



        const sub = await base.collection('catagory').find().toArray()


        const tab = await base.collection('subcatagory').aggregate([
            {
                '$addFields': { 'catagoryId': { '$toObjectId': '$catagories' } }
            },
            {
                $lookup: {
                    from: 'catagory',
                    localField: 'catagoryId',
                    foreignField: '_id',
                    as: 'subcatagory'
                }
            },
            { $unwind: '$subcatagory' }
        ]).toArray()
        res.render('admin/subcatagorytable', { admin: true, tab, sub })
        console.log(tab)
    })
}




exports.subdeleteIndex = (req, res) => {
    let deleid = req.params.id;

    data.then((db) => {
        db.collection('subcatagory')
            .deleteOne({ _id: new mongo.ObjectId(deleid) })
            .then((deleteRes) => {
                console.log(deleteRes)
            });
        res.redirect('/admin/subcatagorytable')
    });
};



exports.subeditIndex = (req, res) => {
    let params = req.params.id;
    if (!ObjectId.isValid(params)) {
        return res.status(400).send('Invalid Id format.')
    }
    data.then(async (base) => {
        const results = await base.collection('catagory').find().toArray()
        const resu = await base.collection('subcatagory').findOne({ _id: new mongo.ObjectId(params) });
        res.render('admin/subedit', { results, resu, admin: true })
    })
}



exports.productIndex = (req, res) => {
    let params = req.params.id;

    data.then(async (base) => {
        if (!base) {
            console.error('Database connection failed');
            return res.status(500).render('error', { message: 'Database connection failed' });
        }

        try {
            const result = await base.collection('catagory').find().toArray();
            const data = await base.collection("subcatagory").find().toArray();

            res.render("admin/product", { result, data, admin: true });
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).render('error', { message: 'Error fetching data' });
        }
    }).catch(error => {
        console.error('Database connection error:', error);
        res.status(500).render('error', { message: 'Database connection error' });
    });
};




// exports.produtableIndex = (req, res) => {

//     res.render('admin/product_table', { admin: true })


// }


exports.produtableIndex = (req, res) => {
    data.then(async (base) => {
        if (!base) {
            console.error('Database connection failed');
            return res.status(500).render('error', { message: 'Database connection failed' });
        }

        try {
            const subs = await base.collection('product').find().toArray();
            console.log("subs:", subs);

            const pipeline = [
                {
                    $lookup: {
                        from: 'catagory',
                        let: { catagoryId: { $toObjectId: "$catagory" } },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$catagoryId"] } } }
                        ],
                        as: 'procata'
                    }
                },
                {
                    $unwind: {
                        path: '$procata',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'subcatagory',
                        let: { subcatagoryId: { $toObjectId: "$subcatagory" } },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$subcatagoryId"] } } }
                        ],
                        as: 'subprocata'
                    }
                },
                {
                    $unwind: {
                        path: '$subprocata',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ];

            const tabs = await base.collection('product').aggregate(pipeline).toArray();
            console.log("tabs:", tabs);

            // If tabs is empty, log intermediate results
            if (tabs.length === 0) {
                for (let i = 0; i < pipeline.length; i++) {
                    const intermediateResult = await base.collection('product').aggregate(pipeline.slice(0, i + 1)).toArray();
                    console.log(`After stage ${i + 1}:`, intermediateResult);
                }
            }

            res.render('admin/product_table', { admin: true, tabs, subs });
        } catch (error) {
            console.error('Error in produtableIndex:', error);
            res.status(500).render('error', { message: 'An error occurred while processing the request' });
        }
    });
}