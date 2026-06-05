// Blog article index — mirrors the `ARTICLES` table inside canon `marketing/seo.jsx`
// (not exported by canon). Drives /blog/[slug] routing + per-article <title>/JSON-LD.
// NOTE: canon 0.4.0 `PdBlogArticle` renders ONE fully-written article body (template);
// the other two share that template until Claude Design writes their copy. Blog is a
// supply-warmup surface (semantic core §2: «на паузе») — secondary to the geo pages.
export type BlogArticle = {
  id: string; // URL slug
  tag: string;
  img: string; // unsplash photo id
  title: string;
  excerpt: string;
  read: string;
};

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'kuda-det-buket',
    tag: 'Продавцу',
    img: '1567418938902-aa650a3eb346',
    title: 'Куда деть подаренный букет вместо мусорки',
    excerpt:
      'Подарили цветы, а дома ставить некуда? Пять способов дать букету вторую жизнь — и вернуть часть денег.',
    read: '4 мин',
  },
  {
    id: 'cvety-posle-prazdnika',
    tag: 'Уход',
    img: '1581938165093-050aeb5ef218',
    title: 'Что делать с цветами после праздника',
    excerpt:
      'Большой букет отжил своё на столе, но цветы ещё свежие. Как не выбросить красивое и кому оно нужно.',
    read: '5 мин',
  },
  {
    id: 'prodlit-zhizn-buketu',
    tag: 'Уход',
    img: '1561181286-d3fee7d55364',
    title: 'Как продлить жизнь срезанному букету',
    excerpt:
      'Простые приёмы, от подрезки стеблей до воды и места: чтобы букет простоял на несколько дней дольше.',
    read: '6 мин',
  },
];

export function blogArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.id === slug);
}
