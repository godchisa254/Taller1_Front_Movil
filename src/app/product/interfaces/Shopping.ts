export interface GetCartResponse {
    id:         number;
    name:       string;
    price:      number;
    image:      string;
    quantity:   number;
    totalPrice: number;
}
export interface addCartResponse {
    name:       string;
    price:      number;
    quantity:   number;
    totalPrice: number;
}