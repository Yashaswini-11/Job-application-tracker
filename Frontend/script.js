const form = document.getElementById("jobForm");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const company = document.getElementById("company").value;
    const role = document.getElementById("role").value;
    const status = document.getElementById("status").value;

    const response = await fetch("https://job-application-backend-syrb.onrender.com/jobs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            company,
            role,
            status
        })
    });

    const data = await response.json();

    console.log(data);

    alert("Job Added Successfully");

    form.reset();

    loadJobs();
});

async function loadJobs() {

    const response = await fetch("https://job-application-backend-syrb.onrender.com/jobs");

    const jobs = await response.json();

    const applicationDiv = document.getElementById("applications");

    applicationDiv.innerHTML = "";

    jobs.forEach(job => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
            <h3>${job.company}</h3>
            <p>${job.role}</p>

            <select onchange="updateStatus('${job._id}', this.value)">
                <option value="Applied" ${job.status === "Applied" ? "selected" : ""}>Applied</option>
                <option value="Interview Scheduled" ${job.status === "Interview Scheduled" ? "selected" : ""}>Interview Scheduled</option>
                <option value="Rejected" ${job.status === "Rejected" ? "selected" : ""}>Rejected</option>
                <option value="Offer Received" ${job.status === "Offer Received" ? "selected" : ""}>Offer Received</option>
            </select>

            <br><br>

            <button onclick="deleteJob('${job._id}')">
                Delete
            </button>
        `;

        applicationDiv.appendChild(card);
    });
}

async function deleteJob(id) {

    await fetch(`https://job-application-backend-syrb.onrender.com/jobs/${id}`, {
        method: "DELETE"
    });

    loadJobs();
}

async function updateStatus(id, status) {

    const response = await fetch("https://job-application-backend-syrb.onrender.com/jobs");

    const jobs = await response.json();

    const job = jobs.find(job => job._id === id);

    await fetch(`https://job-application-backend-syrb.onrender.com/jobs/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            company: job.company,
            role: job.role,
            status: status
        })
    });

    loadJobs();
}

loadJobs();