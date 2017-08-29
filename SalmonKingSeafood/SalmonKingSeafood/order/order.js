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

const requestObject = {
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    },
    method: 'get',
    credentials: 'include',
    mode: 'cors'
};

const makeRequest = (funcName, data) => {
    let request = JSON.parse(JSON.stringify(requestObject));

    if (data) {
        request.body = JSON.stringify(data);
    }

    return fetch('/BackEnd.asmx/' + funcName, request)
        .then(response => {
            return response.json();
        })
        .then(data => {
            data = JSON.parse(data.d);
            console.log(data);
            return data;
        })
        .catch(err => {
            console.log(err);
        });
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
    return makeRequest('GetProducts');
};

const getCustomers = () => {
    return makeRequest('GetCustomers');
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

const searchProducts = () => {
    productHtml.empty();
    productHtml.append(productHeaders);
    
    for (let i = 0; i < productList.length; i++) {
        let newRow = $('<tr>');
        newRow.append('<td><input name="select-product" type="checkbox" id=' + i + ' value=' + i + ' /></td>');
        for (let j = 0; j < productFormat.length; j++) {
            if (productFormat[j] === 'Quantity') {
                let quantityInput = $('<td><input type="number" name="quantity' + i + '" value=0 /></td>');
                quantityInput.on('input', (e) => {
                    let row = newRow.children('td');
                    row[5].innerHTML = (e.target.value * row[4].innerHTML);
                });
                newRow.append(quantityInput);
            } else
                newRow.append('<td>' + productList[i][productFormat[j]] + '</td>');
        }
        productHtml.append(newRow);
    }
    $('#product-list input[type=checkbox]').on('click', (event) => {
        console.log(event.target.value);
        //setSelected(event.target.value);
    });
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
        searchProducts();
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

    getProducts()
        .then(data => {
            productList = [];
            for (let i = 0; i < data.length; i++) {
                data[i].Quantity = 0;
                data[i].Price = 0;
                data[i].Existence = 0;
                data[i].Ordered = 0;
            }
            productList = data;
            searchProducts();
        })
        .catch(err => {
            console.log(err);
        });
});

$('form[name=search] input').on('input', debounce(searchCustomers, 300));

$('form[name=tax]').on('submit', (event) => {
    let orderData = {};
    orderData.customerID = customerList[$('#customer-list input[type=radio]:checked').val()].CustomerID;

    orderData.products = [];
    let productsSelected = $('#product-list input[type=checkbox]:checked');
    let productsRow = $('#product-list table tr');
    for (let i = 0; i < productsSelected.length; i++) {
        let index = parseInt(productsSelected.eq(i).val());
        let productID = productList[index].ProductID;
        let productQuantity = parseInt($(productsRow[index + 1]).find('input[type=number]').val());
        orderData.products.push({ id: productID, quantity: productQuantity });
    }

    console.log(orderData);

    event.preventDefault();
    event.returnValue = false;
    return false;
});