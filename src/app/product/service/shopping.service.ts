import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { addCartResponse } from '../interfaces/Shopping';
import { lastValueFrom, Observable } from 'rxjs';
import { GetCartResponse } from '../interfaces/Shopping';

@Injectable({
  providedIn: 'root',
})
export class ShoppingService {
  private baseUrl = 'http://localhost:5290/api/ShoppingCart';
  private http = inject(HttpClient);

  //POST: Agregar producto al carro
  async addProduct(
    productId: number,
    quantity: number
  ): Promise<addCartResponse> {
    try {
      const Parameters = {
        productId: productId,
        quantity: quantity,
      };
      const response = await lastValueFrom(
        this.http.post<addCartResponse>(
          `${this.baseUrl}/add_product`,
          Parameters
        )
      );
      return Promise.resolve(response);
    } catch (error) {
      let errorMessage = 'Ha habido un error con el servidor.';
      if (error instanceof HttpErrorResponse) {
        if (error.error && Array.isArray(error.error)) {
          return Promise.reject(error.error);
        } else if (error.error && typeof error.error === 'string') {
          return Promise.reject([error.error]);
        } else if (
          error.error &&
          typeof error.error === 'object' &&
          error.error.message
        ) {
          return Promise.reject([error.error.message]);
        }
      }
      return Promise.reject(errorMessage);
    }
  }

  //GET: obtener productos
  getCart(): Observable<GetCartResponse[]> {
    return this.http.get<GetCartResponse[]>(this.baseUrl);
  }

  //POST: reducir en una unidad
  async decressProduct(
    productId: number,
    quantity: number
  ): Promise<addCartResponse> {
    try {
      const Parameters = {
        productId: productId,
        quantity: quantity,
      };

      const response = await lastValueFrom(
        this.http.post<addCartResponse>(
          `${this.baseUrl}/deduct_product`,
          Parameters
        )
      );

      return Promise.resolve(response);
    } catch (error) {
      let errorMessage = 'Error desconocido';

      if (error instanceof HttpErrorResponse) {
        if (error.error && Array.isArray(error.error)) {
          return Promise.reject(error.error);
        } else if (error.error && typeof error.error === 'string') {
          return Promise.reject([error.error]);
        } else if (
          error.error &&
          typeof error.error === 'object' &&
          error.error.message
        ) {
          return Promise.reject([error.error.message]);
        }
      }

      return Promise.reject(errorMessage);
    }
  }

  //DELETE: Remover producto carro
  async removeProduct(productId: number): Promise<addCartResponse> {
    try {
      const response = await lastValueFrom(
        this.http.delete<addCartResponse>(`${this.baseUrl}/remove_product`, {
          body: productId,
        })
      );
      return response;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.error && Array.isArray(error.error)) {
          throw error.error;
        } else if (error.error && typeof error.error === 'string') {
          throw [error.error];
        } else if (error.error?.message) {
          throw [error.error.message];
        }
      }
      throw ['Error desconocido'];
    }
  }
}
