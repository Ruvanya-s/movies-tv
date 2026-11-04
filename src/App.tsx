import { Route, Routes } from 'react-router';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Browse from '@/pages/Browse';
import Search from '@/pages/Search';
import Details from '@/pages/Details';
import NotFound from '@/pages/NotFound';

/** Every URL in the site and the page it shows. */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="browse" element={<Browse />} />
        <Route path="search" element={<Search />} />
        {/* `key` makes React start fresh when switching between a movie and a show. */}
        <Route path="movie/:id" element={<Details key="movie" type="movie" />} />
        <Route path="tv/:id" element={<Details key="tv" type="tv" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
