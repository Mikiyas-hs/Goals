document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname;
  
    if (currentPage.includes("index.html") || currentPage.endsWith("/")) {
      // === Categorie-pagina ===
      const categoryInput = document.getElementById("category-input");
      const addCategoryBtn = document.getElementById("add-category");
      const categoryList = document.getElementById("category-list");
  
      let categories = JSON.parse(localStorage.getItem("categories")) || [];
  
      function saveCategories() {
        localStorage.setItem("categories", JSON.stringify(categories));
      }
  
      function renderCategories() {
        categoryList.innerHTML = "";
        categories.forEach(cat => {
          const row = document.createElement("div");
          row.classList.add("category-row");
  
          const btn = document.createElement("button");
          btn.classList.add("green-btn");
          btn.textContent = cat;
          btn.addEventListener("click", () => {
            window.location.href = `category.html?categorie=${encodeURIComponent(cat)}`;
          });
  
          const deleteBtn = document.createElement("button");
          deleteBtn.classList.add("delete-btn");
          deleteBtn.textContent = "🗑";
          deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // voorkomt dat categorie geopend wordt
            categories = categories.filter(c => c !== cat);
  
            let allGoals = JSON.parse(localStorage.getItem("goals")) || {};
            delete allGoals[cat];
            localStorage.setItem("goals", JSON.stringify(allGoals));
  
            saveCategories();
            renderCategories();
          });
  
          row.appendChild(btn);
          row.appendChild(deleteBtn);
          categoryList.appendChild(row);
        });
      }
  
      addCategoryBtn.addEventListener("click", () => {
        const newCat = categoryInput.value.trim();
        if (!newCat || categories.includes(newCat)) return;
        categories.push(newCat);
        saveCategories();
        renderCategories();
        categoryInput.value = "";
      });
  
      renderCategories();
  
    } else if (currentPage.includes("category.html")) {
      // === Doelen-pagina ===
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get("categorie");
      const categoryTitle = document.getElementById("category-title");
      const goalInput = document.getElementById("goal-input");
      const addGoalBtn = document.getElementById("add-goal");
      const goalList = document.getElementById("goal-list");
  
      if (!category) {
        location.href = "index.html";
        return;
      }
  
      categoryTitle.textContent = `Doelen voor "${category}"`;
  
      let storedGoals = JSON.parse(localStorage.getItem("goals")) || {};
      if (!storedGoals[category]) storedGoals[category] = [];
  
      function saveGoals() {
        localStorage.setItem("goals", JSON.stringify(storedGoals));
      }
  
      function renderGoals() {
        goalList.innerHTML = "";
        storedGoals[category].forEach(goal => {
          const li = document.createElement("li");
          li.innerHTML = `
            <button class="delete-btn">🗑</button>
            <strong>${goal.text}</strong>
  
            <button class="toggle-progress-btn">Pas voortgang aan</button>
  
            <div class="progress-slider-wrapper hidden">
              <input type="range" min="0" max="100" value="${goal.progress}" class="progress-slider" />
            </div>
  
            <div class="progress-container">
              <div class="progress-bar" style="width: ${goal.progress}%"></div>
            </div>
            <p>${goal.progress}% voltooid</p>
  
            <button class="toggle-notes-btn">Toon aantekeningen</button>
            <textarea class="notes hidden" placeholder="Schrijf hier je aantekeningen...">${goal.notes}</textarea>
          `;
  
          const slider = li.querySelector(".progress-slider");
          const progressBar = li.querySelector(".progress-bar");
          const progressText = li.querySelector("p");
          const deleteBtn = li.querySelector(".delete-btn");
          const notesField = li.querySelector(".notes");
          const toggleNotesBtn = li.querySelector(".toggle-notes-btn");
          const toggleProgressBtn = li.querySelector(".toggle-progress-btn");
          const progressSliderWrapper = li.querySelector(".progress-slider-wrapper");
  
          // === Voortgang aanpassen ===
          slider.addEventListener("input", () => {
            goal.progress = slider.value;
            progressBar.style.width = `${goal.progress}%`;
            progressText.textContent = `${goal.progress}% voltooid`;
            saveGoals();
  
            if (parseInt(goal.progress) === 100) {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
              });
            }
          });
  
          toggleProgressBtn.addEventListener("click", () => {
            progressSliderWrapper.classList.toggle("hidden");
            toggleProgressBtn.textContent = progressSliderWrapper.classList.contains("hidden")
              ? "Pas voortgang aan"
              : "Klaar";
          });
  
          // === Aantekeningen ===
          notesField.addEventListener("input", () => {
            goal.notes = notesField.value;
            saveGoals();
          });
  
          toggleNotesBtn.addEventListener("click", () => {
            notesField.classList.toggle("hidden");
            toggleNotesBtn.textContent = notesField.classList.contains("hidden")
              ? "Toon aantekeningen"
              : "Verberg aantekeningen";
          });
  
          // === Verwijderen doel ===
          deleteBtn.addEventListener("click", () => {
            storedGoals[category] = storedGoals[category].filter(g => g !== goal);
            saveGoals();
            renderGoals();
          });
  
          goalList.appendChild(li);
        });
      }
  
      addGoalBtn.addEventListener("click", () => {
        const text = goalInput.value.trim();
        if (!text) return;
        const newGoal = { text, progress: 0, notes: "" };
        storedGoals[category].push(newGoal);
        saveGoals();
        renderGoals();
        goalInput.value = "";
      });
  
      renderGoals();
    }
  });
  