// Load profile data
window.onload = function () {
  const saved = JSON.parse(localStorage.getItem("alertSettings"));

  if (!saved) return;

  document.getElementById("pRegion").innerText = saved.region;
  document.getElementById("pDisease").innerText = saved.disease;
  document.getElementById("pThreshold").innerText = saved.threshold;
};

// Navigation functions (🔥 REQUIRED)
function goHome() {
  window.location.href = "index.html";
}

function goToForm() {
  window.location.href = "form.html";
}

function goToProfile() {
  window.location.href = "profile.html";
}