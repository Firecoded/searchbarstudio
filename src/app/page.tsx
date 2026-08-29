export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="mb-10 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent">
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.3"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
          </svg>
        </span>
        <span className="text-lg font-extrabold tracking-tight">
          Searchbar<span className="text-accent">Studio</span>
        </span>
      </div>

      <h1 className="max-w-2xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-balance">
        The website your business has been{" "}
        <em className="italic text-accent">searching</em> for.
      </h1>
      <p className="mt-5 max-w-md text-lg text-muted">
        Websites built, hosted, and looked after for small businesses. The full
        site is on its way.
      </p>

      <a
        href="mailto:hello@searchbarstudio.com"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-accent-ink transition-colors hover:opacity-90"
      >
        Get in touch
      </a>
    </main>
  );
}
