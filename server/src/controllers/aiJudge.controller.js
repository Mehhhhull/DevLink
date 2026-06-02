import  {evaluateHackathonIdea} from "../services/ai.service.js";

export const evaluateIdea=async(req,res)=>{
  try {
    const {idea}=req.body

    if(!idea){
      return res.status(400).json({
        message:"Idea is required for evaluation"
      })
    }
   const evaluationResult=await evaluateHackathonIdea(idea)

   return res.status(200).json({
    success:true,
    message:"Idea evaluated successfully",
    evaluationResult
  })
  } catch (error) {
    console.error("Error evaluating idea:", error);
    return res.status(500).json({
      message:"Internal server error"
    })
  }
}