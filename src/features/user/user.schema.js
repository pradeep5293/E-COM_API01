
import mongoose from "mongoose";

export const userSchema=new mongoose.Schema({
    name:{type:String,maxLength:[25,"Name cannot be greater than 25 characters"]},
    email:{type:String,unique:true,reuired:true,
    match:[/.+\@.+\../,"Please enter the valid email"]
    },
    password:{type:String,
        // validate:{
        //     validator:function(value){
        //         return /^(?=.*[@$!%*&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value)
        //     },
        //     message:"Password should be between 8-12 characters and have special characters"
        // }
    },
    type:{type:String,enum:['Customer','Seller']}
})