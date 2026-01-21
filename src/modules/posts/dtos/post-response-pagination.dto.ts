export class PostResponseWithPaginationDTO {
  posts:posts[]
  meta: metaData;
}

type posts = {
  id: number;
  title: string;

  content: string;

  excerpt: string;

  slug: string;

  status: string;

  metaTitle?: string;

  metaDescription?: string;

  ogImage?: string;

  publishedAt: Date;
}
type metaData = {
  page: number;
  limit;
  total: number;
  totalPage: number;
};
