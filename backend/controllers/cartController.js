import userModel from '../models/userModel.js'

// add item to user cart
const addToCart = async (req, resp) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1
    }
    else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData })
    resp.json({ success: true, message: "Added to Cart" })
  } catch (error) {
    console.log(error)
    resp.json({ success: false, message: "Error" })
  }
}

//remove items from user cart
const removeFromCart = async (req, resp) => {
  try {
    let userData=await userModel.findById(req.body.userId);
    let cartData=await userData.cartData;
    if(cartData[req.body.itemId]>0){
      cartData[req.body.itemId]-=1;
    }  
    await userModel.findByIdAndUpdate(req.body.userId,{cartData})
    resp.json({success:true,message:"Removed from Cart"})
  } catch (error) {
    console.log(error);
    resp.json({success:false,message:"Error"})
  }
  
}

// fetch user cart data
const getCart = async (req, resp) => {
    try {
      let userData=await userModel.findById(req.body.userId);
      let cartData=await userData.cartData;
      resp.json({success:true,cartData});
    } catch (error) {
      console.log(error);
      resp.json({success:false,message:"Error"})
      
    }

}
export { addToCart, removeFromCart, getCart }