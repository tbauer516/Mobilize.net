window.onload = () => {
    getSupplierSQL();
};

const request = {
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    },
    method: 'get',
    credentials: 'include',
    mode: 'cors'
};

$("#supplier-form").submit(function (e) {
    var clicked = $(document.activeElement).val(); // Button clicked
    if (clicked === 'Search') {
        e.preventDefault();
    }
    // Default for Insert & Update
    var data = [clicked, $("#supplier-name").val(), $("#payment").val(), $("#note").val(), $("#fname").val(), $("#lname").val(), $("#email").val(),
                $("#phone").val(), $("#title").val(), $("#extension").val(), $("#fax").val(), $("#billing-address").val(), $("#city").val(),
                $("#state").val(), $("#zipcode").val(), $("#country").val()];

    if (clicked === "Delete") {
        data = [clicked, $("#supplier-name").val(), $("#fname").val(), $("#lname").val(), $("#title").val(), $("#billing-address").val(),
            $("#city").val(), $("#state").val()]
    }
    var json = {
        supplierForm: data
    };
    console.log(data);
    SupplierMethod(json);
});

function SupplierMethod(data) {
    $.ajax({
        method: 'POST',
        url: "/BackEnd.asmx/SupplierMethod",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify(data),
        success: function (response) {
            console.log("good");
            console.log(response);
            var table = document.querySelector(".table");
            table.innerHTML = "";
            populateRows(JSON.parse(response.d));
        },
        error: function (response) {
            console.log("bad");
            console.log(response);
        }
    });
}

// Get the suppliers and tables
function getSupplierSQL() {
    return fetch('/BackEnd.asmx/ViewSupplier', request)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data.d;
        })
        .then(data => {
            // String to JSON object
            var json = JSON.parse(data);
            populateRows(json); // Build the table
            return data;
        })
        .catch(err => {
            console.log(err);
        })
};

var table = document.querySelector(".table");
var headers = ["ID", "Supplier", "Payment Terms", "Notes", "First", "Last", "Email", "Phone",
    "Title", "Ext", "Fax", "Address", "City", "State", "Zipcode", "Country"];

// Build the outline of the table
function buildTable() {
    // table body and table head
    var tbody = document.createElement("tbody");
    var thead = document.createElement("thead");

    // Row for the header
    var threadRow = document.createElement("tr");

    for (i = 0; i < headers.length; i++) {
        var valueTH = document.createElement("th");
        valueTH.textContent = headers[i];
        threadRow.append(valueTH);
    }

    thead.appendChild(threadRow);
    table.appendChild(tbody);
    table.appendChild(thead);
}

// Populate the supplier table
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
