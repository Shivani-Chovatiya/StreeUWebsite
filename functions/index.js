const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { FieldValue } = require("firebase-admin/firestore");
const nodemailer = require("nodemailer");
const axios = require("axios");
const { onRequest } = require("firebase-functions/v2/https");
admin.initializeApp();

const KEY_ID = "rzp_test_SMiPD9Rp4gxxwK";
const KEY_SECRET = "TRrfLkSVvqCOyR5471LUATDJ";

const razorpay = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET,
});
const cors = require("cors")({ origin: true });
// CREATE ORDER
exports.createOrder = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const {
        amount,
        userId,
        currency,
        credits,
        paidSessionBooking,
        paidAssessments,
        therapistId,
        inrprice,
        usdprice,
      } = req.body;
      console.log(
        "CreateOrder Request:",
        req.body,
        amount,
        userId,
        currency,
        credits,
        inrprice,
        usdprice,
      );
      if (!amount || !userId) {
        return res.status(400).send("amount and userId required");
      }

      console.log("Creating order for:", amount, userId);

      const order = await razorpay.orders.create({
        amount: amount * 100,
        currency: currency || "INR",
        receipt: `receipt_${Date.now()}`,
      });

      console.log("Order created:", order.id);

      await admin
        .firestore()
        .collection("payments")
        .doc(order.id)
        .set({
          userId,
          amount,
          status: "created",
          currency,
          credits: credits || "Not Applicable",
          paidSessionBooking: paidSessionBooking || "Not Applicable",
          paidAssessments: paidAssessments || "Not Applicable",
          therapistId: therapistId || "Not Applicable",
          inrprice: inrprice || "Not Applicable",
          usdprice: usdprice || "Not Applicable",
          createdAt: FieldValue.serverTimestamp(),
          // createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      console.log("Saved to Firestore");

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: KEY_ID,
      });
    } catch (error) {
      console.error("CreateOrder Error:", error);
      res.status(500).send(error);
    }
  });
});

// WEBHOOK
exports.razorpayWebhook = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const secret = "5EjqgGtU!47Lvx3";

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    const signature = req.headers["x-razorpay-signature"];

    if (digest === signature) {
      const event = req.body;

      if (event.event === "payment.captured") {
        const payment = event.payload.payment.entity;

        await admin
          .firestore()
          .collection("payments")
          .doc(payment.order_id)
          .update({
            status: "success",
            paymentId: payment.id,
            updatedAt: FieldValue.serverTimestamp(),
          });
      }

      res.status(200).json({
        status: "ok",
      });
    } else {
      res.status(400).send("Invalid signature");
    }
  });
});

// REFUND PAYMENT
exports.refundPayment = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { orderId, amount } = req.body;

      if (!orderId) {
        return res.status(400).send("orderId required");
      }

      console.log("Refund Request for order:", orderId);

      // 1️⃣ Get payment record from Firestore
      const paymentRef = admin.firestore().collection("payments").doc(orderId);
      const paymentSnap = await paymentRef.get();

      if (!paymentSnap.exists) {
        return res.status(404).send("Payment not found");
      }

      const paymentData = paymentSnap.data();

      // 2️⃣ Check payment status
      if (paymentData.status !== "success") {
        return res.status(400).send("Payment not eligible for refund");
      }

      const paymentId = paymentData.paymentId;

      // 3️⃣ Call Razorpay refund API
      const refund = await razorpay.payments.refund(paymentId, {
        amount: amount ? amount * 100 : undefined, // optional partial refund
      });

      console.log("Refund Success:", refund);

      // 4️⃣ Update Firestore
      await paymentRef.update({
        status: "cancelled",
        refundId: refund.id,
        refundedAt: FieldValue.serverTimestamp(),
      });

      res.json({
        success: true,
        refund,
      });
    } catch (error) {
      console.error("Refund Error:", error);
      res.status(500).send(error.message);
    }
  });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "steeryourhappiness.dev@gmail.com",
    pass: "ndhcqfmbrgrpswvy",
    // user: "chovatiyashivani@gmail.com",
    // pass: "opmdvgztnvumdrmk", // App Password
  },
});

exports.sendmail = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      console.log("Request body:", req.body);
      const { to, subject, html } = req.body;

      await transporter.sendMail({
        from: `"Support" <chovatiyashivani@gmail.com>`,
        to,
        subject,
        html,
      });

      res.status(200).json({
        success: true,
        message: "Email sent successfully",
      });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });
});
// opmd vgzt nvum drmk
exports.analyzeAstro2 = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const ASTRO_API_URL = "http://187.77.185.120/analyze_astro";
      const API_KEY = "steer_u_api_key_1";

      const response = await axios.post(ASTRO_API_URL, req.body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error("Astro API Error:", error);

      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });
});

exports.analyzeAstro = onRequest(
  {
    timeoutSeconds: 540,
    memory: "1GiB",
    cors: true,
  },
  async (req, res) => {
    try {
      const response = await axios.post(
        "http://187.77.185.120/analyze_astro",
        req.body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer steer_u_api_key_1`,
          },
        },
      );

      res.status(200).json(response.data);
    } catch (error) {
      console.error("Astro API Error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);
