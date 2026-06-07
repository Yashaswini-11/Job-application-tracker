const form = document.getElementById("jobForm");

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const company = document.getElementById("company").value;
    const role = document.getElementById("role").value;
    const status = document.getElementById("status").value;

    const response = await fetch("http://localhost:5000/jobs", {
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

    alert(await response.text());

    form.reset();

    loadJobs();

});

async function loadJobs() {

    const response = await fetch("http://localhost:5000/jobs");

    const jobs = await response.json();

    const applicationDiv =
        document.getElementById("applications");

    applicationDiv.innerHTML = "";

    for (let i = 0; i < jobs.length; i++) {

        const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
            <h3>${jobs[i].company}</h3>
            <p>${jobs[i].role}</p>

            <select onchange="updateStatus(${jobs[i].id}, this.value)">
                <option value="Applied" ${jobs[i].status === "Applied" ? "selected" : ""}>Applied</option>
                <option value="Interview Scheduled" ${jobs[i].status === "Interview Scheduled" ? "selected" : ""}>Interview Scheduled</option>
                <option value="Rejected" ${jobs[i].status === "Rejected" ? "selected" : ""}>Rejected</option>
                <option value="Offer Received" ${jobs[i].status === "Offer Received" ? "selected" : ""}>Offer Received</option>
            </select>

            <br><br>

            <button onclick="deleteJob(${jobs[i].id})">
                Delete
            </button>
        `;

        applicationDiv.appendChild(card);
    }
}

async function deleteJob(id) {

    await fetch(`http://localhost:5000/jobs/${id}`, {
        method: "DELETE"
    });

    loadJobs();
}

async function updateStatus(id, status) {

    const response = await fetch("http://localhost:5000/jobs");

    const jobs = await response.json();

    const job = jobs.find(job => job.id === id);

    await fetch(`http://localhost:5000/jobs/${id}`, {
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