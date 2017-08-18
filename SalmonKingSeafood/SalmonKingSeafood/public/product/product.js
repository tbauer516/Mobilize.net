(function () {
    "use strict";

    var requestData;

    let getFormData = () => {
        var formData = $('form').serializeArray();
        requestData = JSON.parse(formData[0])
    }

    const request = {
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        method: 'POST',
        data: ,
        credentials: 'include',
        mode: 'cors'
    };

    let getProductInfo = () => {
        request.data = JOSN.stringify($('form').serializeArray()[0]);
        return fetch('/BackEnd.asmx/SQLFindProduct', request)
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(data => {
                console.log(data);
                return data.d;
            })
            .catch(err => {
                console.log(err.Message);
            })
            .then(data => {
                let output = document.getElementById("#output");
                output.innerHtml = data[0];
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            })
    };
    

    $(window).ready(function () {
        var buttons = $("button");
        $("form").submit(function (event) {

            getProductInfo();
            //switch("search") {
            //    case "add":
            //        getProductInfo("SQLInsertNewProduct");
            //    case "edit":
            //        getProductInfo("SQLUpdateProduct");
            //    case "save":
            //        getProductInfo("SQLUpdateNewProduct");
            //    case "delete":
            //        getProductInfo("SQLDeleteProduct");
            //    case "search":
            //        getProductInfo("SQLFindProduct");
            //    case "hello":
            //        getProductInfo("HelloWorld");
            //}
            
            event.preventDefault();
        });

        
    });

  


    //function getProductInfo(method) {
    //    var url = "BackEnd.asmx/" + method;
    //    var output = $("#output");
    //    output.css("white-space", "pre-line");
    //    var product_info = $(this).serializeArray();
    //    var product_data = {};
    //    $.each(product_info, function (i, info) {
    //        product_data.push(info.value)
    //    })
    //    $.ajax({
    //        type: "GET",
    //        URL: "BackEnd.asmx/SQLFindProduct",
    //       // data: product_info,
    //        dataType: "json",
    //        success: function (data) {
    //            console.log("hi");
    //            output.html(data);
    //        },
    //        error: function (data) {
    //            console.log(data);
    //        }
    //    })
    //}
    
    
})();




