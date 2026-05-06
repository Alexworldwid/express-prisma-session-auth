document.querySelector(".file-input").addEventListener("change", function () {
  const fileName = this.files[0]?.name || "Choose a file";
  document.querySelector(".file-text").textContent = fileName;
});

function disableButton() {
  const btn = document.getElementById("uploadBtn");
  btn.disabled = true;
  btn.innerText = "Uploading...";
}