type SeoProps = {
  title?: string;
  description?: string;
  image?: string | null;
  /** Set to true for pages that shouldn't appear in Google (e.g. search results). */
  noindex?: boolean;
};

const SITE = 'SlateQue';
const DEFAULT_TITLE = 'SlateQue - Find your next favorite Movie or TV show';

/**
 * Sets the page <title> and meta tags. React 19 moves these into <head> automatically,
 * so each page can describe itself.
 */
export default function Seo({ title, description, image, noindex }: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE}` : DEFAULT_TITLE;
  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {noindex && <meta name="robots" content="noindex, follow" />}
    </>
  );
}
