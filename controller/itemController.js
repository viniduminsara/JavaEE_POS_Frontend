import {ItemModel} from "../model/itemModel.js";
import {item_db} from "../db/db.js";
import {setItemIds} from "./orderController.js";
import {setCounts} from "./indexController.js";

//item form
const item_Code = $('#itemCode');
const description = $('#description');
const unit_price = $('#unitPrice');
const qty = $('#qty');
const item_btns = $('#item_btn button');
const item_search = $('#item_search input');
const item_search_select = $('#item_search select');

item_Code.val(generateItemId());

//add item
item_btns.eq(0).on('click', () => {
   let itemCode = item_Code.val().trim();
   let desc = description.val().trim();
   let price = parseFloat(unit_price.val().trim());
   let qty_val = parseInt(qty.val());

   if (validate(itemCode, 'item code') && validate(desc, 'description') &&
   validate(price, 'unit price') && validate(qty_val, 'qty on hand')) {

       let item = new ItemModel(itemCode, desc, price, qty_val);

       if (getItemIndex(itemCode) < 0) {
           Swal.fire({
               title: 'Do you want to save the changes?',
               showDenyButton: true,
               confirmButtonText: 'Save',
               denyButtonText: `Don't save`,
           }).then((result) => {
               if (result.isConfirmed) {
                   item_db.push(item);
                   loadItemTable();
                   item_btns.eq(3).click();
                   item_Code.val(generateItemId());
                   setItemIds();
                   setCounts();

                   Swal.fire('Item Saved!', '', 'success');

               } else if (result.isDenied) {
                   Swal.fire('Changes are not saved', '', 'info')
               }
           });
       } else {
           Swal.fire({
               icon: 'error',
               title: 'Item is already exists 😔',
           });
       }
   }
});

//update item
item_btns.eq(1).on('click', () => {
    let itemCode = item_Code.val().trim();
    let desc = description.val().trim();
    let price = parseFloat(unit_price.val().trim());
    let qty_val = parseInt(qty.val());

    if (validate(itemCode, 'item code') && validate(desc, 'description') &&
        validate(price, 'unit price') && validate(qty_val, 'qty on hand')) {

        let item = new ItemModel(itemCode, desc, price, qty_val);
        let index = getItemIndex(itemCode);

        if (index >= 0) {
            Swal.fire({
                title: 'Do you want to update the item?',
                showDenyButton: true,
                confirmButtonText: 'Update',
                denyButtonText: `Don't update`,
            }).then((result) => {
                if (result.isConfirmed) {
                    item_db[index] = item;
                    loadItemTable();
                    item_btns.eq(3).click();
                    item_Code.val(generateItemId());
                    setItemIds();

                    Swal.fire('Item Updated!', '', 'success');

                } else if (result.isDenied) {
                    Swal.fire('Changes are not updated!', '', 'info')
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Item did not exists 😓',
            });
        }
    }
});

//delete item
item_btns.eq(2).on('click', () => {
    let itemCode = item_Code.val().trim();

    if (validate(itemCode, 'item code')) {

        let index = getItemIndex(itemCode);
        if (index >= 0) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    item_db.splice(index, 1);
                    loadItemTable();
                    item_btns.eq(3).click();
                    item_Code.val(generateItemId());
                    setItemIds();
                    setCounts();

                    Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Customer did not exists 😓',
            });
        }
    }
});

//item search
item_search.on('input', function (){
    let option = item_search_select.find(':selected').text();
    let searchTerm = item_search.val().trim().toLowerCase();
    let matchingItems = item_db.filter(item => item[option].toLowerCase() === searchTerm);

    if (matchingItems.length > 0){
        $('tbody').eq(1).empty();
        matchingItems.forEach(item => {
            $('tbody').eq(1).append(
                `<tr>
                    <th scope="row">${item.item_code}</th>
                    <td>${item.description}</td>
                    <td>${item.unit_price}</td>
                    <td>${item.qty}</td>
                 </tr>`
            );
        });
    }else{
        loadItemTable();
    }
});

//load item
$('tbody').eq(1).on('click', 'tr', function() {
    let itemCode = $(this).find('th').eq(0).text();
    let index = getItemIndex(itemCode);

    item_Code.val(item_db[index].item_code);
    description.val(item_db[index].description);
    unit_price.val(item_db[index].unit_price);
    qty.val(item_db[index].qty);
});

//load the item table
export const loadItemTable = function () {
    $('tbody').eq(1).empty();
    item_db.map((index) => {
        $('tbody').eq(1).append(
            `<tr>
            <th scope="row">${index.item_code}</th>
            <td>${index.description}</td>
            <td>${index.unit_price}</td>
            <td>${index.qty}</td>
         </tr>`
        );
    });
}

loadItemTable();

const getItemIndex = function (itemCode){
    return item_db.findIndex(item => item.item_code === itemCode);
}

function validate(value, field_name){
    if (!value){
        Swal.fire({
            icon: 'warning',
            title: `Please enter the ${field_name}!`
        });
        return false;
    }
    return true;
}

function generateItemId(){
    let lastId = 'I-001'; // Default if array is empty

    if (item_db.length > 0){
        let lastElement = item_db[item_db.length - 1].item_code;
        let lastIdParts = lastElement.split('-');
        let lastNumber = parseInt(lastIdParts[1]);

        lastId = `I-${String(lastNumber + 1).padStart(3, '0')}`;
    }

    return lastId;
}

