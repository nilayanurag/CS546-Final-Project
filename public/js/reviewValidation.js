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
      // Validate review text
      const reviewText = document.getElementById("reviewText").value;
      console.log(reviewText);
      // Validate image
      const imageUpload = document.getElementById("imagePath");
      console.log(imageUpload);
      console.log(document.getElementById("ratingPoints").value);
    });
  } 
});
