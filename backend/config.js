// const mongoose = require('mongoose')
// mongoose.connect("mongodb://localhost:27017/details");
const mongoose = require('mongoose');
const dns = require('dns');

// 🚀 मोबाइल हॉटस्पॉट की ब्लॉकिंग को तोड़ने के लिए नोड जेएस का DNS चेंज करें
dns.setServers(['8.8.8.8', '8.8.4.4']);

// आपका बिल्कुल सही वाला +srv यूआरएल
const dbURI = process.env.DATABASE_URL;
mongoose.connect(dbURI)
  .then(() => {
    console.log(">>> [SUCCESS] MongoDB Atlas Connected! <<<");
  })
  .catch((err) => {
        console.log(">>> [MONGO ERROR] Connection Failed! <<<");
    console.log("Reason:", err.message);
    
  });

module.exports = mongoose;