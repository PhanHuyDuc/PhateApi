export type PagedResult<T> = {
  results: T[];
  pageCount: number;
  totalCount: number;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  saleOff: number;
  type: string;
  brand: string;
  quantityInStock: number;
  slug: string;
  rating: any;
  numReview: number;
  multiImages: MultiImage[];
};

export type MultiImage = {
  id: string;
  url: string;
  publicId: string;
  productId: number;
  isMain: boolean;
};

export type Account = {
  displayName: string;
  email: string;
  id: string;
  pictureUrl: string;
  bio: string;
  roles: string[];
};

export type RegisterInput = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
};