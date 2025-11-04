export interface UpdateProductInterface {
  code: string;
  link?: string;
  title: Record<string, string>;
  short_content?: Record<string, string>;
  content: Record<string, string>;
  category_id: number;
  price: number;
  removedFiles: string[];
}
