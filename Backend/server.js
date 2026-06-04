const express = require("express");

const app = express();
app.use(express.json());
const jobs = [];

app.post("/jobs",(req,res)=>{
 const job={
    id:Date.now(),
    company:req.body.company,
    role:req.body.role
 };
 console.log("full stack developer");
 jobs.push(job);
 res.send("job added");
});
app.get("/jobs",(req,res)=>{
    res.json(jobs);
});
app.delete("/jobs/:id",(req,res)=>{
    const id=Number(req.params.id);
    const index=jobs.findIndex(job=>job.id===id);
    if(index=== -1){
        return res.send("job not found");
    }
    jobs.splice(index, 1);
    res.send("job deleted");
});
app.put("/jobs/:id", (req, res) => {

    const id = Number(req.params.id);

    const job = jobs.find(job => job.id === id);

    if (!job) {
        return res.send("Job not found");
    }

    job.company = req.body.company;
    job.role = req.body.role;

    res.send("Job updated");

});
app.listen(5000, () => {
  console.log("Server Started");
});