window.onload = () => {
    getTestSql();
};

const request = {
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    },
    method: 'get',
    credentials: 'include',
    mode: 'cors'
};

let getTestSql = () => {
    return fetch('/BackEnd.asmx/SQLTest', request)
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(data => {
            console.log(data);
            return data.d;
        })
        .catch(err => {
            console.log(err);
        })
        .then(data => {
            let testDiv = document.querySelector('#sqltestdata');
            //testDiv.innerHTML = data;
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        })
};