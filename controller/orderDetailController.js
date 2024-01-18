import {item_db, order_db, order_details_db} from "../db/db.js";

const order_id = $('#order_detail_id');
const customer_id = $('#order_detail_customer_id');
const date = $('#order_details_date');
const discount = $('#order_details_discount');
const order_search = $('#order_detail_search input');
const order_search_option = $('#order_detail_search select');


order_id.on('input', loadOrderDetails);

$('tbody').eq(3).on('click', 'tr', function() {
    order_id.val($(this).find('th').eq(0).text());
    customer_id.val($(this).find('td').eq(0).text());
    date.val($(this).find('td').eq(1).text());
    loadOrderDetails();
});

//search order
order_search.on('input', function (){
    let option = order_search_option.find(":selected").text();
    let searchTerm = order_search.val().trim().toLowerCase();
    let matchingOrders = order_db.filter(order => order[option].toLowerCase() === searchTerm);

    if (matchingOrders.length > 0) {
        $('tbody').eq(3).empty();
        matchingOrders.forEach(order => {
            $('tbody').eq(3).append(
                `<tr>
                <th scope="row">${order.orderId}</th>
                <td>${order.customerId}</td>
                <td>${order.date}</td>
             </tr>`
            );
        });
    }else{
        loadOrderTable();
    }
});

function loadOrderDetails() {
    let orderId = order_id.val();
    let index = order_db.findIndex(order => order.orderId === orderId);
    if (index >= 0){
        customer_id.val(order_db[index].customerId);
        date.val(order_db[index].date);
        discount.val(order_db[index].discount);

        $('tbody').eq(4).empty();
        for(let i=0; i<order_details_db.length; i++){
            if (orderId === order_details_db[i].order_id){
                let total = order_details_db[i].unit_price * order_details_db[i].qty; // TODO
                let item_index = item_db.findIndex(item => item.item_code === order_details_db[i].item_id);

                $('tbody').eq(4).append(
                    `<tr>
                        <th scope="row">${order_details_db[i].item_id}</th>
                        <td>${item_db[item_index].description}</td>
                        <td>${order_details_db[i].unit_price}</td>
                        <td>${order_details_db[i].qty}</td>
                        <td>${total}</td>
                     </tr>`
                );
            }
        }
    }else{
        customer_id.val('');
        date.val('');
        $('tbody').eq(4).empty();
    }
}

export function loadOrderTable(){
    $('tbody').eq(3).empty();
    order_db.map((order) => {
        $('tbody').eq(3).append(
            `<tr>
                <th scope="row">${order.orderId}</th>
                <td>${order.customerId}</td>
                <td>${order.date}</td>
                <td>Rs. ${order.subTotal}</td>
             </tr>`
        )
    })
}
