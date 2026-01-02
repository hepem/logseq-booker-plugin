export type Book = {
  isbn: string;
  title: string;
  authors: string[];
  pages: number;
  dateAdded?: string;
  dateFinished?: string;
  rating?: number;
  review?: string;
};