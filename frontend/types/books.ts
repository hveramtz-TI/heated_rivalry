export interface RetailerLink {
  provider: string;
  url: string;
}

export interface Book {
  id: string;
  title?: string;
  cover?: string;
  description?: string;
  published?: string;
  pages?: number;
  purchaseUrls?: RetailerLink[];
}
