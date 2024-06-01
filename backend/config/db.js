import mongoose from "mongoose";

export const connectDB=async ()=>{
  await mongoose.connect('mongodb+srv://Mayur7218:721834@cluster0.yksztdr.mongodb.net/food-del').then(()=>console.log("DB connected"));
}

