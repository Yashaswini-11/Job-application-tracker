require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

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
    status: String
});

// Model
const Job = mongoose.model("Job", jobSchema);

// GET all jobs
app.get("/jobs", async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// POST new job
app.post("/jobs", async (req, res) => {
    res.send("yashaswini test");
    try {

        console.log("BODY:", req.body);

        const job = await Job.create({
            company: req.body.company,
            role: req.body.role,
            status: req.body.status
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
app.put("/jobs/:id", async (req, res) => {
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
app.delete("/jobs/:id", async (req, res) => {
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