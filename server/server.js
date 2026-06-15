import app from "./src/app.js"
import connectToDB from "./src/config/database.js";

connectToDB().then(() => {
  console.log("✅ Database connected successfully");
}).catch((err) => {
  console.error("❌ Database connection failed:", err.message);
  process.exit(1);
});

app.listen(3000,()=>{
  console.log("✅ Server is running on port 3000");
  console.log("🔗 Make sure the database is connected before making requests");
})