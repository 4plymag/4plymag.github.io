function initMap() {
    console.log("Initializing map..."); // Ensure this log appears

    const map = new google.maps.Map(document.getElementById("map"), {
        mapId: 'f1c3ade2327ed840', // Use your map ID here
        zoom: 15,
        center: { lat: -27.48088, lng: 153.00979 }, // Center the map around the area of interest
    });

    let currentInfoWindow = null; // Variable to keep track of the currently open info window
    let markers = []; // Array to store markers
    let types = []; // Array to store obstacle types

   function createMarker(position, obstacle, name, info, address, type, security, difficulty) {
    let iconSize = 70; // Default icon size
    if (obstacle === "shop") {
        iconSize = 90; // Change icon size for shops
    }
    const iconPath = obstacle ? `icons/${obstacle}.png` : "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

    // Replace spaces with underscores in the spot name for the image URL
    const imageName = name.replace(/\s+/g, '_');
    const jpgImageURL = `https://cdn.shopify.com/s/files/1/0731/7428/6637/files/${imageName}.jpg`;
    const webpImageURL = `https://cdn.shopify.com/s/files/1/0731/7428/6637/files/${imageName}.webp`;
    const placeholderImageURL = 'https://cdn.shopify.com/s/files/1/0731/7428/6637/files/Placeholder.png?v=1711439071';

    // Create InfoWindow for the marker
const infoWindowContent = document.createElement('div');
infoWindowContent.classList.add('spot-info-window'); // Add a class to the info window container
infoWindowContent.style.display = 'flex'; // Set display to flex
infoWindowContent.style.maxWidth = '400px'; // Set max width for the info window
infoWindowContent.innerHTML = `
    <div class="spot-image-container"> <!-- Add a class to the image container -->
        <img alt="${name} Image" class="spot-image"> <!-- Add a class to the image -->
    </div>
    <div class="spot-details"> <!-- Add a class to the details container -->
        <h2 id="spot-name">${name}</h2>
        <p class="spot-type">Spot Type: ${obstacle}</p>
        <p class="spot-info">${info || "No additional info available."}</p>
        ${security > 0 || difficulty > 0 ? `<p class="spot-security">Security: ${getStarRating(security)}</p>` : ''}
        ${security > 0 || difficulty > 0 ? `<p class="spot-difficulty">Difficulty: ${getStarRating(difficulty)}</p>` : ''}
    </div>
`;





    const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
    });

    const marker = new google.maps.Marker({
        position: position,
        map: map,
        icon: {
            url: iconPath,
            scaledSize: new google.maps.Size(iconSize, iconSize) // Adjust the size of the icon as needed
        },
        type: { name: type }, // Assigning the corresponding type to the marker
        obstacle: obstacle // Assigning the obstacle to the marker
    });

    marker.addListener("click", () => {
    // Close the currently open info window
    if (currentInfoWindow) {
        currentInfoWindow.close();
    }
    currentInfoWindow = infoWindow;
    if (imageExists(jpgImageURL)) {
        infoWindowContent.querySelector('img').src = jpgImageURL;
    } else if (imageExists(webpImageURL)) {
        infoWindowContent.querySelector('img').src = webpImageURL;
    } else {
        infoWindowContent.querySelector('img').src = placeholderImageURL;
    }
    infoWindow.open(map, marker);

    // Log difficulty and security ratings to the console
    console.log(`Difficulty: ${difficulty}, Security: ${security}`);
});


    markers.push(marker); // Add marker to the array
    return marker;
}


// Function to generate star rating HTML
function getStarRating(rating) {
    const maxRating = 5;
    let starHTML = '';

    // Loop through the maximum rating
    for (let i = 0; i < maxRating; i++) {
        // Check if the current index is less than the rating
        if (i < rating) {
            // If the rating is greater than the current index, add a filled star
            starHTML += `<img src="icons/star.png" alt="Filled Star" class="star">`;
        } else {
            // If the rating is not greater than the current index, add an empty star
            starHTML += `<img src="icons/nostar.png" alt="Empty Star" class="star">`;
        }
    }

    return starHTML;
}




// Function to check if an image URL exists
function imageExists(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false);
    xhr.send();
    return xhr.status !== 404;
}


    // Add click event listener to the map to close any open info window
    map.addListener("click", () => {
        if (currentInfoWindow) {
            currentInfoWindow.close();
            currentInfoWindow = null;
        }
    });

    // Parse CSV data and add points as markers
fetch('./map.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1); // Skip header row
        rows.forEach(row => {
            const columns = row.split(',').map(col => col.trim()); // Trim whitespace from each column
            const name = columns[0];
            const lat = parseFloat(columns.find((col, index) => col && index === 8)); // Find latitude column
            const lng = parseFloat(columns.find((col, index) => col && index === 7)); // Find longitude column
            const obstacle = columns.find((col, index) => col && index === 3); // Find obstacle column
            const info = columns[10]; // Info column
            const address = columns[11]; // Address column
            const type = columns[2]; // Type column
            const security = parseInt(columns[12]) || 0; // Parse security column
            const difficulty = parseInt(columns[13]) || 0; // Parse difficulty column

            // Check if spot has valid coordinates
            if (!isNaN(lat) && !isNaN(lng) && type) {
                const position = { lat, lng };
                // Create marker for the spot
                createMarker(position, obstacle, name, info, address, type, security, difficulty).setTitle(name);

                // Add type to the list if not already present
                if (!types.includes(type)) {
                    types.push(type);
                }
            }
        });

        // Populate legend with type names
        const legendContainer = document.getElementById("obstacleLegend");
        types.forEach(type => {
            const checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.id = type;
            checkbox.checked = true; // Initially all checkboxes are checked
            checkbox.addEventListener('change', () => {
                toggleMarkers(type);
            });

            const label = document.createElement('label');
            label.htmlFor = type;
            label.appendChild(document.createTextNode(type.charAt(0).toUpperCase() + type.slice(1))); // Capitalize the first letter of the type

            legendContainer.appendChild(checkbox);
            legendContainer.appendChild(label);
            legendContainer.appendChild(document.createElement('br'));
        });
    })
    .catch(error => console.error('Error fetching CSV:', error));

    // Function to toggle markers based on checkbox selection
    function toggleMarkers() {
    let checkedTypes = []; // Array to store checked types
    types.forEach(type => {
        const checkbox = document.getElementById(type);
        if (checkbox.checked) {
            checkedTypes.push(type); // Add checked type to the array
        }
    });

    markers.forEach(marker => {
        const markerType = marker.type.name.toLowerCase();
        const isVisible = checkedTypes.includes(markerType); // Check if marker type is in the array of checked types
        marker.setMap(isVisible ? map : null); // Show or hide the marker based on checked types
    });
}

    // Add keydown event listener to the search input
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchMarkers(); // Call searchMarkers function when Enter key is pressed
    }
});

// Add search button
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', () => {
    searchMarkers();
});

// Function to filter markers based on search input
function searchMarkers() {
    const searchText = document.getElementById("searchInput").value.toLowerCase();
    markers.forEach(marker => {
        const name = marker.getTitle();
        const type = marker.type.name;
        const obstacle = marker.obstacle ? marker.obstacle.toLowerCase() : ""; // Check if obstacle is defined
        
        if (name && name.toLowerCase().includes(searchText)) {
            marker.setVisible(true);
        } else if (type && type.toLowerCase().includes(searchText)) {
            marker.setVisible(true);
        } else if (obstacle && obstacle.includes(searchText)) { // Using includes() directly
            marker.setVisible(true);
        } else {
            marker.setVisible(false);
        }
    });
}
}

window.initMap = initMap;

// Call initMap when the page is loaded
initMap();
