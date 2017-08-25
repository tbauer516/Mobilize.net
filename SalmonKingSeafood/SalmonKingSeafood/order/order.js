const debounce = (func, wait, immediate) => {
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

const mockData = () => {
    const data = [{
        Quantity: 0,
        Code: 'XYZ',
        Product: 'Salmon',
        UnitPrice: 25.0,
        Price: 0.0,
        Existence: 'Yes',
        Ordered: 0.0,
        QuantityPer: 3
    }];
    return Promise.resolve(data);
};

const getProducts = () => {

};

const getCustomers = () => {
    return fetch('/BackEnd.asmx/GetCustomers', request)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data.d;
        })
        .then(data => {
            data = JSON.parse(data);
            console.log(data);
            return data;
        })
        .catch(err => {
            console.log(err);
        });
};

const mockCustomers = () => {
    const customers = [
        {
            CustomerID: 1,
            CompanyName: 'TestCompany',
            ContactFirstName: 'Jane',
            ContactLastName: 'Doe',
            City: 'Nowhere',
            State: 'Washington',
            Country: 'US'
        },
        {
            CustomerID: 2,
            CompanyName: 'OtherCompany',
            ContactFirstName: 'John',
            ContactLastName: 'Dun',
            City: 'Everywhere',
            State: 'Oregon',
            Country: 'US'
        }
    ];
    return Promise.resolve(customers);
};

const customerFormat = [
    'CustomerID',
    'CompanyName',
    'ContactFirstName',
    'ContactLastName',
    'City',
    'State',
    'Country'
];

const productFormat = [
    'Quantity',
    'Code',
    'Product',
    'UnitPrice',
    'Price',
    'Existence',
    'Ordered',
    'QuantityPer'
];

const customerHeaders = '<tr><th></th><th>Customer ID</th><th>Company Name</th><th>Contact Name</th><th>Contact Last Name</th><th>City</th><th>State</th><th>Country</th></tr>';
const productHeaders = '<tr><th></th><th>Quantity</th><th>Code</th><th>Product</th><th>UnitPrice</th><th>Price</th><th>Existence</th><th>Ordered</th><th>QuantityPer</th>';

let customerList;
const customerHtml = $('#customer-list table');
let productList;
const productHtml = $('#product-list table');

const selectedCompany = $('input[name=selected-company]');
const selectedContact = $('input[name=selected-contact]');

const customerSearchInputs = {
    CompanyName: $('form[name=search] input[name=company-name'),
    ContactFirstName: $('form[name=search] input[name=contact-first-name'),
    ContactLastName: $('form[name=search] input[name=contact-last-name')
};

const isVisible = (inputs, customer) => {
    for (let input in inputs) {
        if (customer[input].toLowerCase().indexOf(inputs[input].val().toLowerCase()) === -1)
            return false;
    }
    return true;
};

const setSelected = (index) => {
    selectedCompany.val(customerList[index].CompanyName);
    selectedContact.val(customerList[index].ContactFirstName + ' ' + customerList[index].ContactLastName);
};

const queryProducts = () => {
    productHtml.empty();
    productHtml.append(productHeaders);
    
    for (let i = 0; i < productList.length; i++) {
        let newRow = $('<tr>');
        newRow.append('<td><input name="select-product" type="checkbox" id=' + i + ' value=' + i + ' /></td>');
        for (let j = 0; j < productFormat.length; j++) {
            newRow.append('<td>' + productList[i][productFormat[j]] + '</td>');
        }
        productHtml.append(newRow);
    }
};

const searchCustomers = () => {
    console.log(customerList);
    customerHtml.empty();
    customerHtml.append(customerHeaders);

    for (let i = 0; i < customerList.length; i++) {
        if (isVisible(customerSearchInputs, customerList[i])) {
            let newRow = $('<tr>');
            newRow.append('<td><input name="select-customer" type="radio" id=' + i + ' value=' + i + ' /></td>');
            for (let j = 0; j < customerFormat.length; j++) {
                newRow.append('<td>' + customerList[i][customerFormat[j]] + '</td>');
            }
            customerHtml.append(newRow);
        }
    }
    $('#customer-list input[type=radio]').on('click', (event) => {
        console.log(event.target.value);
        setSelected(event.target.value);
        queryProducts();
    });
};

$(() => {
    getCustomers()
        .then(cust => {
            customerList = cust;
            searchCustomers();
        })
        .catch(err => {
            console.log(err);
        });

    mockData()
        .then(data => {
            productList = data;
            queryProducts();
        })
        .catch(err => {
            console.log(err);
        });
});

$('form[name=search] input').on('input', debounce(searchCustomers, 300));
$(() => {
    getCustomers();
    getProducts();
});

// Test code below here

const request = {
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    },
    method: 'get',
    credentials: 'include',
    mode: 'cors'
};

const getTestSql = () => {
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
            data = JSON.parse(data);
            console.log(data[0]);
            return data[0];
        })
        .catch(err => {
            console.log(err);
        });
};