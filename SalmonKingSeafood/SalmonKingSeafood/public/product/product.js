(function () {
    "use strict";

    var buttonValue;

    $(window).ready(function () {
        createTable();
        getProductInfo();
        $("#form button").click(function (event) {
            buttonValue = $(this).val();
        });
        $("#form").submit(function (event) {
            event.preventDefault();
            if (buttonValue == "Search") {
                getProductInfo();
            } else {
                formSubmit(event);
            }
        });

    });

    const request = {
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
    };

    // Submits a request for all products and displays the data in a table.
    function getProductInfo() {
        return fetch('/BackEnd.asmx/SQLViewProduct', request)
            .then(response => {
                return response.json();
            })
            .then(data => {
                return data.d;
            })
            .then(data => {
                var json = JSON.parse(data);                
                fillTable(json);
            })
            .catch(err => {
                console.log(err);
            })
    };

    
   

    function formSubmit(event) {
        var formData;
        var productInfo;
        if (buttonValue != "Delete") {
            formData = [buttonValue, $("#pname").val(), $("#pdescr").val(), $("#ptype").val(), $("#pcode").val(), $("#pserial").val(), $("#pdiscontinued").val(),
                $("#punitprice").val(), $("#pquantity").val(), $("#punit").val()];
            productInfo = ["ProductName", "ProductDesc", "ProductTypeName", "ProductCode", "SerialNumber", "Discontinued", "UnitPrice", "QuantityPerUnit", "Unit"];
        } else {
            formData = [buttonValue, $("#pname").val()];
            productInfo = ["ProductName"]
        }
        
        var json = {
            data: formData,
            info: productInfo
        };
        $.ajax({
            method: 'POST',
            url: "/BackEnd.asmx/ProductSQL",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(json),
            success: function (response) {
                getProductInfo();
            },
            error: function (response) {
                console.log(response);
                console.log(response.responseText);
            }
        });
    }

    // Create the product table with column headers. 
    function createTable() {
        var productInfo = ["ProductID", "ProductName", "ProductDescr", "ProductType", "ProductCode", "ProductSerialNumber",  "Discontinued", "UnitPrice", "Qty", "unit"];
        var table = $(".table");
        var tbody = document.createElement("tbody");
        tbody.id = "tbody";
        var thead = document.createElement("thead");
        var row = thead.insertRow(0);
        for (var i = 0; i < productInfo.length; i++) {
            var td = document.createElement("td");
            td.textContent = productInfo[i];
            row.append(td);
        }
        thead.append(row);
        table.append(thead);
        table.append(tbody);
        
    }

    // Fills the output table with json data
    function fillTable(json) {
        var tbody = $("#tbody");
        tbody.find("tr").remove();
        $.each(json, function (i, row) {
            var tr = document.createElement("tr");
            $.each(row, function (j, rowData) {
                var td = document.createElement("td");
                td.textContent = rowData;
                tr.append(td);
            });
            tbody.append(tr);
        }); 
    }
    
})();





