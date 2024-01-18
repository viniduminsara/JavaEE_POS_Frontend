export class OrderModel{
    constructor(orderId, date, customerId, subTotal, discount) {
        this.orderId = orderId;
        this.date = date;
        this.customerId = customerId;
        this.subTotal = subTotal;
        this.discount = discount;
    }
}