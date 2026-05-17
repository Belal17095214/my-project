
require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./config');
const Signup = require("./Signup");
const Contactus = require('./Contactus');
const OrderModel = require('./Orders');
const jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_KEY;
const fs = require('fs');
const path = require('path');
const html_to_pdf = require('html-pdf-node');
const axios = require('axios');
const nodemailer = require('nodemailer');

// 1. PayPal SDK Setup
const paypal = require('@paypal/paypal-server-sdk');
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;


const { Client, OrdersController, Environment, LogLevel } = require('@paypal/paypal-server-sdk');

// क्रेडेंशियल्स का एकदम सटीक ढांचा (Exact Structure)
const client = new Client({
    clientCredentialsAuthCredentials: {

        clientId: process.env.PAYPAL_CLIENT_ID,
        clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    },
    environment: Environment.Sandbox,
    logging: {
        level: LogLevel.Info,
        logApiRequests: true,
    },
});

// --- अब इस नए तरीके से चेक करें ---
console.log("--- FINAL PAYPAL INSPECTION ---");
if (client && client.configuration && client.configuration.clientCredentialsAuthCredentials) {
    console.log("✅ SUCCESS! AUTH READY.");
} else {
    // अगर फिर भी यहाँ आए, तो हम सीधे मैन्युअल इंजेक्ट करेंगे (The Forceful Way)
    client.clientCredentialsAuthCredentials = {

        clientId: process.env.PAYPAL_CLIENT_ID,
        clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    };
    console.log("⚠️ FORCED! Keys injected manually.");
}

const ordersController = new OrdersController(client);
const app = express();
app.use(cors());
app.use(express.json());
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));
// app.use(express.static(path.join(__dirname,'dist')));

// ye sahi wala hai
// app.post("/create-order", async (req, res) => {
//     try {
//         console.log("1. Backend Hit! Total Amount:", req.body.totalAmount);
//         const { totalAmount } = req.body;

//         // क्रेडेंशियल्स सीधे यहाँ लिखें
//         const clientId = 'AU3e0TKzrbEhmgfjSLI1LNh9zFjQUmgImltPW3k7Ng7pv1Rcdc4mZoEp66rh69DkXoC4XDIemO3v0-V8';
//         const clientSecret = 'ELYzrVvQClMrV1CgJ5TEgPuHI96KVC2-gDZFyTCXJEPgFmyx0L578sSBxRl6lg7ESh_aWhXcfGKhBBhq';

//         // Step A: पेपाल से एक्सेस टोकन लें (AccessToken)
//         const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
//         const tokenResponse = await axios({
//             url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
//             method: 'post',
//             headers: {
//                 Authorization: `Basic ${auth}`,
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             data: 'grant_type=client_credentials'
//         });

//         const accessToken = tokenResponse.data.access_token;
//         console.log("2. Access Token Received!");

//         // Step B: ऑर्डर क्रिएट करें
//         const orderResponse = await axios({
//             url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
//             method: 'post',
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             },
//             data: {
//                 intent: 'CAPTURE',
//                 purchase_units: [{
//                     amount: {
//                         currency_code: 'USD',
//                         value: totalAmount.toString()
//                     }
//                 }]
//             }
//         });

//         console.log("3. PayPal ID Generated:", orderResponse.data.id);
//         res.status(200).json({ id: orderResponse.data.id });

//     } catch (error) {
//         console.error("PAYPAL API ERROR:", error.response ? error.response.data : error.message);
//         res.status(500).json({ message: "PayPal API Error", error: error.message });
//     }
// });

app.post("/create-order", async (req, res) => {
    try {
        console.log("1. Backend Hit! Total Amount:", req.body.totalAmount);

        // फ्रंटएंड से सारा डेटा निकालें (items, address, email आदि)
        const { totalAmount, items, customerFirstName, customerLastName, address, city, pincode, email } = req.body;


        const clientId = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

        // Step A: पेपाल से एक्सेस टोकन लें
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const tokenResponse = await axios({
            url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
            method: 'post',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'grant_type=client_credentials'
        });

        const accessToken = tokenResponse.data.access_token;
        console.log("2. Access Token Received!");

        // Step B: पेपाल पर ऑर्डर क्रिएट करें
        const orderResponse = await axios({
            url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
            method: 'post',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            data: {
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: totalAmount.toString()
                    }
                }]
            }
        });

        const paypalOrderId = orderResponse.data.id;
        console.log("3. PayPal ID Generated:", paypalOrderId);

        // --- 🔥 सबसे ज़रूरी सुधार (Database Save) 🔥 ---
        // पेपाल आईडी को डेटाबेस में सेव करना ताकि 'verify-payment' इसे ढूंढ सके
        const newOrder = new OrderModel({
            ...req.body, // फ्रंटएंड से आया सारा डेटा (items, address, etc.)
            orderId: paypalOrderId, // पेपाल द्वारा दी गई ID को ही orderId मानें
            status: "Pending" // पेमेंट होने तक स्टेटस Pending रहेगा
        });

        await newOrder.save();
        console.log("4. Order successfully saved in MongoDB with ID:", paypalOrderId);

        // फ्रंटएंड को सिर्फ ID भेजें ताकि पेपाल का पॉप-अप खुल सके
        res.status(200).json({ id: paypalOrderId });

    } catch (error) {
        console.error("PAYPAL CREATE ERROR:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "PayPal API Error", error: error.message });
    }
});
//ye sahi wala hai
// app.post("/verify-payment", async (req, res) => {
//     try {
//         const { orderId } = req.body; 
//         console.log("1. Verifying PayPal Order ID:", orderId);

//         const clientId = 'AU3e0TKzrbEhmgfjSLI1LNh9zFjQUmgImltPW3k7Ng7pv1Rcdc4mZoEp66rh69DkXoC4XDIemO3v0-V8';
//         const clientSecret = 'ELYzrVvQClMrV1CgJ5TEgPuHI96KVC2-gDZFyTCXJEPgFmyx0L578sSBxRl6lg7ESh_aWhXcfGKhBBhq';

//         // Step A: Access Token लेना (Axios वाला तरीका जो create-order में काम कर गया)
//         const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
//         const tokenResponse = await axios({
//             url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
//             method: 'post',
//             headers: {
//                 Authorization: `Basic ${auth}`,
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             data: 'grant_type=client_credentials'
//         });

//         const accessToken = tokenResponse.data.access_token;

//         // Step B: पेपाल को बताना कि पैसे काट लो (Capture Order)
//         const captureResponse = await axios({
//             url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
//             method: 'post',
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         console.log("2. PayPal Capture Status:", captureResponse.data.status);

//         if (captureResponse.data.status === 'COMPLETED') {
//             // Transaction ID निकालना
//             const paypalTransactionId = captureResponse.data.purchase_units[0].payments.captures[0].id;

//             // 3. डेटाबेस में स्टेटस "Paid" मार्क करना
//             // ध्यान दें: यहाँ सुनिश्चित करें कि orderId आपके DB में वही है जो पेपाल ने दी थी
//             await OrderModel.findOneAndUpdate(
//                 { orderId: orderId },
//                 { status: "Paid", paymentId: paypalTransactionId }
//             );

//             console.log("✅ Order Verified & Database Updated!");
//             res.status(200).json({ success: true, message: "Payment Captured!" });
//         } else {
//             res.status(400).json({ success: false, message: "Payment not completed" });
//         }

//     } catch (error) {
//         // अगर यहाँ एरर आता है, तो फ्रंटएंड "Verification Failed" बोलेगा
//         console.error("CAPTURE ERROR:", error.response ? error.response.data : error.message);
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// app.post("/verify-payment", async (req, res) => {
//     try {
//         const { orderId } = req.body;
//         console.log(">>> [DEBUG 1] Verification Started for Order:", orderId);

//         const clientId = process.env.PAYPAL_CLIENT_ID;
//         const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

//         // Step A: Token Check
//         console.log(">>> [DEBUG 2] Requesting PayPal Access Token...");
//         const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
//         const tokenRes = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
//             headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' }
//         });
//         console.log(">>> [DEBUG 3] Token Received Successfully.");

//         // Step B: Capture Check
//         console.log(">>> [DEBUG 4] Capturing Order on PayPal...");
//         const captureRes = await axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {}, {
//             headers: { Authorization: `Bearer ${tokenRes.data.access_token}`, 'Content-Type': 'application/json' }
//         });
//         console.log(">>> [DEBUG 5] PayPal Capture Status:", captureRes.data.status);

//         if (captureRes.data.status === 'COMPLETED') {
//             // Step C: DB Check
//             console.log(">>> [DEBUG 6] Searching for Order in MongoDB...");
//             const order = await OrderModel.findOne({ orderId: orderId });

//             if (!order) {
//                 console.error(">>> [ERROR] Order NOT FOUND in Database for ID:", orderId);
//                 return res.status(404).json({ success: false, message: "Order not found in DB" });
//             }
//             console.log(">>> [DEBUG 7] Order Found! Customer:", order.customerFirstName);

//             const { items, customerFirstName, customerLastName, address, city, pincode, email } = order;
//             let subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

//             // Step D: PDF Start
//             console.log(">>> [DEBUG 8] Generating HTML Content for PDF...");
//             let htmlContent = `
// <!DOCTYPE html>
// <html>
// <head>
//     <style>
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

//         body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; color: #1f2937; background: #fff; }
//         .page-container { width: 210mm; height: 297mm; display: flex; flex-direction: column; }

//         .invoice-card { 
//             height: 148.5mm; width: 100%; padding: 35px; box-sizing: border-box; 
//             position: relative; border-bottom: 1px dashed #e5e7eb;
//             background: linear-gradient(to bottom right, #ffffff, #f9fafb);
//         }

//         /* Top Header Section */
//         .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }

//         .shop-name { font-size: 30px; font-weight: 800; color: #3b318f; letter-spacing: -1px; }
//         .shop-name span { color: #d4af37; } /* Gold color for 'Deen' */

//         .status-badge {
//             background: #d1fae5; color: #065f46; padding: 6px 14px;
//             border-radius: 99px; font-size: 12px; font-weight: 700;
//             text-transform: uppercase; letter-spacing: 0.5px;
//         }

//         /* Billing Info Section */
//         .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
//         .info-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 5px; }
//         .info-value { font-size: 13px; line-height: 1.5; font-weight: 500; }

//         /* Table Styling */
//         table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//         th { 
//             background: #3b318f; color: white; text-align: left; 
//             padding: 12px 15px; font-size: 11px; font-weight: 600; 
//             text-transform: uppercase; border-radius: 4px 4px 0 0;
//         }
//         td { padding: 15px; border-bottom: 1px solid #f3f4f6; font-size: 12px; font-weight: 500; }
//         .item-name { font-weight: 600; color: #111827; }

//         /* Summary Section */
//         .footer-section { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 25px; }
//         .gst-note { font-size: 10px; color: #9ca3af; font-style: italic; max-width: 200px; }

//         .summary-box { width: 260px; background: #fff; border: 1px solid #f3f4f6; border-radius: 12px; padding: 15px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
//         .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: #4b5563; }
//         .free-text { color: #10b981; font-weight: 700; } /* Green for FREE */

//         .grand-total { 
//             display: flex; justify-content: space-between; 
//             margin-top: 12px; padding-top: 12px; border-top: 2px solid #f3f4f6;
//             font-size: 18px; font-weight: 800; color: #3b318f; 
//         }

//         /* Floating Label for Copy */
//         .copy-tag {
//             position: absolute; top: 35px; left: 50%; transform: translateX(-50%);
//             font-size: 9px; font-weight: 700; color: #cbd5e1;
//             padding: 4px 12px; border: 1px solid #f1f5f9; border-radius: 99px;
//             text-transform: uppercase;
//         }
//     </style>
// </head>
// <body>
//     <div class="page-container">
//         ${[1, 2].map((i) => `
//         <div class="invoice-card" style="${i === 2 ? 'border-bottom:none;' : ''}">
//             <div class="copy-tag">${i === 1 ? 'Customer' : 'Store'} Copy</div>

//             <div class="header">
//                 <div class="shop-name">GlobalDeen<span>Store</span></div>
//                 <div class="status-badge">Confirmed • Paid</div>
//             </div>

//             <div class="info-grid">
//                 <div>
//                     <div class="info-label">Bill To</div>
//                     <div class="info-value">
//                         <strong style="color:#111827; font-size:15px;">${customerFirstName} ${customerLastName}</strong><br>
//                         ${address}<br>${city}, ${pincode}<br>
//                         <span style="color:#6b7280;">${email}</span>
//                     </div>
//                 </div>
//                 <div style="text-align: right;">
//                     <div class="info-label">Invoice Details</div>
//                     <div class="info-value">
//                         <strong>#${orderId}</strong><br>
//                         Date: ${new Date().toLocaleDateString('en-GB')}<br>
//                         Method: PayPal Online
//                     </div>
//                 </div>
//             </div>

//             <table>
//                 <thead>
//                     <tr>
//                         <th style="border-radius: 8px 0 0 0;">Item Description</th>
//                         <th style="text-align: center;">Qty</th>
//                         <th>Unit Price</th>
//                         <th style="text-align: right; border-radius: 0 8px 0 0;">Total</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${items.map(item => `
//                     <tr>
//                         <td class="item-name">${item.bookName}</td>
//                         <td style="text-align: center;">${item.quantity}</td>
//                         <td>$${parseFloat(item.price).toFixed(2)}</td>
//                         <td style="text-align: right; font-weight: 700;">$${(item.quantity * item.price).toFixed(2)}</td>
//                     </tr>`).join('')}
//                 </tbody>
//             </table>

//             <div class="footer-section">
//                 <div class="gst-note">
//                     <p><strong>Note:</strong> Printed books are exempt from GST under HSN 4901. Thank you for your purchase!</p>
//                 </div>
//                 <div class="summary-box">
//                     <div class="summary-row">
//                         <span>Subtotal</span>
//                         <span>$${subtotal.toFixed(2)}</span>
//                     </div>
//                     <div class="summary-row">
//                         <span>Shipping</span>
//                         <span class="free-text">FREE</span>
//                     </div>
//                     <div class="grand-total">
//                         <span>Amount Paid</span>
//                         <span>$${subtotal.toFixed(2)}</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         `).join('')}
//     </div>
// </body>
// </html>`;

//             console.log(">>> [DEBUG 9] Calling html_to_pdf.generatePdf...");
//             const pdfBuffer = await html_to_pdf.generatePdf({ content: htmlContent }, { format: 'A4', printBackground: true });
//             console.log(">>> [DEBUG 10] PDF Buffer Created.");

//             const fileName = `invoice_${orderId}.pdf`;
//             const dirPath = path.join(__dirname, 'invoices');
//             if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

//             fs.writeFileSync(path.join(dirPath, fileName), pdfBuffer);
//             console.log(">>> [DEBUG 11] PDF File Saved to Disk.");

//             // Step E: Final DB Update
//             order.status = "Paid";
//             order.invoicePath = `/invoices/${fileName}`;
//             await order.save();
//             console.log(">>> [DEBUG 12] Database Updated. Sending Success Response.");

//             return res.status(200).json({ success: true, invoiceUrl: order.invoicePath });
//         }

//         console.warn(">>> [WARN] Capture Status was NOT Completed.");
//         res.status(400).json({ success: false, message: "Payment Failed" });

//     } catch (err) {
//         console.error(">>> [CRITICAL ERROR] Error during verification flow:");
//         console.error("- Message:", err.message);
//         if (err.response) console.error("- PayPal Error Data:", err.response.data);
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

app.post("/verify-payment", async (req, res) => {
    try {
        const { orderId } = req.body;
        console.log(">>> [DEBUG 1] Verification Started for Order:", orderId);

        const clientId = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

        // Step A: Token Check
        console.log(">>> [DEBUG 2] Requesting PayPal Access Token...");
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const tokenRes = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
            headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log(">>> [DEBUG 3] Token Received Successfully.");

        // Step B: Capture Check
        console.log(">>> [DEBUG 4] Capturing Order on PayPal...");
        const captureRes = await axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {}, {
            headers: { Authorization: `Bearer ${tokenRes.data.access_token}`, 'Content-Type': 'application/json' }
        });
        console.log(">>> [DEBUG 5] PayPal Capture Status:", captureRes.data.status);

        if (captureRes.data.status === 'COMPLETED') {
            // Step C: DB Check
            console.log(">>> [DEBUG 6] Searching for Order in MongoDB...");
            const order = await OrderModel.findOne({ orderId: orderId });

            if (!order) {
                console.error(">>> [ERROR] Order NOT FOUND in Database for ID:", orderId);
                return res.status(404).json({ success: false, message: "Order not found in DB" });
            }
            console.log(">>> [DEBUG 7] Order Found! Customer:", order.customerFirstName);

            const { items, customerFirstName, customerLastName, address, city, pincode, email } = order;
            let subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

            // 🛠️ सिंटैक्स क्लैश फिक्स करने के लिए टेबल्स की रो (Rows) को पहले ही बाहर जेनरेट कर लिया
            const tableRowsHtml = items.map(item => `
                <tr>
                    <td class="item-name">${item.bookName || 'Islamic Book'}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td>$${parseFloat(item.price).toFixed(2)}</td>
                    <td style="text-align: right; font-weight: 700;">$${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
            `).join('');

            // Step D: PDF Start (HTML Template)
            console.log(">>> [DEBUG 8] Generating HTML Content for PDF...");

            // दोनों कॉपियों (Customer & Store) के लिए क्लीन लेआउट असेंबल करना
            let invoiceCardsHtml = "";
            for (let i = 1; i <= 2; i++) {
                const copyType = (i === 1) ? 'Customer' : 'Store';
                const bottomBorderStyle = (i === 2) ? 'border-bottom:none;' : '';

                invoiceCardsHtml += `
                <div class="invoice-card" style="${bottomBorderStyle}">
                    <div class="copy-tag">${copyType} Copy</div>
                    
                    <div class="header">
                        <div class="shop-name">GlobalDeen<span>Store</span></div>
                        <div class="status-badge">Confirmed • Paid</div>
                    </div>

                    <div class="info-grid">
                        <div>
                            <div class="info-label">Bill To</div>
                            <div class="info-value">
                                <strong style="color:#111827; font-size:15px;">${customerFirstName} ${customerLastName}</strong><br>
                                ${address}<br>${city}, ${pincode}<br>
                                <span style="color:#6b7280;">${email}</span>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div class="info-label">Invoice Details</div>
                            <div class="info-value">
                                <strong>#${orderId}</strong><br>
                                Date: ${new Date().toLocaleDateString('en-GB')}<br>
                                Method: PayPal Online
                            </div>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style="border-radius: 8px 0 0 0;">Item Description</th>
                                <th style="text-align: center;">Qty</th>
                                <th>Unit Price</th>
                                <th style="text-align: right; border-radius: 0 8px 0 0;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRowsHtml}
                        </tbody>
                    </table>

                    <div class="footer-section">
                        <div class="gst-note">
                            <p><strong>Note:</strong> Printed books are exempt from GST under HSN 4901. Thank you for your purchase!</p>
                        </div>
                        <div class="summary-box">
                            <div class="summary-row">
                                <span>Subtotal</span>
                                <span>$${subtotal.toFixed(2)}</span>
                            </div>
                            <div class="summary-row">
                                <span>Shipping</span>
                                <span class="free-text">FREE</span>
                            </div>
                            <div class="grand-total">
                                <span>Amount Paid</span>
                                <span>$${subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }

            let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; color: #1f2937; background: #fff; }
        .page-container { width: 210mm; height: 297mm; display: flex; flex-direction: column; }
        
        .invoice-card { 
            height: 148.5mm; width: 100%; padding: 35px; box-sizing: border-box; 
            position: relative; border-bottom: 1px dashed #e5e7eb;
            background: linear-gradient(to bottom right, #ffffff, #f9fafb);
        }

        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        
        .shop-name { font-size: 30px; font-weight: 800; color: #3b318f; letter-spacing: -1px; }
        .shop-name span { color: #d4af37; }

        .status-badge {
            background: #d1fae5; color: #065f46; padding: 6px 14px;
            border-radius: 99px; font-size: 12px; font-weight: 700;
            text-transform: uppercase; letter-spacing: 0.5px;
        }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
        .info-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 5px; }
        .info-value { font-size: 13px; line-height: 1.5; font-weight: 500; }

        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { 
            background: #3b318f; color: white; text-align: left; 
            padding: 12px 15px; font-size: 11px; font-weight: 600; 
            text-transform: uppercase; border-radius: 4px 4px 0 0;
        }
        td { padding: 15px; border-bottom: 1px solid #f3f4f6; font-size: 12px; font-weight: 500; }
        .item-name { font-weight: 600; color: #111827; }

        .footer-section { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 25px; }
        .gst-note { font-size: 10px; color: #9ca3af; font-style: italic; max-width: 200px; }

        .summary-box { width: 260px; background: #fff; border: 1px solid #f3f4f6; border-radius: 12px; padding: 15px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: #4b5563; }
        .free-text { color: #10b981; font-weight: 700; }
        
        .grand-total { 
            display: flex; justify-content: space-between; 
            margin-top: 12px; padding-top: 12px; border-top: 2px solid #f3f4f6;
            font-size: 18px; font-weight: 800; color: #3b318f; 
        }

        .copy-tag {
            position: absolute; top: 35px; left: 50%; transform: translateX(-50%);
            font-size: 9px; font-weight: 700; color: #cbd5e1;
            padding: 4px 12px; border: 1px solid #f1f5f9; border-radius: 99px;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="page-container">
        ${invoiceCardsHtml}
    </div>
</body>
</html>`;

            console.log(">>> [DEBUG 9] Calling html_to_pdf.generatePdf...");
            const pdfBuffer = await html_to_pdf.generatePdf({ content: htmlContent }, { format: 'A4', printBackground: true });
            console.log(">>> [DEBUG 10] PDF Buffer Created.");

            const fileName = `invoice_${orderId}.pdf`;
            const dirPath = path.join(__dirname, 'invoices');
            if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

            const fullPdfPath = path.join(dirPath, fileName);
            fs.writeFileSync(fullPdfPath, pdfBuffer);
            console.log(">>> [DEBUG 11] PDF File Saved to Disk.");

            // Step E: Final DB Update
            order.status = "Paid";
            order.invoicePath = `/invoices/${fileName}`;
            await order.save();
            console.log(">>> [DEBUG 12] Database Updated.");

            // ========================================================
            // 🔥 NODEMAILER: क्लीन एवं स्पेस-मुक्त ईमेल सेंडिंग लॉजिक
            // ========================================================
            console.log(">>> [EMAIL STEP 1] Preparing Email Transporter...");

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER, // 🛠️ .env से ईमेल रीड करेगा
                    pass: process.env.EMAIL_PASS  // 🛠️ .env से ऐप पासवर्ड रीड करेगा
                }
            });

            const mailOptions = {
                from: '"GlobalDeen Store" <mbeshop.official@gmail.com>',
                to: 'mbeshop.official@gmail.com',
                subject: `🚨 New Order Confirmed! - #${orderId}`,
                text: `Salam ,\n\nA new order has been successfully placed by ${customerFirstName} ${customerLastName}.\nTotal Amount: $${subtotal.toFixed(2)}\n\nPlease find the attached invoice PDF for details.`,
                attachments: [
                    {
                        filename: `Invoice_${orderId}.pdf`,
                        path: fullPdfPath
                    }
                ]
            };

            console.log(">>> [EMAIL STEP 2] Sending email with Invoice Attachment...");
            transporter.sendMail(mailOptions)
                .then(info => console.log(">>> [EMAIL SUCCESS] Invoice sent to admin email successfully:", info.messageId))
                .catch(mailErr => {
                    console.error(">>> [EMAIL ERROR] Failed to send email alert!");
                    console.error("- Mail Error Message:", mailErr.message);
                });
            // ========================================================

            console.log(">>> [DEBUG 13] Sending Success Response to Frontend.");
            return res.status(200).json({ success: true, invoiceUrl: order.invoicePath });
        }

        console.warn(">>> [WARN] Capture Status was NOT Completed.");
        res.status(400).json({ success: false, message: "Payment Failed" });

    } catch (err) {
        console.error(">>> [CRITICAL ERROR] Error during verification flow:");
        console.error("- Message:", err.message);
        if (err.response) console.error("- PayPal Error Data:", err.response.data);
        res.status(500).json({ success: false, error: err.message });
    }
});


// yesahi wal aahi
// app.post("/orders", async (req, res) => {
//     try {
//         const { items, customerFirstName } = req.body;
//         const orderId = `ORD_${Date.now()}`;

//         // 1. सही फोल्डर पाथ सुनिश्चित करें
//         const dirPath = path.join(__dirname, 'invoices');
//         if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

//         const fileName = `invoice_${orderId}.pdf`;
//         const filePath = path.join(dirPath, fileName);

//         // 2. HTML Content
//       let htmlContent = `
// <!DOCTYPE html>
// <html>
// <head>
//     <style>
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

//         body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; color: #1f2937; background: #fff; }
//         .page-container { width: 210mm; height: 297mm; display: flex; flex-direction: column; }

//         .invoice-card { 
//             height: 148.5mm; width: 100%; padding: 35px; box-sizing: border-box; 
//             position: relative; border-bottom: 1px dashed #e5e7eb;
//             background: linear-gradient(to bottom right, #ffffff, #f9fafb);
//         }

//         /* Top Header Section */
//         .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }

//         .shop-name { font-size: 30px; font-weight: 800; color: #3b318f; letter-spacing: -1px; }
//         .shop-name span { color: #d4af37; } /* Gold color for 'Deen' */

//         .status-badge {
//             background: #d1fae5; color: #065f46; padding: 6px 14px;
//             border-radius: 99px; font-size: 12px; font-weight: 700;
//             text-transform: uppercase; letter-spacing: 0.5px;
//         }

//         /* Billing Info Section */
//         .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
//         .info-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 5px; }
//         .info-value { font-size: 13px; line-height: 1.5; font-weight: 500; }

//         /* Table Styling */
//         table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//         th { 
//             background: #3b318f; color: white; text-align: left; 
//             padding: 12px 15px; font-size: 11px; font-weight: 600; 
//             text-transform: uppercase; border-radius: 4px 4px 0 0;
//         }
//         td { padding: 15px; border-bottom: 1px solid #f3f4f6; font-size: 12px; font-weight: 500; }
//         .item-name { font-weight: 600; color: #111827; }

//         /* Summary Section */
//         .footer-section { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 25px; }
//         .gst-note { font-size: 10px; color: #9ca3af; font-style: italic; max-width: 200px; }

//         .summary-box { width: 260px; background: #fff; border: 1px solid #f3f4f6; border-radius: 12px; padding: 15px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
//         .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: #4b5563; }
//         .free-text { color: #10b981; font-weight: 700; } /* Green for FREE */

//         .grand-total { 
//             display: flex; justify-content: space-between; 
//             margin-top: 12px; padding-top: 12px; border-top: 2px solid #f3f4f6;
//             font-size: 18px; font-weight: 800; color: #3b318f; 
//         }

//         /* Floating Label for Copy */
//         .copy-tag {
//             position: absolute; top: 35px; left: 50%; transform: translateX(-50%);
//             font-size: 9px; font-weight: 700; color: #cbd5e1;
//             padding: 4px 12px; border: 1px solid #f1f5f9; border-radius: 99px;
//             text-transform: uppercase;
//         }
//     </style>
// </head>
// <body>
//     <div class="page-container">
//         ${[1, 2].map((i) => `
//         <div class="invoice-card" style="${i === 2 ? 'border-bottom:none;' : ''}">
//             <div class="copy-tag">${i === 1 ? 'Customer' : 'Store'} Copy</div>

//             <div class="header">
//                 <div class="shop-name">Global<span>Deen</span></div>
//                 <div class="status-badge">Confirmed • Paid</div>
//             </div>

//             <div class="info-grid">
//                 <div>
//                     <div class="info-label">Bill To</div>
//                     <div class="info-value">
//                         <strong style="color:#111827; font-size:15px;">${customerFirstName} ${customerLastName}</strong><br>
//                         ${address}<br>${city}, ${pincode}<br>
//                         <span style="color:#6b7280;">${email}</span>
//                     </div>
//                 </div>
//                 <div style="text-align: right;">
//                     <div class="info-label">Invoice Details</div>
//                     <div class="info-value">
//                         <strong>#${orderId}</strong><br>
//                         Date: ${new Date().toLocaleDateString('en-GB')}<br>
//                         Method: PayPal Online
//                     </div>
//                 </div>
//             </div>

//             <table>
//                 <thead>
//                     <tr>
//                         <th style="border-radius: 8px 0 0 0;">Item Description</th>
//                         <th style="text-align: center;">Qty</th>
//                         <th>Unit Price</th>
//                         <th style="text-align: right; border-radius: 0 8px 0 0;">Total</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${items.map(item => `
//                     <tr>
//                         <td class="item-name">${item.bookName}</td>
//                         <td style="text-align: center;">${item.quantity}</td>
//                         <td>$${parseFloat(item.price).toFixed(2)}</td>
//                         <td style="text-align: right; font-weight: 700;">$${(item.quantity * item.price).toFixed(2)}</td>
//                     </tr>`).join('')}
//                 </tbody>
//             </table>

//             <div class="footer-section">
//                 <div class="gst-note">
//                     <p><strong>Note:</strong> Printed books are exempt from GST under HSN 4901. Thank you for your purchase!</p>
//                 </div>
//                 <div class="summary-box">
//                     <div class="summary-row">
//                         <span>Subtotal</span>
//                         <span>$${subtotal.toFixed(2)}</span>
//                     </div>
//                     <div class="summary-row">
//                         <span>Shipping</span>
//                         <span class="free-text">FREE</span>
//                     </div>
//                     <div class="grand-total">
//                         <span>Amount Paid</span>
//                         <span>$${subtotal.toFixed(2)}</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         `).join('')}
//     </div>
// </body>
// </html>`;

//         const pdfBuffer = await html_to_pdf.generatePdf({ content: htmlContent }, { format: 'A4' });

//         // 3. फाइल सेव करें
//         fs.writeFileSync(filePath, pdfBuffer);

//         // 4. DB में सेव करते समय सिर्फ पाथ का हिस्सा रखें
//         const newOrder = new OrderModel({
//             ...req.body,
//             orderId,
//             invoicePath: `/invoices/${fileName}`, // ब्राउज़र इसी पाथ से ढूंढेगा
//             status: "Confirmed"
//         });

//         await newOrder.save();

//         res.status(201).json({ success: true, orderId, invoiceUrl: `/invoices/${fileName}` });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });
// app.post("/orders", async (req, res) => {
//     try {
//         console.log("Creating new COD order...");
//         const { items, customerFirstName, customerLastName, address, city, pincode, email, shippingCharge = 0 } = req.body;

//         // 1. Unique Order ID
//         const orderId = `ORD_${Date.now()}`;
//         let subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
//         let finalGrandTotal = subtotal + shippingCharge;

//         // 2. Modern HTML Content (Same as PayPal Invoice)
//         let htmlContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <style>
//                 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
//                 body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; color: #1f2937; background: #fff; }
//                 .page-container { width: 210mm; height: 297mm; display: flex; flex-direction: column; }
//                 .invoice-card { 
//                     height: 148.5mm; width: 100%; padding: 35px; box-sizing: border-box; 
//                     position: relative; border-bottom: 1px dashed #e5e7eb;
//                     background: linear-gradient(to bottom right, #ffffff, #f9fafb);
//                 }
//                 .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
//                 .shop-name { font-size: 30px; font-weight: 800; color: #3b318f; letter-spacing: -1px; }
//                 .shop-name span { color: #d4af37; }
//                 .status-badge {
//                     background: #fef3c7; color: #92400e; padding: 6px 14px;
//                     border-radius: 99px; font-size: 11px; font-weight: 700;
//                     text-transform: uppercase;
//                 }
//                 .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
//                 .info-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 5px; }
//                 .info-value { font-size: 13px; line-height: 1.5; font-weight: 500; }
//                 table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//                 th { 
//                     background: #3b318f; color: white; text-align: left; 
//                     padding: 12px 15px; font-size: 11px; font-weight: 600; text-transform: uppercase;
//                 }
//                 td { padding: 15px; border-bottom: 1px solid #f3f4f6; font-size: 12px; font-weight: 500; }
//                 .footer-section { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 25px; }
//                 .summary-box { width: 260px; background: #fff; border: 1px solid #f3f4f6; border-radius: 12px; padding: 15px; }
//                 .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: #4b5563; }
//                 .grand-total { 
//                     display: flex; justify-content: space-between; 
//                     margin-top: 12px; padding-top: 12px; border-top: 2px solid #f3f4f6;
//                     font-size: 18px; font-weight: 800; color: #3b318f; 
//                 }
//                 .copy-tag {
//                     position: absolute; top: 35px; left: 50%; transform: translateX(-50%);
//                     font-size: 9px; font-weight: 700; color: #cbd5e1;
//                     padding: 4px 12px; border: 1px solid #f1f5f9; border-radius: 99px; text-transform: uppercase;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="page-container">
//                 ${[1, 2].map((i) => `
//                 <div class="invoice-card" style="${i === 2 ? 'border-bottom:none;' : ''}">
//                     <div class="copy-tag">${i === 1 ? 'Customer' : 'Store'} Copy</div>
//                     <div class="header">
//                         <div class="shop-name">Global<span>Deen</span></div>
//                         <div class="status-badge">COD • Confirmed</div>
//                     </div>
//                     <div class="info-grid">
//                         <div>
//                             <div class="info-label">Ship To</div>
//                             <div class="info-value">
//                                 <strong style="color:#111827; font-size:15px;">${customerFirstName} ${customerLastName}</strong><br>
//                                 ${address}<br>${city}, ${pincode}<br>${email}
//                             </div>
//                         </div>
//                         <div style="text-align: right;">
//                             <div class="info-label">Order Details</div>
//                             <div class="info-value">
//                                 <strong>#${orderId}</strong><br>
//                                 Date: ${new Date().toLocaleDateString('en-GB')}<br>
//                                 Payment: Cash on Delivery
//                             </div>
//                         </div>
//                     </div>
//                     <table>
//                         <thead><tr><th>Item</th><th style="text-align:center">Qty</th><th>Price</th><th style="text-align:right">Total</th></tr></thead>
//                         <tbody>
//                             ${items.map(item => `
//                             <tr>
//                                 <td style="font-weight:600;">${item.bookName || item.title}</td>
//                                 <td style="text-align:center">${item.quantity}</td>
//                                 <td>$${parseFloat(item.price).toFixed(2)}</td>
//                                 <td style="text-align:right; font-weight:700;">$${(item.quantity * item.price).toFixed(2)}</td>
//                             </tr>`).join('')}
//                         </tbody>
//                     </table>
//                     <div class="footer-section">
//                         <div style="font-size:10px; color:#9ca3af; max-width:200px;">*Printed books are exempt from GST under HSN 4901.</div>
//                         <div class="summary-box">
//                             <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
//                             <div class="summary-row"><span>Shipping</span><span style="color:#10b981; font-weight:700;">FREE</span></div>
//                             <div class="grand-total"><span>Total Amount</span><span>$${finalGrandTotal.toFixed(2)}</span></div>
//                         </div>
//                     </div>
//                 </div>`).join('')}
//             </div>
//         </body>
//         </html>`;

//         // 3. PDF जनरेट और फोल्डर चेक
//         const dirPath = path.join(__dirname, 'invoices');
//         if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

//         const fileName = `invoice_${orderId}.pdf`;
//         const filePath = path.join(dirPath, fileName);

//         const pdfBuffer = await html_to_pdf.generatePdf({ content: htmlContent }, { format: 'A4', printBackground: true });
//         fs.writeFileSync(filePath, pdfBuffer);

//         // 4. DB में सेव करें
//         const newOrder = new OrderModel({
//             ...req.body,
//             orderId,
//             invoicePath: `/invoices/${fileName}`,
//             status: "Confirmed"
//         });

//         await newOrder.save();
//         console.log("✅ COD Order Created & Modern Invoice Generated!");

//         res.status(201).json({ success: true, orderId, invoiceUrl: `/invoices/${fileName}` });

//     } catch (error) {
//         console.error("COD Order Error:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// });
app.post("/register", async (req, resp) => {
    let user = new Signup(req.body);
    let result = await user.save();
    resp.send(result);
});

app.post("/contactus", async (req, resp) => {
    let message = new Contactus(req.body)
    let result = await message.save();
    resp.send(result)
})

app.post("/login", async (req, resp) => {
    const { email, password } = req.body;
    let user = await Signup.findOne({ email, password }).select("-password");
    if (user) {
        jwt.sign({ user }, jwtKey, { expiresIn: "24h" }, (err, token) => {
            resp.send({ user, auth: token });
        });
    } else {
        resp.status(404).send({ msg: "No user found" });
    }
});

app.get("/api/orders/user/:identifier", async (req, res) => {
    try {
        console.log("\n========================================================");
        console.log(">>> [BACKEND] Dynamic Orders API Hit!");

        const { identifier } = req.params;
        console.log(`>>> [BACKEND] Received Identifier: "${identifier}"`);

        let query = {};

        // 🔍 चेक करें कि फ्रंटएंड ने Email भेजी है या ID
        if (identifier.includes("@")) {
            console.log(">>> [BACKEND] Identifier is an EMAIL. Querying by email...");
            query = { email: identifier };
        } else {
            console.log(">>> [BACKEND] Identifier is an ID. Querying by custom 'id' field...");
            query = { id: identifier };
        }

        // 🗄️ डेटाबेस से ऑर्डर्स निकालें
        const userOrders = await OrderModel.find(query).sort({ createdAt: -1 });
        console.log(`>>> [BACKEND] Successfully found ${userOrders.length} orders in DB.`);

        // सेफ़्टी के लिए रिस्पॉन्स हमेशा एरे (Array) में भेजें
        return res.status(200).json(userOrders);

    } catch (error) {
        console.error("\n>>> ❌ [BACKEND CRITICAL ERROR] Server crashed during dynamic fetch!");
        console.error("Message:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
});
// app.get('*',(req,res)=> {res.sendFile(path.join(__dirname,'dist','index.html'))});

app.listen(5000, () => console.log("Server running on port 5000"));