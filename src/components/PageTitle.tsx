import { eyebrow } from '@/lib/ui';

type PageTitleProps = { label?: string; title: string; center?: boolean };

export default function PageTitle({ label, title, center = false }: PageTitleProps) {
  return (
    <section className={`pt-10 pb-7 md:pt-14 ${center ? 'text-center' : ''}`}>
      {label && <span className={`${eyebrow} mb-4`}>{label}</span>}
      <h1
        className={`text-coral w-fit max-w-[20ch] pb-1 font-display text-[clamp(36px,5vw,64px)] leading-[1.05] font-extrabold tracking-tight ${
          center ? 'mx-auto' : ''
        }`}
      >
        {title}
      </h1>
    </section>
  );
}
