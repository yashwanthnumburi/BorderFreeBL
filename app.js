
require('dotenv').config();
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');

const { getAllProducts, updateProductCountInCart, getCartProducts, getItemDetailsInCart } = require('./dynamo');
const app=express();
 
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
app.get('/getAllProducts', async (req, res) => {
    try{
        const data=await getAllProducts();
        res.send(data);
    }catch{
        console.log(err);
    }
});

app.post('/addProductToCart', async (req, res) => {
    try{
        const productId=req.body.productId;
        const count=parseInt(req.body.count);
        const data=await updateProductCountInCart(productId,count);  
        res.send(data);    
    }catch(err){
        console.log(err);
    }
});

app.get('/getCartProducts',async (req,res)=>{
    try{
        const data=await getCartProducts();
        res.status(200).send(data);
    }catch(err){
        console.log('errorjj',err);
    }
});

app.post('/getItemDetailsInCart',async (req,res)=>{
    try{
        const products=req.body.products;
        const data=await getItemDetailsInCart(products);
        res.status(200).send(data.Items);
    }catch(err){    
        console.log(err);
    }
})

app.listen(process.env.PORT || 3001, () =>
  console.log('Example app listening on port 3001!')
);
