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
    method: 'GET',
    credentials: 'include',
    mode: 'cors'
};

const makeRequest = (funcName, data) => {
    let request = JSON.parse(JSON.stringify(requestObject));

    if (data) {
        request.body = JSON.stringify(data);
        request.method = 'POST';
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

const getProducts = () => {
    return makeRequest('GetProducts');
};

const getCustomers = () => {
    return makeRequest('GetCustomers');
};

const getTax = () => {
    return makeRequest('GetTax');
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

const returnStatus = { success: "Completed", fail: "Failed" };
let orderSuccess = false;

let currentOrderData = {customerID: undefined, products: []};

let currentSalesTax;
let currentShipping = 15;

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
                    updateOrderData();
                });
                newRow.append(quantityInput);
            } else
                newRow.append('<td>' + productList[i][productFormat[j]] + '</td>');
        }
        productHtml.append(newRow);
    }
    $('#product-list input[type=checkbox]').on('click', (event) => {
        updateOrderData();
    });
};

const searchCustomers = () => {
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
        setSelected(event.target.value);
        updateOrderData();
    });
};

const resetForm = () => {
    if (orderSuccess) {
        $('input').val('');
        $('input:checked').prop('checked', false);
        $('input[type=number]').val('0.00');
        productHtml.find('input[type=number]').val('0');
        $('input[type=number]').trigger('input');
    }
};

const updateOrderData = () => {
    let orderData = {};
    try {
        orderData.customerID = customerList[$('#customer-list input[type=radio]:checked').val()].CustomerID;
    } catch (e) {
        orderData.customerID = undefined;
    }

    orderData.products = [];
    let productsSelected = $('#product-list input[type=checkbox]:checked');
    let productsRow = $('#product-list table tr');
    for (let i = 0; i < productsSelected.length; i++) {
        let index = parseInt(productsSelected.eq(i).val());
        let productID = productList[index].ProductID;
        let productQuantity = parseInt($(productsRow[index + 1]).find('input[type=number]').val());
        orderData.products.push({ id: productID, quantity: productQuantity });
    }

    currentOrderData = orderData;
    updateTotals();
};

const findProductById = (id) => {
    for (let i = 0; i < productList.length; i++) {
        if (productList[i].ProductID === id)
            return productList[i];
    }
    return undefined;
};

const updateTotals = () => {
    $('input[name=sales-tax]').val(currentSalesTax.toFixed(2));
    $('input[name=shipping]').val(currentShipping.toFixed(2));
    let subTotal = currentOrderData.products.reduce((total, productCart) => {
        let product = findProductById(productCart.id);
        return total + (product.UnitPrice * productCart.quantity);
    }, 0);
    $('input[name=sub-total]').val(subTotal.toFixed(2));
    $('input[name=total]').val((((1 + currentSalesTax) * subTotal) + currentShipping).toFixed(2));
};

const showModal = (title, body, success = false) => {
    $('.modal-title').html(title);
    $('.modal-body').html(body);
    orderSuccess = success;
    $('#ajaxStatus').modal('show');
}

$(() => {
    let custProm = getCustomers()
        .then(cust => {
            customerList = cust;
            searchCustomers();
        })
        .catch(err => {
            console.log(err);
        });

    let prodProm = getProducts()
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

    let taxProm = getTax()
        .then(data => {
            currentSalesTax = data[0].TaxPercent;
        })
        .catch(err => {
            console.log(err);
        });

    Promise.all([custProm, prodProm, taxProm])
        .then(() => {
            updateTotals();
        });
});

$('form[name=search] input').on('input', debounce(searchCustomers, 300));

$('form[name=tax]').on('submit', (event) => {
    event.preventDefault();
    event.returnValue = false;

    let orderData = currentOrderData;

    if (!orderData.customerID) {
        showModal('Order: Failed!', 'Please make sure you select a customer first!', false);
        return false;
    }

    if (orderData.products.length == 0) {
        showModal('Order: Failed!', 'Please make sure you select at least one product!', false);
        return false;
    }

    makeRequest('CreateOrder', orderData)
        .then(data => {
            if (data.ReturnValue == returnStatus.success) {
                showModal('Order: Completed!', 'We will clear the form for you so you don\'t accidentally make another order.', true);
            } else {
                showModal('Order: Failed!', 'Something went wrong! Please try again!', false);
            }
        });

    return false;
});

$('#ajaxStatus').on('hide.bs.modal', resetForm);