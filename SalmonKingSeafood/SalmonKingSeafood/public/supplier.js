window.onload = () => {
    getSupplierSQL();
};

const request = {
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    },
    method: 'get',
    // want it to be a post
    credentials: 'include',
    mode: 'cors'
};

function getSupplierSQL() {
    return fetch('/BackEnd.asmx/SupplierTest', request)
        .then(response => {
            return response.json();
        })
        .then(data => {
            //console.log(data);
            return data.d;
        })
        .then(data => {
            // String to JSON object
            var json = JSON.parse(data);
            //console.log(json);
            populateRows(json); // Build the table
            return data;
        })
        .catch(err => {
            console.log(err);
        })
};

var table = document.querySelector(".table");

// Build the outline of the table
function buildTable() {
    // table body and table head
    var tbody = document.createElement("tbody");
    var thead = document.createElement("thead");

    // Row for the header
    var threadRow = document.createElement("tr");

    // Columns for the header

    var idTH = document.createElement("th");
    idTH.textContent = "SupplierID";
    var nameTH = document.createElement("th");
    nameTH.textContent = "SupplierName";
    var paymentTH = document.createElement("th");
    paymentTH.textContent = "PaymentTerms";
    var notesTH = document.createElement("th");
    notesTH.textContent = "Notes";

    // Append these elements to the table
    threadRow.appendChild(idTH);
    threadRow.appendChild(nameTH);
    threadRow.appendChild(paymentTH);
    threadRow.appendChild(notesTH);

    thead.appendChild(threadRow);
    table.appendChild(tbody);
    table.appendChild(thead);
}

// Populate the supplier table
// TODO: Add an edit button
function populateRows(rows) {
    buildTable();
    var tbody = document.querySelector("tbody");

    // Iterate over each supplier,
    rows.forEach(function (data) {
        var supplierTr = document.createElement("tr");

        // Object.keys returns an array of the keys object
        var supplierKeys = Object.keys(data);

        // Iterate over each field
        supplierKeys.forEach(function (key) {
            var value = data[key];
            var td = document.createElement("td");
            td.textContent = value;
            supplierTr.appendChild(td);
        });
        tbody.appendChild(supplierTr);
    });

}