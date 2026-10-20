import { useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Contact,
  FileText,
  FolderKanban,
  Globe,
  LayoutDashboard,
  MessageSquare,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { AdminResourceEditor } from '@/admin/AdminResourceEditor';
import { AdminTab } from '@/admin/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FALLBACK_DATA } from '@/context/PortfolioContext';

const ADMIN_TABS: Array<{ key: AdminTab; label: string; icon: LucideIcon }> = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'hero', label: 'Hero', icon: Sparkles },
  { key: 'about', label: 'About', icon: UserRound },
  { key: 'stats', label: 'Stats', icon: Settings2 },
  { key: 'experience', label: 'Experience', icon: Briefcase },
  { key: 'skills', label: 'Skills', icon: Settings2 },
  { key: 'services', label: 'Services', icon: Building2 },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'testimonials', label: 'Testimonials', icon: Users },
  { key: 'socials', label: 'Socials', icon: Globe },
  { key: 'contact', label: 'Contact', icon: Contact },
  { key: 'resume', label: 'Resume', icon: FileText },
  { key: 'inbox', label: 'Inbox', icon: MessageSquare },
  { key: 'footer', label: 'Footer', icon: ArrowRight },
];

export default function AdminPage() {
  const portfolio = FALLBACK_DATA;
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Stats" value={String(portfolio.stats.length)} detail="Visible metric cards" />
        <StatCard label="Skills" value={String(portfolio.skills.length)} detail={`${portfolio.skillCategories.length} categories`} />
        <StatCard label="Projects" value={String(portfolio.projects.length)} detail="Portfolio showcases" />
        <StatCard label="Messages" value={String(portfolio.contactInfo.length)} detail="Contact entries" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Brand</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">Name:</span> {portfolio.settings.name}</p>
            <p><span className="font-medium text-foreground">Headline:</span> {portfolio.settings.bioHeadline}</p>
            <p><span className="font-medium text-foreground">Tagline:</span> {portfolio.settings.tagline}</p>
            <p><span className="font-medium text-foreground">Status:</span> {portfolio.settings.statusText}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">Footer brand:</span> {portfolio.settings.footerBrandName}</p>
            <p><span className="font-medium text-foreground">WhatsApp:</span> {portfolio.settings.hireMeWhatsappNumber}</p>
            <p><span className="font-medium text-foreground">Resume:</span> {portfolio.resume?.fileName || 'Not uploaded'}</p>
            <p><span className="font-medium text-foreground">Resume URL:</span> {portfolio.resume?.fileUrl || 'Not available'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name" value={portfolio.settings.name} />
          <Field label="First name" value={portfolio.settings.firstName} />
          <Field label="Last name" value={portfolio.settings.lastName} />
          <Field label="Footer brand" value={portfolio.settings.footerBrandName} />
          <Field label="Bio headline" value={portfolio.settings.bioHeadline} className="md:col-span-2" />
          <Field label="Tagline" value={portfolio.settings.tagline} className="md:col-span-2" />
          <Field label="Status text" value={portfolio.settings.statusText} className="md:col-span-2" />
          <Field label="Typing roles (comma separated)" value={portfolio.settings.typingRoles.join(', ')} className="md:col-span-2" />
          <Field label="Hire me button label" value={portfolio.settings.hireMeLabel} />
          <Field label="WhatsApp number" value={portfolio.settings.hireMeWhatsappNumber} />
          <Field label="Download CV label" value={portfolio.settings.downloadCvLabel} />
          <Field label="Hero avatar URL" value={portfolio.settings.heroAvatarUrl} className="md:col-span-2" />
          <Field label="About heading" value={portfolio.settings.aboutHeading} />
          <Field label="About avatar URL" value={portfolio.settings.aboutAvatarUrl} />
          <Field label="About description 1" value={portfolio.settings.aboutDescription1} className="md:col-span-2" multiline />
          <Field label="About description 2" value={portfolio.settings.aboutDescription2} className="md:col-span-2" multiline />
          <Field label="About description 3" value={portfolio.settings.aboutDescription3} className="md:col-span-2" multiline />
          <Field label="Contact heading" value={portfolio.settings.contactHeadingTitle} className="md:col-span-2" />
          <Field label="Contact subtitle" value={portfolio.settings.contactHeadingSubtitle} className="md:col-span-2" multiline />
          <Field label="Contact social heading" value={portfolio.settings.contactSocialsHeading} />
          <Field label="Availability text" value={portfolio.settings.contactAvailabilityText} />
          <Field label="Footer tagline" value={portfolio.settings.footerTagline} className="md:col-span-2" multiline />
          <Field label="Footer copyright text" value={portfolio.settings.footerCopyrightText} className="md:col-span-2" />
        </div>
        <p className="text-sm text-muted-foreground">Preview mode: settings are read-only and changes are not saved.</p>
      </CardContent>
    </Card>
  );

  const editor = (resource: Parameters<typeof AdminResourceEditor>[0]['resource'], items: object[]) => (
    <AdminResourceEditor
      resource={resource}
      items={items}
      categories={(portfolio.allSkillCategories ?? portfolio.skillCategories).map(({ id, title }) => ({ id, title }))}
      readOnly
    />
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'hero':
        return renderSettings();
      case 'about':
        return editor('about', portfolio.aboutTimeline);
      case 'stats':
        return editor('stats', portfolio.stats);
      case 'experience':
        return editor('experience', portfolio.experiences);
      case 'skills':
        return (
          <div className="space-y-6">
            {editor('skillCategories', portfolio.allSkillCategories ?? portfolio.skillCategories)}
            {editor('skills', portfolio.skills)}
          </div>
        );
      case 'services':
        return editor('services', portfolio.services);
      case 'projects':
        return editor('projects', portfolio.projects);
      case 'testimonials':
        return editor('testimonials', portfolio.testimonials);
      case 'socials':
        return editor('socials', portfolio.socialLinks);
      case 'contact':
        return editor('contact', portfolio.contactInfo);
      case 'resume':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Resume / CV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><span className="font-medium text-foreground">Current file:</span> {portfolio.resume.fileName || 'No file uploaded'}</p>
                <p><span className="font-medium text-foreground">Original name:</span> {portfolio.resume.originalName || '—'}</p>
                <p><span className="font-medium text-foreground">Public URL:</span> {portfolio.resume.fileUrl || '—'}</p>
                <p><span className="font-medium text-foreground">Download button label:</span> {portfolio.resume.downloadLabel}</p>
              </div>
              <p className="text-sm text-muted-foreground">Preview mode: resume details are read-only.</p>
            </CardContent>
          </Card>
        );
      case 'inbox':
        return (
          <Card>
            <CardHeader><CardTitle>Inbox</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Visitor messages are not available in this UI-only preview.
            </CardContent>
          </Card>
        );
      case 'footer':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
        <header className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
                <h1 className="text-xl font-semibold">Portfolio dashboard</h1>
              </div>
            </div>

            <div className="rounded-full border border-border bg-muted/30 px-3 py-1 text-sm text-muted-foreground">
              UI preview · read-only
            </div>
          </div>
        </header>

        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          Admin panel preview only. Changes, uploads, and messages are not connected to a backend or saved.
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border bg-card p-3 shadow-sm">
            <nav className="space-y-1">
              {ADMIN_TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    activeTab === key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="space-y-6">{renderTabContent()}</main>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold text-foreground">{value}</div>
        <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  className,
  multiline = false,
}: {
  label: string;
  value: string;
  className?: string;
  multiline?: boolean;
}) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-2 block text-sm font-medium text-muted-foreground">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          readOnly
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
        />
      ) : (
        <input
          value={value}
          readOnly
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
        />
      )}
    </label>
  );
}
