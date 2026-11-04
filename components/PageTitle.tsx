import { eyebrow } from '@/lib/ui';

export default function PageTitle({ label, title }: { label: string; title: string }) {
  return (
    <section className="pt-[18px] pb-9">
      <span className={eyebrow}>{label}</span>
      <h1 className="mt-7 max-w-[20ch] font-display text-[clamp(32px,5vw,64px)] leading-[1.02] font-black tracking-tight">
        {title}
      </h1>
    </section>
  );
}
