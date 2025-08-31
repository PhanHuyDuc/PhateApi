export type PagedResult<T> = {
  results: T[];
  pageCount: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  saleOff?: number;
  type: string;
  brand: string;
  quantityInStock?: number;
  slug?: string;
  rating: any;
  numReview?: number;
  multiImages: MultiImage[];
};

export type MultiImage = {
  id?: string;
  url?: string;
  publicId?: string;
  productId?: number;
  isMain?: boolean;
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

export type Banner = {
  id: string;
  title: string;
  description: string;
  url: string;
  publicId: string;
  link: string;
  isActive: boolean;
  bannerCategoryId: string;
  bannerCategory: BannerCategory;
};

export type BannerCategory = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
};

export type Menu = {
  id: number;
  name: string;
  url: string;
  parentId: any;
  parentName: string;
  order: number;
  isActive: boolean;
  type: string;
  level: number;
};

export type Contact = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  description: string;
  isResolve: boolean;
  createdAt: string;
  resolveDate: string;
};

export type WebInfo = {
  id: number;
  title: string;
  metaDescription: string;
  keywords: string;
  email: string;
  phoneNumber: string;
  url: string;
};
