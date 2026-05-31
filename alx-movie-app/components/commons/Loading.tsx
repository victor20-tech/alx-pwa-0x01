const Loading: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-6 backdrop-blur-md"
      role="status"
      aria-live="polite"
    >
      <div className="glass-panel max-w-md rounded-2xl px-10 py-10 text-center">
        <div
          className="mx-auto mb-6 h-14 w-14 rounded-full border-2 border-white/10 border-t-accent animate-spin"
          aria-hidden
        />
        <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
          Loading titles
        </h2>
        <p className="mt-3 text-sm text-muted md:text-base">
          Hang tight—we&apos;re lining up the next batch of films for you.
        </p>
      </div>
    </div>
  );
};

export default Loading;
