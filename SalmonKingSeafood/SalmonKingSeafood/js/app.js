debounce = (func, wait, immediate) => {
    let timeout;
    return () => {
        let context = this;
        let later = () => {
            timeout = null;
            if (!immediate) func.apply(context);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

requestObject = {
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    },
    method: 'POST',
    credentials: 'include',
    mode: 'cors'
};

makeRequest = (funcName, data) => {
    let request = JSON.parse(JSON.stringify(requestObject));

    if (data) {
        request.body = JSON.stringify(data);
    }

    return fetch('/BackEnd.asmx/' + funcName, request)
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.d)
                data = data.d;
            data = JSON.parse(data);
            return data;
        })
        .catch(err => {
            console.log(err);
        });
};