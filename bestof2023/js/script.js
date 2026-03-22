document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("stats-table");
    const csvFile = "2023stats.csv";
    let data = []; // Variable to store the loaded data
    let selectedColumn = null; // Variable to store the currently selected column

    // Fetch and parse CSV data
    fetch(csvFile)
        .then(response => response.text())
        .then(csvData => {
            data = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;
            createTable();
        });

    // Function to create the table dynamically
    function createTable() {
        const headerRow = table.createTHead().insertRow();
        const keys = Object.keys(data[0]);

        // Create table header
        keys.forEach((key, index) => {
            const th = document.createElement("th");
            th.textContent = key;
            th.addEventListener("click", () => sortTable(index));
            headerRow.appendChild(th);
        });

        // Sort the table initially by the first column in descending order
        sortTable(0);
    }

    // Function to sort the table
    function sortTable(column) {
        const order = (column === selectedColumn) ? (table.tHead.rows[0].cells[column].getAttribute("data-order") === "asc" ? "desc" : "asc") : "desc";
        const sortedRows = data.slice().sort((a, b) => {
            const aValue = isTimeColumn(column) ? convertTimeToSeconds(a[Object.keys(a)[column]]) : parseFloat(a[Object.keys(a)[column]].replace(/,/g, '')) || 0;
            const bValue = isTimeColumn(column) ? convertTimeToSeconds(b[Object.keys(b)[column]]) : parseFloat(b[Object.keys(b)[column]].replace(/,/g, '')) || 0;
            return order === "asc" ? aValue - bValue : bValue - aValue;
        });

        const tbody = table.tBodies[0] || table.createTBody(); // Check if tbody exists, otherwise create it
        tbody.innerHTML = sortedRows.map(createRow).join('');
        updateOrderIndicator(column, order);
        updateColumnHighlight(column);
        selectedColumn = column;
    }

    // Function to check if the column is a time column
    function isTimeColumn(column) {
        return data.some(row => /:/.test(row[Object.keys(row)[column]]));
    }

    // Function to convert time values to seconds for comparison
    function convertTimeToSeconds(time) {
        const [minutes, seconds] = time.split(":").map(part => parseInt(part, 10));
        return minutes * 60 + seconds;
    }

    // Function to create a table row
    function createRow(item) {
        return `<tr>${Object.values(item).map(value => `<td>${value}</td>`).join('')}</tr>`;
    }

    // Function to update the order indicator
    function updateOrderIndicator(column, order) {
        Array.from(table.tHead.rows[0].cells).forEach(cell => {
            cell.removeAttribute("data-order");
            cell.classList.remove("asc", "desc");
        });

        table.tHead.rows[0].cells[column].setAttribute("data-order", order);
        table.tHead.rows[0].cells[column].classList.add(order);
    }

    // Function to update the column highlight
    function updateColumnHighlight(column) {
        Array.from(table.tHead.rows[0].cells).forEach(cell => {
            cell.style.backgroundColor = "";
        });

        table.tHead.rows[0].cells[column].style.backgroundColor = "darkred";
    }
});
