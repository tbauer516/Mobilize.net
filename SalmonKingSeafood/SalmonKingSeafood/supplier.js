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

$("#add-button").click(function (e) {
    //e.preventDefault(); // Disallow the refreshing
    // Get all values from the form -- find a better way to do this
    var data = [$("#supplier-name").val(), $("#payment").val(), $("#note").val(), $("#fname").val(), $("#lname").val(), $("#email").val(),
                $("#phone").val(), $("#title").val(), $("#extension").val(), $("#fax").val(), $("#billing-address").val(), $("#city").val(),
                $("#state").val(), $("#zipcode").val(), $("#country").val()]
    //console.log(data); // Debugging
    var json = {
        supplierForm: data
    };
    //console.log(json); // Debugging
    $.ajax({
        method: 'POST',
        url: "/BackEnd.asmx/InsertSupplier",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify(json),
        success: function (response) {
            console.log("good");
            console.log(response);
        },
        error: function (response) {
            console.log(response);
        }
    });
});


$("#edit-button").click(function (e) {
    //e.preventDefault(); // Disallow the refreshing
    // Get all values from the form -- find a better way to do this
    var data = [$("#supplier-name").val(), $("#payment").val(), $("#note").val(), $("#fname").val(), $("#lname").val(), $("#email").val(),
    $("#phone").val(), $("#title").val(), $("#extension").val(), $("#fax").val(), $("#billing-address").val(), $("#city").val(),
    $("#state").val(), $("#zipcode").val(), $("#country").val()]
    //console.log(data); // Debugging
    var json = {
        supplierForm: data
    };
    //console.log(json); // Debugging
    $.ajax({
        method: 'POST',
        url: "/BackEnd.asmx/UpdateSupplier",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify(json),
        success: function (response) {
            console.log("good");
            console.log(response);
        },
        error: function (response) {
            console.log(response);
        }
    });
});

// DELETE SUPPLIER -- CANNOT HAVE DUPLICATES, WILL NOT WORK
$("#delete-button").click(function (e) {
    //e.preventDefault(); // Disallow the refreshing
    // Get all values from the form -- find a better way to do this
    var data = [$("#supplier-name").val(), $("#fname").val(), $("#lname").val(), $("#title").val(), $("#billing-address").val(), 
                $("#city").val(), $("#state").val(), $("#zipcode").val(), $("#country").val()]
    //console.log(data); // Debugging
    var json = {
        supplierForm: data
    };
    //console.log(json); // Debugging
    $.ajax({
        method: 'POST',
        url: "/BackEnd.asmx/DeleteSupplier",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify(json),
        success: function (response) {
            console.log("good");
            console.log(response);
        },
        error: function (response) {
            console.log(response);
        }
    });
});

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
    var emailTH = document.createElement("th");
    emailTH.textContent = "Email";
    var phoneTH = document.createElement("th");
    phoneTH.textContent = "Phone";
    var titleTH = document.createElement("th");
    titleTH.textContent = "Title";
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
    threadRow.appendChild(fnameTH);
    threadRow.appendChild(lnameTH);
    threadRow.appendChild(emailTH);
    threadRow.appendChild(phoneTH);
    threadRow.appendChild(titleTH);
    threadRow.appendChild(extensionTH);
    threadRow.appendChild(faxTH);
    threadRow.appendChild(billingTH);
    // Hidden for simple visibility
    threadRow.appendChild(cityTH);
    threadRow.appendChild(stateTH);
    threadRow.appendChild(zipcodeTH);
    threadRow.appendChild(countryTH);

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
            //if (count < 11) { // Just to grab 3 items for table simplicity
                var value = data[key];
                //console.log(value); // Debugging purposes
                var td = document.createElement("td");
                td.textContent = value;
                supplierTr.appendChild(td);
            //}
            count++;
        });
        tbody.appendChild(supplierTr);
    });

}