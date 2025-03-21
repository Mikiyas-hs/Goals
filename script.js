document.addEventListener("DOMContentLoaded", loadGoals);

const goalInput = document.getElementById("goal-input");
const addGoalButton = document.getElementById("add-goal");
const goalList = document.getElementById("goal-list");

addGoalButton.addEventListener("click", addGoal);

function addGoal() {
    const goalText = goalInput.value.trim();
    if (goalText === "") return;

    const goalItem = createGoalElement(goalText, 0, "");
    goalList.appendChild(goalItem);

    saveGoal(goalText, 0, "");
    goalInput.value = "";
}

function createGoalElement(text, progress, notes) {
    const li = document.createElement("li");
    li.innerHTML = `
<span>${text}</span>
<button class="delete-btn">🗑</button>
<button class="toggle-progress-btn">Voortgang tonen</button>

<input type="range" min="0" max="100" value="${progress}" class="progress-slider hidden">
<div class="progress-container">
    <div class="progress-bar" style="width: ${progress}%"></div>
</div>
<p>${progress}% voltooid</p>

<button class="toggle-notes-btn">Toon aantekeningen</button>
<textarea class="notes note-hidden" placeholder="Schrijf hier aantekeningen...">${notes}</textarea>
`;

    const progressBar = li.querySelector(".progress-bar");
    const progressText = li.querySelector("p");
    const slider = li.querySelector(".progress-slider");
    const toggleProgressBtn = li.querySelector(".toggle-progress-btn");
    const toggleNotesBtn = li.querySelector(".toggle-notes-btn");
    const notesField = li.querySelector(".notes");

    // Toggle voortgang
    toggleProgressBtn.addEventListener("click", () => {
        slider.classList.toggle("hidden");
        toggleProgressBtn.textContent = slider.classList.contains("hidden") ? "Voortgang tonen" : "Verberg voortgang";
    });

    // Toggle aantekeningen
    toggleNotesBtn.addEventListener("click", () => {
        notesField.classList.toggle("note-hidden");
        toggleNotesBtn.textContent = notesField.classList.contains("note-hidden") ? "Toon aantekeningen" : "Verberg aantekeningen";
    });

    // Update progress
    slider.addEventListener("input", () => {
        const value = slider.value;
        progressBar.style.width = value + "%";
        progressText.textContent = `${value}% voltooid`;

        updateGoal(text, value, notesField.value);

        if (value == 100) {
            li.classList.add("completed");
        } else {
            li.classList.remove("completed");
        }
    });

    // Notities opslaan
    notesField.addEventListener("input", () => {
        updateGoal(text, slider.value, notesField.value);
    });

    // Verwijder doel
    li.querySelector(".delete-btn").addEventListener("click", () => {
        removeGoal(text);
        li.remove();
    });

    return li;
}


// Opslaan in localStorage
function saveGoal(goal, progress, notes) {
    let goals = JSON.parse(localStorage.getItem("goals")) || [];
    goals.push({ text: goal, progress: progress, notes: notes });
    localStorage.setItem("goals", JSON.stringify(goals));
}

// Laden van opgeslagen doelen
function loadGoals() {
    let goals = JSON.parse(localStorage.getItem("goals")) || [];
    goals.forEach(goal => {
        const goalItem = createGoalElement(goal.text, goal.progress, goal.notes);
        goalList.appendChild(goalItem);
    });
}

// Updaten van progress & notities in localStorage
function updateGoal(goalText, progress, notes) {
    let goals = JSON.parse(localStorage.getItem("goals")) || [];
    goals = goals.map(goal =>
        goal.text === goalText ? { ...goal, progress: progress, notes: notes } : goal
    );
    localStorage.setItem("goals", JSON.stringify(goals));
}

// Verwijderen van een doel
function removeGoal(goalText) {
    let goals = JSON.parse(localStorage.getItem("goals")) || [];
    goals = goals.filter(goal => goal.text !== goalText);
    localStorage.setItem("goals", JSON.stringify(goals));
}

