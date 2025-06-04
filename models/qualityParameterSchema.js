const { Schema, default: mongoose } = require("mongoose");

const qualityParameterSchema=new Schema({
    parameterName:{type:String,required:true},
    minRange:{type:Number,required:true},
    maxRange:{type:Number,required:true},
    methodOfAnalysis:{type:String,required:true},
},{timestamps:true})
module.exports=mongoose.model('qualityCheckParameter',qualityParameterSchema)