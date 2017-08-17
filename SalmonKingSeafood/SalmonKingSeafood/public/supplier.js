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

// For HelloTest, based on Add button click
//$("#add-button").click(function (e) {
//    e.preventDefault();
//    var value = {
//        "value" : $("#supplier-name").val()
//    };
//    var json = JSON.stringify(value);
//    $.ajax({
//        method: 'POST',
//        url: "/BackEnd.asmx/HelloTest",
//        contentType: "application/json; charset=utf-8",
//        dataType: 'json',
//        data: json,
//        success: function (response) {
//            console.log('good');
//            console.log(response);
//        },
//        error: function (response) {
//            console.log('bad');
//            console.log(response);
//        }
//    });
//});

// Form submits
// Find button
// Find sproc
$("#add-button").click(function (e) {
    //e.preventDefault();
    // Change this
    var data = [$("#supplier-name").val(), $("#payment").val(), $("#note").val()];
    console.log(data);
    var json = {
        supplierForm: data
    };
    console.log(json);
    $.ajax({
        method: 'POST',
        url: "/BackEnd.asmx/SupplierPost",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify(json),
        success: function (response) {
            console.log(response);
        },
        error: function (response) {
            console.log(response);
        }
    });
});

function getSupplierSQL() {
    return fetch('/BackEnd.asmx/SupplierView', request)
        .then(response => {
            return response.json();
        })
        .then(data => {
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
    nameTH.textContent = "Supplier Name";
    var paymentTH = document.createElement("th");
    paymentTH.textContent = "Payment Terms";
    var notesTH = document.createElement("th");
    notesTH.textContent = "Notes";

    // Contact
    var fnameTH = document.createElement("th");
    fnameTH.textContent = "First Name";
    var lnameTH = document.createElement("th");
    lnameTH.textContent = "Last Name";
    var titleTH = document.createElement("th");
    titleTH.textContent = "Title";

    // Email & phone
    var emailTH = document.createElement("th");
    emailTH.textContent = "Email";
    var phoneTH = document.createElement("th");
    phoneTH.textContent = "Phone";
    var extensionTH = document.createElement("th");
    extensionTH.textContent = "Extension";
    var faxTH = document.createElement("th");
    faxTH.textContent = "Fax";

    // Address
    var billingTH = document.createElement("th");
    billingTH.textContent = "Billing Address";
    var cityTH = document.createElement("th");
    cityTH.textContent = "City";
    var stateTH = document.createElement("th");
    stateTH.textContent = "State";
    var zipcodeTH = document.createElement("th");
    zipcodeTH.textContent = "Zipcode";
    var countryTH = document.createElement("th");
    countryTH.textContent = "Country";

    // Append these elements to the table
    //threadRow.appendChild(idTH);
    threadRow.appendChild(nameTH);
    threadRow.appendChild(paymentTH);
    threadRow.appendChild(notesTH);

    // For table simplicity
    //threadRow.appendChild(fnameTH);
    //threadRow.appendChild(lnameTH);
    //threadRow.appendChild(titleTH);
    //threadRow.appendChild(emailTH);
    //threadRow.appendChild(phoneTH);
    //threadRow.appendChild(extensionTH);
    //threadRow.appendChild(faxTH);
    //threadRow.appendChild(billingTH);
    //threadRow.appendChild(cityTH);
    //threadRow.appendChild(stateTH);
    //threadRow.appendChild(zipcodeTH);
    //threadRow.appendChild(countryTH);

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
        var count = 0;
        // Iterate over each field
        supplierKeys.forEach(function (key) {
            if (count < 3) { // Just to grab 3 items for table simplicity
                var value = data[key];
                //console.log(value); // Debugging purposes
                var td = document.createElement("td");
                td.textContent = value;
                supplierTr.appendChild(td);
            }
            count++;
        });
        tbody.appendChild(supplierTr);
    });

}