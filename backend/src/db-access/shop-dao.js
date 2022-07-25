const {ObjectId} =require('mongodb');
const {getDB} = require('./getDB');

function getAllProducts() {
return getDB().then(db =>db.collection('shop').find().toArray())
}


function addProduct(product) {
    return new Promise((resolve, reject) => {
        getDB()
        .then(db => db.collection("shop").insertOne(product))
        .then(result => {
            if(result.acknowledged === true && result.insertedId) {
                return resolve({
                    _id: result.insertedId,
                    ...product,
                })
            } else {
                // result könnte ein error sein, daher reject...
                return reject(result)
            }
        }).catch((err) => reject(err))
    })
}


function updateProduct(productId, newProductValue) {
    return new Promise((resolve, reject)=>{
        getDB()
        .then(db => db.collection('shop').findOneAndUpdate(
            {_id: ObjectId(productId)}, // quere /filtern: was soll upgedated werden?
            {$set:{ 
                ProductName: newProductValue.ProductName,
                Company: newProductValue.Company,
                Price: newProductValue.Price,
                ProductLink: newProductValue.ProductLink,
                LinkShop: newProductValue.LinkShop        
                        
            }}, //update Info
            {returnDocument: "after"}
        ))
        .then(result => {
            if(result.ok === 1) resolve (result.value)
            else reject ({msg:"Error updating product"})
        })
        .catch((err) => reject(err))
    })
}


function deleteProduct(productId) {
    return new Promise((resolve, reject) => {
        getDB()
        .then(db => db.collection('shop').findOneAndDelete({_id:ObjectId(productId)}))
        .then(result =>{
            if(result.ok === 1) resolve(result.value)
            else reject({msg: "Error deleting product"})
        })
        .catch((err)=> reject(err))
    })
}

module.exports = {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct
}