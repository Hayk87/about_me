export interface UpdateProductInterface {
  code: string;
  link?: string;
  title: Record<string, string>;
  content: Record<string, string>;
  category_id: number;
  price: number;
  removedFiles: string[];
}
