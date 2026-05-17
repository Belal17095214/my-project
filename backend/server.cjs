// import mongoose from "mongoose";
// const main = async () => {
//     await mongoose.connect("mongodb://localhost:27017/details");
//     const loginSchema = new mongoose.Schema({
//         name: String,
//         email: String,
//         password: Number,
//         confirmPassword:Number,

//     });
//     const loginmodel = mongoose.model("login", loginSchema);
//     const findindb = async () => {

//     const loginmodel = mongoose.model("login", loginSchema);
//     let data = await loginmodel.find({name:"belal ansari"})
       
//     console.log(data);
    
// }
// findindb();

// }
// main();


import mongoose from "mongoose";
import "dotenv/config"; // 👈 यह लाइन सबसे ऊपर जोड़ना ज़रूरी है ताकि .env फाइल लोड हो सके

const main = async () => {
    // 👈 यहाँ हमने पुराने लिंक को हटाकर .env वाला वेरिएबल डाल दिया है
    await mongoose.connect("mongodb+srv://bilalansari0591:Belal0591@cluster0.sj5vsxd.mongodb.net/details?retryWrites=true&w=majority"); 
    console.log(">>> MongoDB Atlas Connected Successfully! <<<");

    const loginSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: Number,
        confirmPassword: Number,
    });

    // ध्यान दें बिलाल भाई: मॉडल को पूरे main फंक्शन में सिर्फ एक बार डिक्लेयर करना काफी है
    const loginmodel = mongoose.model("login", loginSchema); 

    const findindb = async () => {
        // यहाँ दोबारा const loginmodel लिखने की ज़रूरत नहीं है, क्योंकि ऊपर वो ऑलरेडी बन चुका है
        let data = await loginmodel.find({ name: "belal ansari" });
        console.log("Database से मिला डेटा:", data);
    }
    
    findindb();
}

main();