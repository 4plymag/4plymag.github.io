// Get the list of firsts
var firstsList = document.getElementById("firsts-list");

// Add click event listener to each first
firstsList.querySelectorAll("p").forEach(function(first) {
    first.addEventListener("click", function() {
        var month = this.getAttribute("data-month");
        var year = this.getAttribute("data-year");
        var imageName = month.toLowerCase() + year + ".jpg";
        var imagePath = "covers/" + imageName;

        // Update the cover image source in the popup
        document.getElementById("cover-popup-image").src = imagePath;

        // Show the popup
        document.getElementById("cover-popup").style.display = "block";
    });
});

// Add click event listener to close button
document.getElementById("popup-close-btn").addEventListener("click", function() {
    // Hide the popup when close button is clicked
    document.getElementById("cover-popup").style.display = "none";
});

// Add click event listener to popup itself to close it when clicked anywhere in the popup
document.getElementById("cover-popup").addEventListener("click", function(event) {
    // Check if the click event originated from within the popup content
    if (event.target !== document.getElementById("cover-popup-image")) {
        // Hide the popup if clicked outside the image
        document.getElementById("cover-popup").style.display = "none";
    }
});

// Add click event listener to the image itself to close the popup when clicked
document.getElementById("cover-popup-image").addEventListener("click", function() {
    // Hide the popup when the image is clicked
    document.getElementById("cover-popup").style.display = "none";
});

