const orderCustomerFormat = [
    'orderDate',
    'company',
    'orderID',
    'total'
]

const orderProductFormat = [
    'name',
    'quantity',
    'price'
];

const getOrders = () => {
    return makeRequest('ViewOrders');
};

const getIndexFromArray = (lineItem, orders) => {
    for (let i = 0; i < orders.length; i++) {
        if (lineItem.OrderID === orders[i].orderID) {
            return i;
        }
    }
    return undefined;
};

const getOrderFromLineItem = (data) => {
    let newOrder = {
        company: data.CompanyName,
        // really complicated parse of '/Date(1234567890123)/' to a JS Date
        // object, to an ISO string with the time portion removed
        orderDate: new Date(parseInt(data.OrderDate.split('(')[1].split(')')[0])).toISOString().split('T')[0],
        orderID: data.OrderID,
        total: data.TotalAmount,
        products: []
    };
    return newOrder;
};

const getProductFromLineItem = (data) => {
    let newProduct = {
        name: data.ProductName,
        quantity: data.Quantity,
        price: data.UnitPrice
    };
    return newProduct;
};

const formatLineItemsIntoOrder = (data) => {
    let orders = [];
    for (let i = 0; i < data.length; i++) {
        let index = getIndexFromArray(data[i], orders);

        if (!index) {
            orders.push(getOrderFromLineItem(data[i]));
            index = orders.length - 1;
        }
        orders[index].products.push(getProductFromLineItem(data[i]));
    }
    return orders;
};

const createHtml = (orders) => {
    let orderTable = $('#orders table');
    for (let i = 0; i < orders.length; i++) {
        let row = $('<tr>');
        row.addClass('order');
        for (let j = 0; j < orderCustomerFormat.length; j++) {
            let title = $('<td>');
            title.html(orders[i][orderCustomerFormat[j]]);
            row.append(title);
        }
        orderTable.append(row);
        for (let k = 0; k < orders[i].products.length; k++) {
            let row = $('<tr>');
            row.addClass('item');
            row.append($('<td>'));
            for (let j = 0; j < orderProductFormat.length; j++) {
                let productInfo = $('<td>');
                productInfo.html(orders[i].products[k][orderProductFormat[j]]);
                row.append(productInfo);
            }
            orderTable.append(row);
        }
    }
};

$(() => {
    getOrders()
        .then(data => {
            let orders = formatLineItemsIntoOrder(data);
            createHtml(orders);
            console.log(orders);
        })
        .catch(err => {
            console.log(err);
        });
});