const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const {getAllProducts, addProduct,deleteProduct,updateProduct} = require('./db-access/shop-dao');
const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//ROUTES

app.get('/',(req, res) => {
    res.send('it works')
})

app.get('/shop/all',(req, res) => {
getAllProducts()
.then(products => res.json(products))
.catch(err =>{
    console.log(err);
    res.status(500).send({error:"Failed to load all products"})
})
})

app.post('/shop/add',(req, res) => {
    if(!req.body || !req.body.ProductName){
        res.status(400).json({error:"Pleease include a Proudct Name"})
        return;
    }

    const newProduct = {
        ProductName: req.body.ProductName,
        Company: req.body.Company,
        Price: req.body.Price,
        ProductLink: req.body.ProductLink,
        LinkShop: req.body.LinkShop
    }

    addProduct(newProduct)
    .then(addedProduct => res.status(201).json(addedProduct))
    .catch(err =>{
        console.log(err)
        res.status(500).send({error:"Failed to add Product to database"})
    })
})

app.put('/shop/edit',(req, res) => {
    const productId = req.body._id;
    const newProductValue = {
       ProductName: req.body.ProductName,
       Company: req.body.Company,
       Price: req.body.Price,
       ProductLink: req.body.ProductLink,
       LinkShop:req.body.LinkShop
    }
  

    updateProduct(productId, newProductValue)
    .then(updatedProduct => res.json(updatedProduct))
    .catch(err =>{
        console.log(err)
        res.status(500).json({error:"Failed to update product"})
    })
})


app.delete('/shop/delete/:id',(req, res) => {
    const productId = req.params.id
    deleteProduct(productId)
    .then(removedProduct => res.json({removedProduct}))
    .catch(err =>{
        console.log(err)
        res.status(500).json({error:"Failed to delete product"})
    })
})

// app.use((req, res)=>{
//     res.status(404).json({error: '404 Not Found'});
// })
app.listen(PORT, ()=> console.log('listening on port',PORT));