import User from "../models/user.model.js"
import { genToken } from "../config/token.js"

export const googleAuth=async(req,res)=>{
  try {
    const {name,email,firebaseUID}=req.body
    if(!name || !email || !firebaseUID){
      return res.status(400).json({message:"Name, Email, and Firebase UID are required"})
    }
    let user=await User.findOne({email})
    if(!user){
      user=await User.create({
        name,email,firebaseUID
      })
    }
    const token = await genToken(user._id)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({message:`Google AUth Error ${error}`})
  }
}

export const logout=async(req,res)=>{
  try {
    await res.clearCookie("token",{
      httpOnly:true, //when deployed, true
      secure:false,//when deployed, false
      sameSite:"none",
    })
    return res.status(200).json({message:"Logged out successfully"})
  } catch (error) {
    return res.status(500).json({message:`Logout Error ${error}`})
  }
}

export const completeOnboarding = async(req,res)=>{
  try {
    const {
      username,
      gender,
      college,
      skills,
      bio,
      github,
      linkedin,
      x,
      portfolio,
      projects
    } = req.body

    const user = await User.findByIdAndUpdate( 
      req.user.id,
      {
        username,
        gender,
        college,
        skills,
        bio,

        socials:{
          github,
          linkedin,
          x,
          portfolio
        },

        projects,

        onboardingCompleted:true
      },

      {new:true}
    )

    return res.status(200).json({

   message:"Profile completed successfully",

   user

})

  } catch (error) {
    
    return res.status(500).json({
      message:`Onboarding Error ${error}`
    })
  }
}

export const getProfile=async(req,res)=>{

  try {

    const user=await User.findById(req.user.id)

    if(!user){
      return res.status(404)
      .json({
        message:"User not found"
      })
    }

    return res.status(200).json(user)

  }

  catch(error){

    return res.status(500).json({
      message:`Profile Error ${error}`
    })
  }
}

export const updateProfile=async(req,res)=>{

  try {

    const user=
      await User.findByIdAndUpdate(

        req.user.id,

        req.body,

        {
          new:true
        }
      )

    return res.status(200)
    .json(user)

  }

  catch(error){

    return res.status(500).json({
      message:`Update Error ${error}`
    })
  }
}


