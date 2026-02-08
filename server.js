const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ FIX HERE
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/vendor", require("./routes/vendorRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/vendor", require("./routes/vendorOrderRoutes"));
app.use("/api/admin", require("./routes/adminOrderRoutes"));
app.use("/api/admin", require("./routes/adminStatsRoutes"));
app.use("/api/vendor", require("./routes/vendorStatsRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/vendor", require("./routes/vendorRevenueRoutes"));
app.use("/api/vendor/payout", require("./routes/payoutRoutes"));
app.use("/api/admin", require("./routes/adminPayoutRoutes"));
app.use("/api/vendor/payout", require("./routes/vendorPayoutHistoryRoutes"));
app.use("/api/admin", require("./routes/adminSettlementRoutes"));
app.use("/api/webhooks", require("./routes/webhookRoutes"));
app.use("/api/webhooks/razorpay", express.raw({ type: "application/json" }));

app.use(express.json());

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
