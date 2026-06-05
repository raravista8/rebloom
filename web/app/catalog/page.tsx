import { redirect } from 'next/navigation';

// Canon marketing pages link «Весь каталог букетов» → /catalog. The public catalog
// surface is the home landing (live feed). Redirect there so guests stay on a public
// page (the in-app /search sits behind auth).
export default function CatalogPage() {
  redirect('/');
}
