const AWS = require('aws-sdk');
require('dotenv').config();


AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

var ddb = new AWS.DynamoDB.DocumentClient();

var params = {
    TableName: 'BorderFreeProducts',
    Key: {
      'Id': 'M&H_TShirt'
    }
  };
  
  const getAllProducts=()=>{
    return ddb.get(params).promise();
}

//add to user
var updateProductParams = {
    TableName :"BorderFreeUsers",
        Key:{
            "User_Id": 'yashwanthsa@gmail.com',
        },
        UpdateExpression:`set Products.#id=Products.#id+:count`,
        KeyConditionExpression:`attribute_exists(Products.#id)`,
        ExpressionAttributeNames:{
        },
        ExpressionAttributeValues:{
        },
        ReturnValues: "UPDATED_NEW"
}

var addProductParams = {
    TableName: "BorderFreeUsers",
    Key: {
      User_Id: 'yashwanthsa@gmail.com'
    },
    UpdateExpression: "set Products.#id=:count",
    ExpressionAttributeNames: {
    },
    ExpressionAttributeValues: {
    },
    ReturnValues: "UPDATED_NEW"
};
  
const updateProductCountInCart= (productId,count)=>{
    updateProductParams['ExpressionAttributeNames']['#id']=productId;
    updateProductParams['ExpressionAttributeValues'][':count']=count;
    return ddb.update(updateProductParams).promise().then(data=>{
      return data;
    }).catch(async err=>{
      addProductParams['ExpressionAttributeNames']['#id']=productId;
      addProductParams['ExpressionAttributeValues'][':count']=count;
      const result=await addNewProductToCart(addProductParams);
      return result;
  })
}

const addNewProductToCart=async (addparams)=>{
   return ddb.update(addparams).promise();
}

var getCartProductParams={
  TableName: 'BorderFreeUsers',
  Key: {
    'User_Id': 'yashwanthsa@gmail.com'
  }
};


const getCartProducts=  ()=>{
   return ddb.get(getCartProductParams).promise();
}

const getItemDetailsInCart=(products)=>{
  const items={};
  Object.keys(products).forEach((item,index)=>{
    items[`:a${index}`]=item;
  });
  var getCartDetailParams = {
    TableName : "BorderFreeProducts",
    FilterExpression : "Id IN ("+Object.keys(items).toString()+ ")",
    ExpressionAttributeValues:{}
  };
  getCartDetailParams['ExpressionAttributeValues']=items;
  return ddb.scan(getCartDetailParams).promise();
}

module.exports={updateProductCountInCart,getAllProducts,getCartProducts,getItemDetailsInCart};