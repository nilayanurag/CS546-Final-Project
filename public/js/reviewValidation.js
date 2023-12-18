document.addEventListener("DOMContentLoaded", function () {
  const categorySelect = document.getElementById("categorySelect");
  const businessSelect = document.getElementById("businessSelect");
  const form = document.getElementById("reviewForm");
  loadBusinesses();
  if (categorySelect) {
    categorySelect.addEventListener("change", loadBusinesses);
  }

  function loadBusinesses() {
    if (!categorySelect) {
      return;
    }
    const categoryId = categorySelect.value;
    // Make an AJAX request to the server
    fetch(`/businesses/${categoryId}`)
      .then((response) => response.json())
      .then((businesses) => {
        // Clear existing options
        businessSelect.innerHTML = "";

        // Add an option for each business
        businesses.forEach((business) => {
          const option = document.createElement("option");
          option.value = business._id;
          option.textContent = business.name;
          businessSelect.appendChild(option);
        });

        // Handle case when there are no businesses
        if (businesses.length === 0) {
          const option = document.createElement("option");
          option.textContent = "No businesses found";
          businessSelect.appendChild(option);
        }
      })
      .catch((error) => {
        console.error("Error fetching businesses:", error);
      });
  }

  // Form submission validation
  if (form) {
    form.addEventListener("submit", function (event) {
      const reviewText = document.getElementById("reviewText").value;
      const imageUpload = document.getElementById("imagePath");

      // Validate the length of review text
      if (reviewText.length < 2 || reviewText.length > 500) {
        alert("Review text must be between 2 and 500 characters long.");
        event.preventDefault();
        return;
      }
      // Validate image
      if (imageUpload.files.length > 0) {
        const file = imageUpload.files[0];
        const fileType = file.type.toLowerCase();
        const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];

        if (!validImageTypes.includes(fileType)) {
          alert("Only PNG, JPEG, and JPG formats are allowed.");
          event.preventDefault();
        }
      }
    });
  }
});
