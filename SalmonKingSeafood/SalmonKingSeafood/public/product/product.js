(function () {
    "use strict";

    var formData;

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
//                console.log(json); // For debug
                createTable();
                fillTable(json);
            })
            .catch(err => {
                console.log(err);
            })
    };

    // Adds a new prduct via asmx sql call
    $("#add").click(function (event) {
        formData = [$("#pcode").val(), $("#pname").val(), $("#pdescr").val(), $("#pcategory").val(), $("#pserial").val(), $("#pdiscontinued").val(),
        $("#punitprice").val(), $("#pquantity").val(), $("#punit").val()]
        var json = {
            product: formData
        };
        console.log(json);
        $.ajax({
            method: 'POST',
            url: "/BackEnd.asmx/AddProduct",
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

    $("#edit").click(function (event) {

    });

    $("#save").click(function (event) {

    });

    $("#delete").click(function (event) {

    });

    $("#search").click(function (event) {

    });

    // Create the product table with column headers. 
    function createTable() {
        var productInfo = ["ProductName", "ProductCode", "ProductDescr", "ProductType", "ProductSerialNumber", "ProductCode",  "Discontinued", "UnitPrice", "Qty", "unit"];
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
//        console.log(tbody);  // For debug
        $.each(json, function (i, row) {
            var tr = document.createElement("tr");
            $.each(row, function (j, rowData) {
                var td = document.createElement("td");
                td.textContent = rowData;
                tr.append(td);
            });
//            console.log(tr); // For debug
            tbody.append(tr);
        }); 
    }
    

    $(window).ready(function () {
        $("form").submit(function (event) {
            
        });
        getProductInfo();
    });
    
})();





