function saveSettings() {
  const region = document.getElementById("region").value;
  const disease = document.getElementById("disease").value;
  const threshold = document.getElementById("threshold").value;

  if (!region || !threshold) {
    alert("Please fill all required fields");
    return;
  }

  const settings = {
    region,
    disease,
    threshold
  };

  localStorage.setItem("alertSettings", JSON.stringify(settings));

  alert("✅ Settings Saved!");
}
function goToProfile() {
  window.location.href = "profile.html";
}

function goHome() {
    window.location.href = "index.html";
}