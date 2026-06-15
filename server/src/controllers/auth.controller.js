import User from "../models/user.model.js"
import { genToken } from "../config/token.js"

export const googleAuth=async(req,res)=>{
  try {
    const {name,email,firebaseUID}=req.body
    console.log('Google auth attempt:', { name, email, firebaseUID });
    
    if(!name || !email || !firebaseUID){
      return res.status(400).json({message:"Name, Email, and Firebase UID are required"})
    }
    let user=await User.findOne({email})
    if(!user){
      console.log('Creating new user for:', email);
      user=await User.create({
        fullName: name,
        email,
        firebaseUID
      })
    } else {
      console.log('Existing user found:', email);
    }
    
    const token = await genToken(user._id)
    console.log('Token generated for user:', user._id);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    })
    return res.status(200).json(user)
  } catch (error) {
    console.error('Google auth error:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      message: `Google Auth Error: ${error.message}`,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}

export const logout=async(req,res)=>{
  try {
    console.log('Logout attempt - current cookies:', Object.keys(req.cookies));
    
    // Clear cookie with all possible configurations to ensure it's removed
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
      path: '/'
    });
    
    // Also clear with default path just in case
    res.clearCookie("token");
    
    console.log('Logout successful');
    return res.status(200).json({message:"Logged out successfully"})
  } catch (error) {
    console.error('Logout error:', error);
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

    // Check if username already exists (if provided)
    if (username) {
      const existingUser = await User.findOne({ 
        username: username.trim(), 
        _id: { $ne: req.user._id } // Exclude current user
      });
      
      if (existingUser) {
        return res.status(400).json({
          message: "Username already taken. Please choose a different one."
        });
      }
    }

    console.log('Completing onboarding for user:', req.user.email);
    console.log('Username being set:', username);

    const user = await User.findByIdAndUpdate( 
      req.user._id,
      {
        username: username ? username.trim() : undefined,
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

      {new:true, runValidators: true}
    )

    console.log('Onboarding completed for:', user.email, 'Username:', user.username);

    return res.status(200).json({
      message:"Profile completed successfully",
      user
    })

  } catch (error) {
    console.error('Onboarding error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
      return res.status(400).json({
        message: "Username already taken. Please choose a different one."
      });
    }
    
    return res.status(500).json({
      message: `Onboarding Error: ${error.message}`
    })
  }
}

export const getProfile=async(req,res)=>{

  try {

    const user=await User.findById(req.user._id) // Fix: use _id instead of id

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

        req.user._id, // Fix: use _id instead of id

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


