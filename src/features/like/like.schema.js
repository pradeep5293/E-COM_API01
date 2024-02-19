import mongoose from "mongoose";


export const likeSchema=new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'on_model'
    },
    on_model:{
        type:String,
        enum:['Product','Category']
    }
}).pre('save',(next)=>{
    console.log("New like added");
    next();
})
.post('save',(doc)=>{
    console.log("Like is save");
    console.log(doc);
}).pre('find',(next)=>{
    console.log("Post find");
    next();
}).post('find',(docs)=>{
    console.log("Post find");
    console.log(docs);
})