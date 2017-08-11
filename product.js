(function () {
    "use strict";

    $(window).ready(function () {
        console.log("success");
        console.log($("#psubmit"));
        $("form").submit(function (event) {
            switch(this.id) {
                case "add":
                    getproductInfo("SQLInsertNewProduct");
                case "edit":
                    getproductInfo("SQLUpdateProduct");
                case "save":
                    getproductInfo("SQLUpdateNewProduct");
                case "delete":
                    getproductInfo("SQLDeleteProduct");
                case "search":
                    getproductInfo("SQLFindProduct");
            }
            getproductInfo();
            event.preventDefault();
        });
    });

    function getproductInfo(method) {
        var output = $("#output");
        output.css("white-space", "pre-line");
        var product_info = $(this).serializeArray();
        var product_data = {};
        $.each(product_info, function (i, info) {
            product_data.push(info.value)
        })
        console.log(product_info);
        $.ajax({
            type: "POST"
            URL: "BackEnd.asmx/" + method
            data: product_info
            dataType: "json"
            success: function (data) {
                output.html(data);
            }
        })
    }

})();


