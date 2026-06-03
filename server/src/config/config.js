import dotenv from "dotenv";

dotenv.config();

if(!process.env.MONGO_URI){
  throw new Error("MONGO_URI is not there in Environment Variables")
}

if(!process.env.JWT_SECRET){
  throw new Error("JWT_SECRET is not there in Environment Variables")
}

if(!process.env.GOOGLE_GENAI_API_KEY){
  throw new Error("GOOGLE_GENAI_API_KEY is not there in Environment Variables")
}

const config={
  MONGO_URI:process.env.MONGO_URI,
  JWT_SECRET:process.env.JWT_SECRET,
  GOOGLE_GENAI_API_KEY:process.env.GOOGLE_GENAI_API_KEY
}

export default config;