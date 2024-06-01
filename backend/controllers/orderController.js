import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'
import Stripe from 'stripe'


const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)

//placing user order for frontend
const placeOrder=async(req,resp)=>{

  const frontend_url="http://localhost:3001";
  try {
    const newOrder=new orderModel({
      userId:req.body.userId,
      items:req.body.items,
      amount:req.body.amount,
      address:req.body.address
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

    const line_items=req.body.items.map((item)=>({
      price_data:{
        currency:"inr",
        product_data:{
          name:item.name
        },
        unit_amount:item.price*100*80
      },
      quantity:item.quantity
    }));

    line_items.push({
      price_data:{
        currency:"inr",
        product_data:{
          name:"Delivery Charges"
        },
        unit_amount:2*100*80
      },
      quantity:1
    })

    const session=await stripe.checkout.sessions.create({
      line_items:line_items,
      mode:'payment',
      success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    })

    resp.json({success:true,session_url:session.url})
  } catch (error) {
    console.log(error);
    resp.json({success:false,message:"Error"})
  }
};

const verifyOrder= async(req,resp)=>{
  const {orderId,success}=req.body;
  try {
    if(success=="true"){
      await orderModel.findByIdAndUpdate(orderId,{payment:true});
      resp.json({success:true,message:"Paid"})
    }
    else{
      await orderModel.findByIdAndDelete(orderId)
      resp.json({success:false,message:"Not Paid"})
    }
  } catch (error) {
    console.log(error);
    resp.json({success:false,message:"Error"})
  }
}

// user orders for frontend
const userOrders=async (req,resp)=>{
  try {
    const orders=await orderModel.find({userId:req.body.userId})
    resp.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    resp.json({success:false,message:"Error"})
  }
}

// listing orders for admin pannel
const listOrders=async(req,resp)=>{
  try {
    const orders=await orderModel.find({});
    resp.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    resp.json({success:false,message:"Error"})
  }
}

// api for updating order status
const updateStatus=async(req,resp)=>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    resp.json({success:true,message:"Status Updated"})
  } catch (error) {
    console.log(error);
    resp.json({success:false,message:"Error"})
    
  }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}