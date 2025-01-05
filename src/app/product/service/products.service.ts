import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpClientModule,
} from '@angular/common/http';
import { Observable, catchError, firstValueFrom, throwError } from 'rxjs';
import {
  PaginatedResponse,
  ProductResponseGet,
  ProductResponseCreate,
  ProductId,
  ProductResponseUpdate,
} from '../interfaces/Product';
import { CommonModule } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrl = 'http://localhost:5290/api/Product';
  private http = inject(HttpClient);

  // GET: Obtener productos con o sin filtros
  async getProducts(
    ProductTypeID: number = 0,
    name: string = '',
    sortBy: string = '',
    isDescending: boolean = true,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<ProductResponseGet>> {
    try {
      let params = new HttpParams() 
        .set('Name', name)
        .set('SortBy', sortBy)
        .set('IsDescending', isDescending.toString())
        .set('PageNumber', pageNumber.toString())
        .set('PageSize', pageSize.toString());
 
      if (ProductTypeID !== 0) {
        params = params.set('ProductTypeID', ProductTypeID.toString());
      }
        
      const response = await firstValueFrom(
        this.http.get<PaginatedResponse<ProductResponseGet>>(this.baseUrl, { params })
      );

      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // GET: Obtener producto por id
  async getProductById(id: number): Promise<ProductResponseGet> {
    try {
      const url = `${this.baseUrl}/${id}`;
      const response = await firstValueFrom(
        this.http
          .get<ProductResponseGet>(url)
          .pipe(catchError(this.handleError))
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // POST: Crear producto
  async createProduct(product: FormData): Promise<ProductResponseCreate> {
    try {
      const response = await firstValueFrom(
        this.http
          .post<ProductResponseCreate>(this.baseUrl, product)
          .pipe(catchError(this.handleError))
      );
      return response;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // PUT: Editar producto por id
  async updateProduct(
    id: number,
    product: FormData
  ): Promise<ProductResponseGet> {
    try {
      const url = `${this.baseUrl}/${id}`;
      const response = await firstValueFrom(
        this.http
          .put<ProductResponseGet>(url, product)
          .pipe(catchError(this.handleError))
      );
      return response;
    } catch (error) {
      console.error('Error updating products:', error);
      throw error;
    }
  }

  // DELETE: Borrar producto por id
  async deleteProduct(id: number): Promise<ProductResponseGet> {
    try {
      const url = `${this.baseUrl}/${id}`;
      const response = await firstValueFrom(
        this.http
          .delete<ProductResponseGet>(url)
          .pipe(catchError(this.handleError))
      );
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // GET: Obtener tipos de productos
  async getProductTypes(): Promise<ProductId[]> {
    const url = `${this.baseUrl}/types`;

    try {
      const response = await firstValueFrom(
        this.http.get<ProductId[]>(url).pipe(
          catchError((error) => {
            return throwError(error);
          })
        )
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  handleError(error: any) {
    console.error('HTTP Error occurred:', error);

    if (error?.error?.errors) {
      const errorMessages: any[] = [];

      for (const field in error.error.errors) {
        if (error.error.errors.hasOwnProperty(field)) {
          errorMessages.push(...error.error.errors[field]);
        }
      }

      if (errorMessages.length > 0) {
        return throwError(() => new Error(errorMessages.join(', ')));
      }
    }

    return throwError(() => new Error('An unexpected error occurred.'));
  }
}
