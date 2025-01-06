export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    totalPages: number;
  }
  
export interface ProductResponseGet {
    id:            number;
    productTypeID: number;
    name:          string;
    price:         number;
    stock:         number;
    image:         string;
}

export interface ProductResponseCreate { 
  productTypeID: number;
  name:          string;
  price:         number;
  stock:         number;
  image:         File;
}

export interface ProductResponseUpdate { 
  id:            number;
  productTypeID?: number; 
  name?: string; 
  price?: number; 
  stock?: number; 
  image?: File; 
}

export interface ProductId { 
  id:            number;
  type:          string;
}