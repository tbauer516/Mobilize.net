(function () {
    "use strict";

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
    

    $(window).ready(function () {
        var buttons = $("button");
        $("form").submit(function (event) {
            getProductInfo();
        });


    });
    
})();





