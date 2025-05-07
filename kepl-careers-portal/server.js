// server.js - Express server setup
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://labhbother12:13801234@cluster0.nzkdyfk.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, // 1 hour
  })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));
app.use(cors());

// Make req available in all templates
app.use((req, res, next) => {
  res.locals.req = req;
  next();
});

// MongoDB Models
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  jobType: { type: String, required: true, default: "Full-time" },
  description: { type: String, required: true },
  tags: [String],
  salary: { type: String, default: "Competitive Salary" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  logoUrl: { type: String },
  displayType: {
    type: String,
    required: true,
    enum: ["info-card", "image-card"],
    default: "info-card",
  },
  position: { type: Number, default: 999 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Job = mongoose.model("Job", jobSchema);
const Brand = mongoose.model("Brand", brandSchema);
const User = mongoose.model("User", userSchema);

// Initialize admin user if none exists
async function createDefaultAdmin() {
  try {
    const adminExists = await User.findOne({ username: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        username: "admin",
        password: hashedPassword,
      });
      console.log("Default admin user created");
    }
  } catch (err) {
    console.error("Error creating default admin:", err);
  }
}
createDefaultAdmin();

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect("/admin/login");
}

// ====================
// PUBLIC API ROUTES
// ====================

app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/brands", async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ position: 1 });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================
// AUTHENTICATION ROUTES
// ====================

app.get("/admin/login", (req, res) => {
  res.render("login");
});

app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.render("login", { error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.render("login", { error: "Invalid credentials" });
    }

    req.session.isAuthenticated = true;
    res.redirect("/admin/dashboard");
  } catch (err) {
    res.render("login", { error: err.message });
  }
});

app.get("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

// ====================
// DASHBOARD ROUTES
// ====================
app.get("/admin/dashboard", isAuthenticated, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    const brands = await Brand.find().sort({ position: 1 });
    const activeTab = req.query.tab || 'dashboard';
    
    // Get stats
    const totalJobs = await Job.countDocuments();
    const totalBrands = await Brand.countDocuments();
    const activeJobs = await Job.countDocuments({ isActive: true });
    const inactiveBrands = await Brand.countDocuments({ isActive: false });
    
    // Get recent items (last 5)
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(5);
    const recentBrands = await Brand.find().sort({ createdAt: -1 }).limit(5);

    res.render("dashboard", {
      jobs,
      brands,
      activeTab,
      req: req,
      stats: {
        totalJobs,
        totalBrands,
        activeJobs,
        inactiveBrands
      },
      recentJobs,
      recentBrands
    });
  } catch (err) {
    res.render("dashboard", {
      jobs: [],
      brands: [],
      error: err.message,
      req: req,
      stats: {
        totalJobs: 0,
        totalBrands: 0,
        activeJobs: 0,
        inactiveBrands: 0
      },
      recentJobs: [],
      recentBrands: []
    });
  }
});
// ====================
// JOB MANAGEMENT ROUTES
// ====================

app.get("/admin/job/add", isAuthenticated, (req, res) => {
  res.render("job-form", { 
    job: null, 
    action: "add",
    req: req
  });
});

app.post("/admin/job/add", isAuthenticated, async (req, res) => {
  try {
    const { title, department, jobType, description, tags, salary } = req.body;
    const tagsArray = tags.split(",").map((tag) => tag.trim());

    const newJob = new Job({
      title,
      department,
      jobType,
      description,
      tags: tagsArray,
      salary,
    });

    await newJob.save();
    res.redirect("/admin/dashboard");
  } catch (err) {
    res.render("job-form", {
      job: req.body,
      action: "add",
      error: err.message,
    });
  }
});

app.get("/admin/job/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    res.render("job-form", { 
      job, 
      action: "edit",
      req: req
    });
  } catch (err) {
    res.redirect("/admin/dashboard");
  }
});

app.post("/admin/job/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const { title, department, jobType, description, tags, salary, isActive } = req.body;
    const tagsArray = tags.split(",").map((tag) => tag.trim());

    await Job.findByIdAndUpdate(req.params.id, {
      title,
      department,
      jobType,
      description,
      tags: tagsArray,
      salary,
      isActive: isActive === "on",
    });

    res.redirect("/admin/dashboard");
  } catch (err) {
    const job = await Job.findById(req.params.id);
    res.render("job-form", {
      job,
      action: "edit",
      error: err.message,
    });
  }
});

app.post("/admin/job/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("Delete job error:", err);
    res.redirect("/admin/dashboard");
  }
});

// ====================
// BRAND MANAGEMENT ROUTES
// ====================

app.get("/admin/brand/add", isAuthenticated, (req, res) => {
  res.render("brand-form", { 
    brand: null, 
    action: "add",
    req: req
  });
});

app.post("/admin/brand/add", isAuthenticated, async (req, res) => {
  try {
    const { name, description, category, imageUrl, logoUrl, displayType, position } = req.body;

    const newBrand = new Brand({
      name,
      description,
      category,
      imageUrl,
      logoUrl,
      displayType,
      position: position || 999,
    });

    await newBrand.save();
    res.redirect("/admin/dashboard?tab=brands");
  } catch (err) {
    res.render("brand-form", {
      brand: req.body,
      action: "add",
      error: err.message,
    });
  }
});

app.get("/admin/brand/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    res.render("brand-form", { 
      brand, 
      action: "edit",
      req: req
    });
  } catch (err) {
    res.redirect("/admin/dashboard?tab=brands");
  }
});

app.post("/admin/brand/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const { name, description, category, imageUrl, logoUrl, displayType, position, isActive } = req.body;

    await Brand.findByIdAndUpdate(req.params.id, {
      name,
      description,
      category,
      imageUrl,
      logoUrl,
      displayType,
      position: position || 999,
      isActive: isActive === "on",
    });

    res.redirect("/admin/dashboard?tab=brands");
  } catch (err) {
    const brand = await Brand.findById(req.params.id);
    res.render("brand-form", {
      brand,
      action: "edit",
      error: err.message,
    });
  }
});

app.post("/admin/brand/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard?tab=brands");
  } catch (err) {
    console.error("Delete brand error:", err);
    res.redirect("/admin/dashboard?tab=brands");
  }
});


app.get("*", (req, res) => {
  res.status(404).send("404 - Page not found");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});