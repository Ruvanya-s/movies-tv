import { eyebrow } from '@/lib/ui';

export default function PageTitle({ label, title }: { label?: string; title: string }) {
  return (
    <section className="pt-10 pb-7 md:pt-14">
      {label && <span className={`${eyebrow} mb-4`}>{label}</span>}
      <h1 className="text-coral w-fit max-w-[20ch] pb-1 font-display text-[clamp(36px,5vw,64px)] leading-[1.05] font-extrabold tracking-tight">
        {title}
      </h1>
    </section>
  );
}
