const mongoose = require('mongoose')
const ordersSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerFirstName: String,
  customerLastName: String,
  email: String,
  address: String,
  city: String,
  pincode: String,
  items: Array,
  totalAmount: Number,
  paymentId: { type: String, default: "" },
  status: { type: String, default: "Created" },
  invoicePath: { type: String, default: "" } // <--- YE LINE ADD KAREIN
});
module.exports = mongoose.model('orders', ordersSchema);