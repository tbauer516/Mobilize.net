(function () {
    "use strict";

    $(window).ready(function () {
        var buttons = $("button");
        $("form").submit(function (event) {
            switch("search") {
                case "add":
                    getProductInfo("SQLInsertNewProduct");
                case "edit":
                    getProductInfo("SQLUpdateProduct");
                case "save":
                    getProductInfo("SQLUpdateNewProduct");
                case "delete":
                    getProductInfo("SQLDeleteProduct");
                case "search":
                    getProductInfo("SQLFindProduct");
                case "hello":
                    getProductInfo("HelloWorld");
            }
            event.preventDefault();
        });
    });

    function getProductInfo(method) {
        var url = "BackEnd.asmx/" + method;
        var output = $("#output");
        output.css("white-space", "pre-line");
        var product_info = $(this).serializeArray();
        var product_data = {};
        $.each(product_info, function (i, info) {
            product_data.push(info.value)
        })
        $.ajax({
            type: "GET",
            URL: "BackEnd.asmx/SQLFindProduct",
           // data: product_info,
            dataType: "json",
            success: function (data) {
                console.log("hi");
                output.html(data);
            },
            error: function (data) {
                console.log(data);
            }
        })
    }

})();


