import { IonicModule } from '@ionic/angular';
import { Component, inject, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductId, ProductResponseGet } from '../../interfaces/Product';
import { ProductsService } from '../../service/products.service';
import { ProductsCardComponent } from '../../component/card/card.component';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ProductsCardComponent],
})
export class ListComponent implements OnInit {
  productTypes: ProductId[] = [];

  // Search filters
  selectedCategoryName: string = 'Seleccionar categoría';
  selectedCategoryId: number = 0;
  searchQuery: string = '';
  sortBy: string = '';
  isDescending: boolean | null = null;
  currentPage: number = 1;
  pageSize: number = 10; // 10 artículos por página
  totalPages: number = 1;
  filteredProducts: ProductResponseGet[] = [];

  products: ProductResponseGet[] = [];
  private productsService = inject(ProductsService);
  loading = true;
  product: ProductResponseGet = {
    id: 0,
    productTypeID: 1,
    name: '',
    price: 0,
    stock: 0,
    image: '',
  };
  error: boolean = false;
  errorMessage: string[] = [];

  ngOnInit(): void {
    this.fetchProducts();
    this.loadProductTypes();
  }

  async loadProductTypes() {
    try {
      this.productTypes = await this.productsService.getProductTypes();
    } catch (error) {
      this.error = true;
      this.errorMessage.push(
        'Error de comunicación con el servidor, vuelva a intentarlo más tarde.'
      );
    }
  }

  onCategorySelect(id: number, type: string) {
    this.selectedCategoryName = type;
    this.selectedCategoryId = id;
    this.fetchProducts();
  }

  onPriceSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'menorAmayor') {
      this.sortBy = 'Price';
      this.isDescending = false;
    } else if (value === 'mayorAmenor') {
      this.sortBy = 'Price';
      this.isDescending = true;
    } else {
      this.sortBy = '';
      this.isDescending = null;
    }
    this.fetchProducts();
  }

  async fetchProducts(): Promise<void> {
    this.loading = true;
    try {
      let response = await this.productsService.getProducts(
        this.selectedCategoryId,
        this.searchQuery,
        this.sortBy,
        this.isDescending ?? false,
        this.currentPage,
        this.pageSize
      );

      this.filteredProducts = response.items.filter(
        (product) => product.stock > 0
      ); // filtrar productos con stock > 0 solo si es la vista de cartas
      this.products = response.items;

      this.totalPages = response.totalPages;
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      this.loading = false;
    }
  }

  async nextPage(): Promise<void> {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      await this.fetchProducts();
    }
  }

  async previousPage(): Promise<void> {
    if (this.currentPage > 1) {
      this.currentPage--;
      await this.fetchProducts();
    }
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.searchQuery = query;

    if (query) {
      this.currentPage = 1;
    }
    this.fetchProducts();
  }
}
