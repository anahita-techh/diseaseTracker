const data = [];

// 🔥 Cholera (400 cases)!!
for (let i = 0; i < 400; i++) {
  const regions = ["Mumbai", "Delhi", "Pune"];
  const randomRegion = regions[Math.floor(Math.random() * regions.length)];

  data.push({
    disease: "Cholera",
    region: randomRegion
  });
}


for (let i = 0; i < 500; i++) {
  const regions = ["Mumbai", "Delhi", "Pune"];
  const randomRegion = regions[Math.floor(Math.random() * regions.length)];

  data.push({
    disease: "Dengue",
    region: randomRegion
  });
}


for (let i = 0; i < 295; i++) {
  const regions = ["Mumbai", "Delhi", "Pune"];
  const randomRegion = regions[Math.floor(Math.random() * regions.length)];

  data.push({
    disease: "Typhoid",
    region: randomRegion
  });
}

// 🎨 Colors
const colors = {
  Cholera: "#ff6b6b",
  Dengue: "#4dabf7",
  Typhoid: "#ffd43b"
};

let chart;
let trendChart;

// 🚀 LOAD EVERYTHING
window.onload = function () {
  updateChart();
  loadTrendChart();
  updateTopRegion();
  loadUserPreferences();
  updateProfileUI();
};

// 📊 UPDATE PIE / DOUGHNUT CHART
function updateChart() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "block";

  setTimeout(() => {
    const region = document.getElementById("region").value;
    const disease = document.getElementById("disease").value;

    let filtered = data;

    if (region) {
      filtered = filtered.filter(d => d.region === region);
    }

    // Total cases
    const totalCasesEl = document.getElementById("totalCases");
    if (totalCasesEl) totalCasesEl.innerText = filtered.length;

    const counts = {
      Cholera: filtered.filter(d => d.disease === "Cholera").length,
      Dengue: filtered.filter(d => d.disease === "Dengue").length,
      Typhoid: filtered.filter(d => d.disease === "Typhoid").length
    };

    const ctx = document.getElementById("myChart").getContext("2d");

    if (chart) chart.destroy();

    // 👉 ALL diseases (DOUGHNUT)
    if (disease === "All") {
      chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: Object.keys(counts),
          datasets: [{
            data: Object.values(counts),
            backgroundColor: Object.values(colors),
            borderWidth: 0
          }]
        },
        options: {
          cutout: "60%",
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "white"
              }
            }
          }
        }
      });
    } 
    // 👉 SINGLE disease
    else {
      chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: [disease],
          datasets: [{
            data: [counts[disease]],
            backgroundColor: [colors[disease]],
            borderWidth: 0
          }]
        },
        options: {
          cutout: "60%",
          plugins: {
            legend: {
              labels: {
                color: "white"
              }
            }
          }
        }
      });
    }

    if (loader) loader.style.display = "none";
    loadTrendChart();
  }, 300);
}


// 📈 TREND GRAPH
function loadTrendChart() {
  const region = document.getElementById("region").value;
  const disease = document.getElementById("disease").value;

  let filtered = data;

  if (region) {
    filtered = filtered.filter(d => d.region === region);
  }

  if (disease && disease !== "All") {
    filtered = filtered.filter(d => d.disease === disease);
  }

  const total = filtered.length;

  // 🔥 Dynamic trend based on filtered data
  const trendData = [];

  for (let i = 0; i < 7; i++) {
    const base = Math.floor(total / 7);
    const variation = Math.floor(Math.random() * (base / 2));
    trendData.push(base + variation);
  }

  const ctx = document.getElementById("trendChart").getContext("2d");

  if (trendChart) trendChart.destroy();

  trendChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{
        label: "Cases",
        data: trendData,
        borderColor: "#667eea",
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(102,126,234,0.2)"
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { ticks: { color: "white" } },
        y: { ticks: { color: "white" } }
      }
    }
  });
}

// 🔥 TOP REGION
function updateTopRegion() {
  const regionCounts = {};

  data.forEach(d => {
    regionCounts[d.region] = (regionCounts[d.region] || 0) + 1;
  });

  let maxRegion = "";
  let maxCount = 0;

  for (let region in regionCounts) {
    if (regionCounts[region] > maxCount) {
      maxCount = regionCounts[region];
      maxRegion = region;
    }
  }

  const el = document.getElementById("topRegion");
  if (el) el.innerText = maxRegion;
}

// 🔔 NOTIFICATION
function showNotification(msg, type) {
  const notif = document.getElementById("notification");

  notif.innerText = msg;
  notif.style.display = "block";

  // 🎨 Dynamic colors
  if (msg.includes("High")) {
    notif.style.background = "rgba(255,0,0,0.9)";
  } else if (msg.includes("Medium")) {
    notif.style.background = "rgba(255,165,0,0.9)";
  } else if (msg.includes("Low")) {
    notif.style.background = "rgba(255,215,0,0.9)";
  } else {
    notif.style.background =
      type === "success"
        ? "rgba(56,176,0,0.9)"
        : "rgba(255,75,75,0.9)";
  }

  notif.classList.add("show");

  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => (notif.style.display = "none"), 300);
  }, 3000);
}

// 🚨 ALERT
function checkAlert() {
  const saved = JSON.parse(localStorage.getItem("alertSettings"));

  if (!saved) {
    showNotification("No settings found!", "error");
    return;
  }

  const { region, disease, threshold } = saved;

  let filtered = data.filter(d => d.region === region);

  if (disease && disease !== "All") {
    filtered = filtered.filter(d => d.disease === disease);
  }

  const count = filtered.length;

  if (count >= threshold) {
    const increase = count - threshold;
    const percent = Math.round((increase / threshold) * 100);

    // 🔴 Severity logic
    let severity = "";
    let type = "error";

    if (increase <= 5) severity = "Low";
    else if (increase <= 10) severity = "Medium";
    else severity = "High";

    const message =
      disease === "All"
        ? `⚠️ ${region}: +${increase} cases (${percent}%) | ${severity}`
        : `⚠️ ${disease} in ${region}: +${increase} (${percent}%) | ${severity}`;

    showNotification(message, type);
    playAlertSound(); // 🔔 sound

  } else {
    showNotification(`✅ Cases under control in ${region}`, "success");
  }
}
   

// 🔗 NAVIGATION
function goToForm() {
  window.location.href = "form.html";
}

function goHome() {
  window.location.href = "index.html";
}

// 🔄 TOGGLE
function showPie() {
  document.getElementById("pieContainer").style.display = "block";
  document.getElementById("trendContainer").style.display = "none";

  document.getElementById("pieBtn").classList.add("active");
  document.getElementById("trendBtn").classList.remove("active");
}

function showTrend() {
  document.getElementById("pieContainer").style.display = "none";
  document.getElementById("trendContainer").style.display = "block";

  document.getElementById("trendBtn").classList.add("active");
  document.getElementById("pieBtn").classList.remove("active");

  // 🔥 IMPORTANT FIX → redraw chart when shown
  setTimeout(() => {
    loadTrendChart();
  }, 50);
}

function playAlertSound() {
  const audio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
  audio.play();
}

function loadUserPreferences() {
  const saved = JSON.parse(localStorage.getItem("alertSettings"));

  if (!saved) return;

  document.getElementById("region").value = saved.region;
  document.getElementById("disease").value = saved.disease;

  updateChart(); // auto apply filters
}
function updateProfileUI() {
  const saved = JSON.parse(localStorage.getItem("alertSettings"));

  const el = document.getElementById("profileInfo");

  if (!saved) {
    el.innerText = "No preferences set";
    return;
  }

  el.innerText = `${saved.region} | ${saved.disease} | Threshold: ${saved.threshold}`;
}
function goToProfile() {
  window.location.href = "profile.html";
}