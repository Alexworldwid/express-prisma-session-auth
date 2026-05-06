const overlay = document.getElementById("modalOverlay");
const modal = document.getElementById("editModal");

// ONE global click listener
document.addEventListener("click", (e) => {
  const menuToggle = e.target.closest(".menu-toggle");
  const editBtn = e.target.closest(".edit-btn");
  const deleteBtn = e.target.closest(".delete-btn");
  const cancelBtn = e.target.closest("#cancelEdit");

  // -------------------------
  // TOGGLE DROPDOWN
  // -------------------------
  if (menuToggle) {
    e.stopPropagation();

    // close all dropdowns first
    document.querySelectorAll(".dropdown").forEach(d => {
      d.classList.add("hidden");
      d.classList.remove("unhide");
    });

    const li = menuToggle.closest("li");
    const dropdown = li.querySelector(".dropdown");

    dropdown.classList.toggle("hidden");
    dropdown.classList.toggle("unhide");
    return;
  }

  // -------------------------
  // EDIT
  // -------------------------
  if (editBtn) {
    const li = editBtn.closest("li");
    const folderId = li.dataset.id;

    modal.querySelector("form").action = `/folders/${folderId}/edit`;
    overlay.classList.remove("hidden"); // explicit open
    overlay.classList.add("unhide"); // trigger animation
    return;
  }

  // -------------------------
  // DELETE
  // -------------------------
  if (deleteBtn) {
    const li = deleteBtn.closest("li");
    const folderId = li.dataset.id;
    const parentId = li.dataset.parent;

    if (confirm("Are you sure you want to delete this folder?")) {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `/folders/${folderId}/delete`;

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "parentId";
      input.value = parentId || "";

      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    }
    return;
  }

  // -------------------------
  // CANCEL EDIT
  // -------------------------
  if (cancelBtn) {
    overlay.classList.add("hidden");
    return;
  }

  // -------------------------
  // OUTSIDE CLICK HANDLING
  // -------------------------

  // close dropdowns if clicking outside
  if (!e.target.closest(".dropdown") && !e.target.closest(".menu-toggle")) {
    document.querySelectorAll(".dropdown").forEach(d => {
      d.classList.add("hidden");
      d.classList.remove("unhide");
    });
  }

  // close modal if clicking outside
  if (!modal.classList.contains("hidden") && !modal.contains(e.target)) {
    overlay.classList.add("hidden");
  }
});