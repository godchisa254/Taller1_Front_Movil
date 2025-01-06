import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductResponseGet } from '../../interfaces/Product';
import { ProductsService } from '../../service/products.service'; 
import { IonicModule } from '@ionic/angular';
import { ShoppingService } from '../../service/shopping.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'], 
  standalone : true,
  imports: [IonicModule, CommonModule],
  providers:[ProductsService],  
})
export class ProductsCardComponent implements OnChanges  {
  @Input() product!: ProductResponseGet;
  productTypeName: string = '';
  productsService = inject(ProductsService);
  shoppingService = inject(ShoppingService);
  cantidad = 0;
  errorMessage: string[] = []; 
  constructor( ) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      try {
        const productTypes = await this.productsService.getProductTypes();
        const matchedType = productTypes.find(
          (type) => type.id === this.product.productTypeID
        );
        this.productTypeName = matchedType ? matchedType.type : 'Unknown Category';
      } catch (error) {
        console.error('Error fetching product types:', error);
        this.productTypeName = 'Error fetching category';
      }
    }
  }

  async addShoppinCart(productId:number)
  { 
    this.cantidad += 1; 
    try{ 
      console.log("Enviando ID de producto:", productId); 
      if (productId == null) {
        console.error('El ID del producto no es válido');
        return;
      } 
      const response = await this.shoppingService.addProduct(productId,this.cantidad);
      this.cantidad = 0; 
    }catch (errors: any) {
      
      if (Array.isArray(errors)) {
        this.errorMessage = errors;
      } else if (typeof errors === 'string') {
        this.errorMessage = [errors];
      } else {
        this.errorMessage = ['Ocurrió un error desconocido'];
      }
    }

  }
}
