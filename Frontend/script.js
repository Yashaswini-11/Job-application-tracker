const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}
function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";
}

const form = document.getElementById("jobForm");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const company = document.getElementById("company").value;
    const role = document.getElementById("role").value;
    const status = document.getElementById("status").value;

    await fetch(
        "https://job-application-backend-syrb.onrender.com/jobs",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                company,
                role,
                status
            })
        }
    );

    alert("Job Added Successfully");

    form.reset();

    loadJobs();
});

async function loadJobs() {

    const response = await fetch(
        "https://job-application-backend-syrb.onrender.com/jobs",
        {
            headers: {
                Authorization: token
            }
        }
    );

    const jobs = await response.json();

    document.getElementById("totalCount").textContent =
        jobs.length;

    document.getElementById("appliedCount").textContent =
        jobs.filter(job => job.status === "Applied").length;

    document.getElementById("interviewCount").textContent =
        jobs.filter(
            job => job.status === "Interview Scheduled"
        ).length;

    document.getElementById("rejectedCount").textContent =
        jobs.filter(
            job => job.status === "Rejected"
        ).length;

    document.getElementById("offerCount").textContent =
        jobs.filter(
            job => job.status === "Offer Received"
        ).length;

    const searchText =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const selectedStatus =
        document.getElementById("filterStatus")
        .value;

    const filteredJobs = jobs.filter(job => {

        const matchesSearch =
            job.company
            .toLowerCase()
            .includes(searchText);

        const matchesStatus =
            selectedStatus === "All" ||
            job.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const applicationDiv =
        document.getElementById("applications");

    applicationDiv.innerHTML = "";

    filteredJobs.forEach(job => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
            <h3>${job.company}</h3>
            <p>${job.role}</p>

            <select onchange="updateStatus('${job._id}', this.value)">
                <option value="Applied" ${job.status === "Applied" ? "selected" : ""}>Applied</option>

                <option value="Interview Scheduled" ${job.status === "Interview Scheduled" ? "selected" : ""}>
                    Interview Scheduled
                </option>

                <option value="Rejected" ${job.status === "Rejected" ? "selected" : ""}>
                    Rejected
                </option>

                <option value="Offer Received" ${job.status === "Offer Received" ? "selected" : ""}>
                    Offer Received
                </option>
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

    const confirmDelete = confirm(
        "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) {
        return;
    }

    await fetch(
        `https://job-application-backend-syrb.onrender.com/jobs/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: token
            }
        }
    );

    loadJobs();
}

async function updateStatus(id, status) {

    const response = await fetch(
        "https://job-application-backend-syrb.onrender.com/jobs",
        {
            headers: {
                Authorization: token
            }
        }
    );

    const jobs = await response.json();

    const job = jobs.find(
        job => job._id === id
    );

    await fetch(
        `https://job-application-backend-syrb.onrender.com/jobs/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                company: job.company,
                role: job.role,
                status: status
            })
        }
    );

    loadJobs();
}

loadJobs();