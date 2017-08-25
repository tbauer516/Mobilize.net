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
                console.log(json);
            })
            .catch(err => {
                console.log(err);
            })
    };

    $("#add").click(function (event) {
        var json = {
            product: data
        };
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


    function createTable() {
        var table = $("table");

    }

    function fillTable() {

    }
    

    $(window).ready(function () {
        $("form").submit(function (event) {
            formData = [$("#pcode").val(), $("#pname").val(), $("#pdescr").val(), $("#pcategory").val(), $("#pserial").val(), $("#pdiscontinued").val(),
                        $("#pdiscontinued").val(), $("#punitprice").val(), $("#pdiscontinued").val(), $("#pquantity").val(), $("#punit").val()]
        });
        getProductInfo();
    });
    
})();





