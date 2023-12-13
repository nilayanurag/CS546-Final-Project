document.addEventListener("DOMContentLoaded", function () {
  const categorySelect = document.getElementById("categorySelect");
  const businessSelect = document.getElementById("businessSelect");
  const form = document.getElementById("reviewForm");
  loadBusinesses();

  // Re-load businesses when the category changes
  categorySelect.addEventListener("change", loadBusinesses);

  // Function to load businesses based on the selected category
  function loadBusinesses() {
    const categoryId = categorySelect.value;
    console.log(categoryId);

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
      // if (reviewText.length === 0 || reviewText.length > 500) {
      //     alert('Review text must be between 1 and 500 characters long.');
      //     // event.preventDefault(); // Prevent form submission
      //     return;
      // }

      // Validate image
      const imageUpload = document.getElementById("imagePath");
      console.log(imageUpload);
      console.log(document.getElementById("ratingPoints").value);
      //   if (imageUpload.files.length > 0) {
      //       const file = imageUpload.files[0];
      //       const fileSizeMB = file.size / 1024 / 1024; // Size in MB
      //       const fileType = file.type;

      //       // Check file size
      //       if (fileSizeMB > 15) {
      //           alert('Image size should not exceed 15 MB.');
      //           // event.preventDefault();
      //           return;
      //       }

      //       // Check file type
      //       if (fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/jpg') {
      //           alert('Only PNG, JPEG, and JPG formats are allowed.');
      //           // event.preventDefault();
      //           return;
      //       }
      //   }else {
      //     console.error('Form not found');
      // }
    });
  }else{
    // Load businesses for the initially selected category
  
  }
});
