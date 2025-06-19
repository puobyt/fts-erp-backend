const { Schema, default: mongoose } = require("mongoose");

const qualityParameterSchema=new Schema({
    parameterName:{type:String,required:true},
    minRange:{type:Number,required:true},
    maxRange:{type:Number,required:true},
    methodOfAnalysis:{type:String,required:true},
    unit:{type:String,required:true},
    isActive:{type:Boolean,default:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"Admin"},
    removed:{type:Boolean,default:false},
    
},{timestamps:true})
module.exports=mongoose.model('qualityCheckParameter',qualityParameterSchema)