type NoticeProps = { title: string; text?: string };

export function Notice({ title, text }: NoticeProps) {
  return (
    <div className="mx-auto mt-12 mb-16 max-w-3xl rounded-2xl border border-border bg-surface px-6 py-10 text-center md:mt-20">
      <h2 className="font-display text-xl font-bold tracking-tight md:text-[28px]">{title}</h2>
      {text && <p className="mt-3.5 text-base text-muted md:text-xl">{text}</p>}
    </div>
  );
}

export function NotConnected() {
  return (
    <Notice
      title="Movie data isn't connected yet"
      text="Add a TMDB API key to start showing movies and TV shows."
    />
  );
}
