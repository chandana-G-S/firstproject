var mongodb = require('mongodb').MongoClient
var Client = new mongodb('mongodb://localhost:27017')

function dataform(){
  return Client.connect().then((dbase)=>{
    var data=dbase.db('newproject')
    return data;
  }).catch(err=>console.log(err))

}
module.exports=dataform()