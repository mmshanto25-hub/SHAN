import React from 'react';
import { ArrowDownToLine, ArrowLeft } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

export const ResumePage: React.FC = () => {
  const { data } = usePortfolio();
  const resumeUrl = data.settings.resumeFileUrl;
  const resumeFileName = data.settings.resumeFileName || 'Resume.pdf';

  return (
    <main className="fixed inset-0 z-50 overflow-hidden bg-zinc-950 text-zinc-100">
      <iframe
        key={resumeUrl}
        src={`${resumeUrl}#view=FitH`}
        title={`${data.settings.name} CV`}
        className="absolute inset-0 h-full w-full border-0 bg-white"
      />
      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-4 bg-gradient-to-b from-black/70 to-transparent p-4 sm:p-6">
          <a
            href="/"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-lg border border-white/15 bg-zinc-950/80 px-4 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur transition-colors hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </a>
          <a
            href={resumeUrl}
            download={resumeFileName}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg transition-colors hover:bg-zinc-200"
          >
            <ArrowDownToLine className="h-4 w-4" />
            {data.settings.downloadCvLabel || 'Download CV'}
          </a>
      </header>
    </main>
  );
};
