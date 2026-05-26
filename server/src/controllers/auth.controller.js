import User from "../models/user.model.js"

export const googleAuth=async(req,res)=>{
  try {
    const {name,email}=req.body
    if(!name || !email){
      return res.status(400).json({message:"Name and Email is required"})
    }
    let user=await User.findOne({email})
    if(!user){
      user=await User.create({
        name,email
      })
    }
    const token=await genToken(user._id)
    res.cookie("token",token,{
      httpOnly:true,
      secure:false,
      sameSite:"strict",
      maxAge:7 * 24 * 60 * 60 *1000
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
      sameSite:"strict",//when deployed, none
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