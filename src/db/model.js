const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const path=require('path')
const jwt=require("jsonwebtoken");
const dotenv=require('dotenv');
const envPath=path.join(__dirname,"./config.env");
dotenv.config({path:envPath});

const userSchema=new mongoose.Schema({
    profile_for:{
        type:String,
    },
    fname:{
        type:String,
        minlength:3
    },
    lname:{
        type:String,
        minlength:3
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    dob:{
        type:String
    },
    marital_status:{
        type:String
    },
    height:{
        type:String
    },
    diet:{
        type:String
    },
    gender:{
        type:String
    },
    religion:{
        type:String
    },
    age:{
        type:Number
    },
    qualification:{
        type:String
    },
    profession:{
        type:String
    },
    number:{
        type:Number
    },
  
    email:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    conform_password:{
        type:String,
        required:true
    },   
    photo:{
        type:String
    },                                                
    Tokens:[
        {
            token:{type:String}
        }
    ]
});

userSchema.pre("save",async function(next){
   this.password= await bcrypt.hash(this.password,10);
   this.conform_password=undefined;
   next();
});

userSchema.methods.generateAuthToken=async function(){
   const token=await jwt.sign({_id:this.id},process.env.SECRETKEY);   
   this.Tokens=this.Tokens.concat({token:token})
   return token;
}


const UserCollection=new mongoose.model("shadidata",userSchema);
module.exports=UserCollection;