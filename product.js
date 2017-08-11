(function () {
    "use strict";

    $(window).ready(function () {
        console.log("success");
        console.log($("#psubmit"));
        $("form").submit(function (event) {
            getproductInfo();
            event.preventDefault();
        });
    });

    function getproductInfo() {
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
            URL: "BackEnd.asmx/HelloWorld"
            data: product_info
            dataType: "json"
            success: function (data) {
                output.html(data);
            }
        })
    }

    /*
    const request = {
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        method: 'get',
        credentials: 'include',
        mode: 'cors'
    };


    let getProductInfo = () => {
        return new Promise((resolve, reject) => {
            fetch('/BackEnd.asmx/SQLGetProductInfo', request)
                .then((response) => {
                    console.log(response);
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    resolve(data.d);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
            .then(data => {
                let product_info = ('#output');
                product_info.innerHTML = data;
                console.log(data);
            });
    };
    */
})();


