const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const jobs = [];

// GET all jobs
app.get("/jobs", (req, res) => {
    res.json(jobs);
});

// POST a new job
app.post("/jobs", (req, res) => {

    if (!req.body.company || !req.body.role) {
        return res.status(400).send("Company and role are required");
    }

    const job = {
        id: Date.now(),
        company: req.body.company,
        role: req.body.role
    };

    jobs.push(job);

    res.send("Job added");
});

// PUT (update a job)
app.put("/jobs/:id", (req, res) => {

    const id = Number(req.params.id);

    const job = jobs.find(job => job.id === id);

    if (!job) {
        return res.send("Job not found");
    }

    if (!req.body.company || !req.body.role) {
        return res.status(400).send("Company and role are required");
    }

    job.company = req.body.company;
    job.role = req.body.role;

    res.send("Job updated");
});

// DELETE a job
app.delete("/jobs/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = jobs.findIndex(job => job.id === id);

    if (index === -1) {
        return res.send("Job not found");
    }

    jobs.splice(index, 1);

    res.send("Job deleted");
});

app.listen(5000, () => {
    console.log("Server Started on Port 5000");
});