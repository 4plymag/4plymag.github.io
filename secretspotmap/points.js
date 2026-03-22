// // points.js

// // Function to parse CSV data and calculate points
// function parseCSV(csvData) {
//   console.log("Parsing CSV data...");
  
//   const rows = csvData.split('\n').slice(1); // Skip header row
//   const points = [];

//   rows.forEach(row => {
//     const columns = row.split(',').map(col => col.trim()); // Trim whitespace from each column
//     const name = columns[0];
//     const lat = parseFloat(columns.find((col, index) => col && index === 8)); // Find latitude column
//     const lng = parseFloat(columns.find((col, index) => col && index === 7)); // Find longitude column
//     const obstacle = columns.find((col, index) => col && index === 2); // Find obstacle column
    
//     // Check if spot has valid coordinates
//     if (!isNaN(lat) && !isNaN(lng) && obstacle) {
//       const position = { lat, lng };
//       points.push({ name, position, obstacle });
//       console.log('Added point:', name); // Log the name of the added point
//       console.log('Latitude:', lat);
//       console.log('Longitude:', lng);
//       console.log('Obstacle:', obstacle);
//     }
//   });

//   return points;
// }

// // Fetch data from CSV file
// function fetchData() {
//   console.log("Fetching CSV data...");
  
//   return fetch('./map.csv')
//     .then(response => response.text())
//     .then(data => {
//       console.log("CSV data fetched successfully.");
//       return parseCSV(data);
//     })
//     .catch(error => {
//       console.error('Error fetching CSV:', error);
//       return [];
//     });
// }

// // Export the function to be used in other files
// export { fetchData };
