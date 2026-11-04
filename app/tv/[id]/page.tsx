import type { Metadata } from 'next';
import DetailView, { detailMetadata } from '@/components/DetailView';

export const revalidate = 86400; // refresh each page at most once a day

// Pages are rendered on first visit, then cached (incremental static regeneration).
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return detailMetadata('tv', id);
}

export default async function TvPage({ params }: Props) {
  const { id } = await params;
  return <DetailView type="tv" id={id} />;
}
