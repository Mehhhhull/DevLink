import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

 firebaseUID:{
    type:String,
    required:true,
    unique:true
 },

 email:{
    type:String,
    required:true
 },

 username:{
    type:String,
    unique:true,
    sparse:true
 },

 fullName:String,

 avatar:String,

 bio:{
    type:String,
    maxlength:500
 },

 gender:{
    type:String,
    enum:[
      "male",
      "female",
      "other",
      "prefer_not_to_say"
    ]
 },

 college:{

    collegeName:String,

    degree:String,

    branch:String,

    graduationYear:Number
 },

 socials:{

    github:String,

    linkedin:String,

    x:String,

    portfolio:String,

    discord:String
 },

 skills:[String],

 techStack:[String],

 domains:[String],

 preferredRoles:[String],

 lookingFor:[String],

 experienceLevel:{
    type:String,
    enum:[
      "beginner",
      "intermediate",
      "advanced"
    ]
 },

 availability:{
    type:String,
    enum:[
      "weekends",
      "parttime",
      "fulltime",
      "flexible"
    ]
 },

 projects:[{

    title:String,

    description:String,

    techStack:[String],

    githubLink:String,

    liveLink:String
 }],

 hackathonHistory:[{

    hackathonName:String,

    year:Number,

    achievement:String
 }],

 location:{

    city:String,

    country:String
 },

 onboardingCompleted:{
    type:Boolean,
    default:false
 }

},
{
 timestamps:true
})

const User=mongoose.model("User",userSchema);

export default User;