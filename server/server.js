require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const roadIssueRoutes = require("./routes/roadIssueRoutes");
const roadHistoryRoutes = require("./routes/roadHistoryRoutes");
const routeRoutes = require("./routes/routeRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "RoadGuard API is running.", mockMode: !!global.USE_MOCK_DB });
});

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/road-issues", roadIssueRoutes);
app.use("/api/roads", roadHistoryRoutes);
app.use("/api/routes", routeRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚦 RoadGuard API listening on port ${PORT}`);
    });
});
