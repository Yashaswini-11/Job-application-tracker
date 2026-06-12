
const auth = require("./middleware/auth");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("Mongo Error:", err));

// Schema
const jobSchema = new mongoose.Schema({
    company: String,
    role: String,
    status: String,
    userId: String
});

// Model
const Job = mongoose.model("Job", jobSchema);
app.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.json({
            message: "User Registered Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
app.post("/login", async (req, res) => {

    console.log("LOGIN HIT");
    console.log(req.body);

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Email"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            token
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
});
// GET all jobs
app.get("/jobs", auth, async (req, res) => {
    try {
        const jobs = await Job.find(
            {userId:req.user.userId}
        );
        res.json(jobs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// POST new job
app.post("/jobs", auth, async (req, res) => {

    try {

        console.log("BODY:", req.body);

        const job = await Job.create({
            company: req.body.company,
            role: req.body.role,
            status: req.body.status,
            userId:req.user.userId
        });

        console.log("SAVED JOB:", job);

        res.json(job);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});

// PUT update job
app.put("/jobs/:id",auth, async (req, res) => {
    try {

        console.log("ID:", req.params.id);
        console.log("BODY:", req.body);

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            {
                company: req.body.company,
                role: req.body.role,
                status: req.body.status
            },
            { new: true }
        );

        console.log("UPDATED JOB:", updatedJob);

        if (!updatedJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json(updatedJob);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});

// DELETE job
app.delete("/jobs/:id",auth, async (req, res) => {
    try {

        await Job.findByIdAndDelete(req.params.id);

        res.json({
            message: "Job deleted"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});

// Start Server
app.listen(5000, () => {
    console.log("Server Started on Port 5000");
});