export function KivoFooter() {
  return (
    <footer className="border-t border-kivo-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-kivo-900">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current text-white"
                aria-hidden="true"
              >
                <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
              </svg>
            </div>
            <span className="text-base font-semibold text-kivo-900">Kivo</span>
          </div>
          <p className="text-sm text-kivo-500 text-center sm:text-left">
            Kivo — Life, handled.
          </p>
          <p className="text-xs text-kivo-400 text-center sm:text-right">
            © {new Date().getFullYear()} Kivo. Built for real life, not more tabs.
          </p>
        </div>
      </div>
    </footer>
  );
}
