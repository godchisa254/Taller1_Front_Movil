import { Component, inject, OnInit } from '@angular/core';
import { ShoppingService } from '../../service/shopping.service';  
import { GetCartResponse, addCartResponse } from '../../interfaces/Shopping';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  imports: [IonicModule],
})
export class CartComponent implements OnInit {

  cartItems: GetCartResponse[] = [];
  totalPrice: number = 0;

  private readonly shoppingService = inject(ShoppingService);
  constructor(private router: Router) { }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() { 
    this.shoppingService.getCart().subscribe(
      (items: GetCartResponse[]) => {
        this.cartItems = items;
        this.calculateTotalPrice();
      },
      error => {
        console.error('Error loading cart', error);
      }
    );
  }
 
  increaseQuantity(productId: number, currentQuantity: number) {
    this.shoppingService.addProduct(productId, currentQuantity + 1).then(() => {
      this.loadCart();
    }).catch(error => {
      console.error('Error increasing quantity', error);
    });
  }
 
  decreaseQuantity(productId: number, currentQuantity: number) {
    if (currentQuantity > 1) {
      this.shoppingService.decressProduct(productId, currentQuantity - 1).then(() => {
        this.loadCart();
      }).catch(error => {
        console.error('Error decreasing quantity', error);
      });
    }
  }
 
  removeItem(productId: number) {
    this.shoppingService.removeProduct(productId).then(() => {
      this.loadCart();
    }).catch(error => {
      console.error('Error removing item', error);
    });
  }
 
  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }
  navigateTo(route: string) {
    this.router.navigate([`tabs${route}`]);
  }
}
