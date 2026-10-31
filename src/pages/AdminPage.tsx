import { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Contact,
  FileText,
  FolderKanban,
  Globe,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { AdminAuth } from '@/admin/AdminAuth';
import { AdminChatInbox } from '@/admin/AdminChatInbox';
import { AdminResourceEditor } from '@/admin/AdminResourceEditor';
import { AssetUploadField } from '@/admin/AssetUploadField';
import type { AdminTab, AdminUser } from '@/admin/types';
import {
  deleteInboxMessage,
  fetchAdminPortfolio,
  fetchInboxMessages,
  getAdminAuthStatus,
  initializePortfolio,
  logoutAdmin,
  updateAdminSettings,
  updateInboxMessage,
  updateSectionVisibility,
  uploadResumeFile,
  type InboxMessage,
  type PortfolioData,
} from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FALLBACK_DATA, usePortfolio } from '@/context/PortfolioContext';

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
  { key: 'chat', label: 'Visitor chat', icon: MessageSquare },
  { key: 'footer', label: 'Footer', icon: ArrowRight },
];

const MANAGED_SECTIONS = [
  ['header', 'Header navigation'],
  ['hero', 'Hero'],
  ['about', 'About'],
  ['skills', 'Skills'],
  ['services', 'Services'],
  ['projects', 'Projects'],
  ['experience', 'Experience'],
  ['testimonials', 'Testimonials'],
  ['contact', 'Contact'],
  ['resume', 'Resume'],
  ['footer', 'Footer'],
] as const;

export default function AdminPage() {
  const { refresh } = usePortfolio();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [portfolio, setPortfolio] = useState<PortfolioData>(FALLBACK_DATA);
  const [initialized, setInitialized] = useState(false);
  const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadPortfolio = useCallback(async () => {
    const remote = await fetchAdminPortfolio();
    setInitialized(Boolean(remote.settings));
    if (remote.settings) {
      setPortfolio({
        ...FALLBACK_DATA,
        ...remote,
        settings: { ...FALLBACK_DATA.settings, ...remote.settings },
        sectionVisibility: { ...FALLBACK_DATA.sectionVisibility, ...remote.sectionVisibility },
      });
    } else {
      setPortfolio(FALLBACK_DATA);
    }
    await refresh();
  }, [refresh]);

  const loadInbox = useCallback(async () => {
    setInboxMessages(await fetchInboxMessages());
  }, []);

  useEffect(() => {
    getAdminAuthStatus()
      .then(async (status) => {
        if (status.authenticated && status.admin) {
          setAdmin(status.admin);
          await loadPortfolio();
        }
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Could not check admin login.'))
      .finally(() => setAuthLoading(false));
  }, [loadPortfolio]);

  useEffect(() => {
    if (admin && activeTab === 'inbox') {
      loadInbox().catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Could not load inbox.'));
    }
  }, [admin, activeTab, loadInbox]);

  const handleAuthenticated = async (user: AdminUser) => {
    setAdmin(user);
    setError(null);
    try {
      await loadPortfolio();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load portfolio content.');
    }
  };

  const saveSettings = async (patch: Partial<PortfolioData['settings']>) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await updateAdminSettings(patch);
      await loadPortfolio();
      setNotice('Changes saved. The public portfolio has been updated.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save settings.');
    } finally {
      setBusy(false);
    }
  };

  const changeSectionVisibility = async (section: string, isVisible: boolean) => {
    setBusy(true);
    setError(null);
    try {
      await updateSectionVisibility(section, isVisible);
      await loadPortfolio();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not update section visibility.');
    } finally {
      setBusy(false);
    }
  };

  const handleInitialize = async () => {
    setBusy(true);
    setError(null);
    try {
      await initializePortfolio(FALLBACK_DATA);
      await loadPortfolio();
      setNotice('Your existing portfolio content is now connected to Supabase.');
    } catch (initializeError) {
      setError(initializeError instanceof Error ? initializeError.message : 'Could not initialize portfolio content.');
    } finally {
      setBusy(false);
    }
  };

  const renderSettings = (fields: Array<{ name: keyof PortfolioData['settings']; label: string; multiline?: boolean; asset?: boolean }>) => (
    <SettingsEditor
      title={activeTab === 'hero' ? 'Hero content' : activeTab === 'about' ? 'About content' : activeTab === 'contact' ? 'Contact content' : 'Footer content'}
      settings={portfolio.settings}
      fields={fields}
      busy={busy}
      onSave={saveSettings}
    />
  );

  const editor = (
    resource: Parameters<typeof AdminResourceEditor>[0]['resource'],
    items: object[],
  ) => (
    <AdminResourceEditor
      resource={resource}
      items={items}
      categories={(portfolio.allSkillCategories ?? portfolio.skillCategories).map(({ id, title }) => ({ id, title }))}
      onChanged={loadPortfolio}
    />
  );

  const renderTabContent = () => {
    if (!initialized) {
      return (
        <Card>
          <CardHeader><CardTitle>Connect your current portfolio content</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will copy the current code-based content into your Supabase database once. You can then edit it here.
            </p>
            <Button onClick={() => void handleInitialize()} disabled={busy}>
              {busy ? 'Importing…' : 'Import existing portfolio content'}
            </Button>
          </CardContent>
        </Card>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Projects" value={String(portfolio.projects.length)} detail="Items in the database" />
              <StatCard label="Skills" value={String(portfolio.skills.length)} detail={`${portfolio.skillCategories.length} categories`} />
              <StatCard label="Experience" value={String(portfolio.experiences.length)} detail="Work history items" />
              <StatCard label="Inbox" value={String(inboxMessages.filter((message) => !message.isRead).length)} detail="Unread messages (open Inbox to refresh)" />
            </div>
            <Card>
              <CardHeader><CardTitle>Show or hide public sections</CardTitle></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {MANAGED_SECTIONS.map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className="text-sm font-medium">{label}</span>
                    <input
                      type="checkbox"
                      checked={portfolio.sectionVisibility[key] !== false}
                      disabled={busy}
                      onChange={(event) => void changeSectionVisibility(key, event.target.checked)}
                      className="h-4 w-4 accent-primary"
                    />
                  </label>
                ))}
              </CardContent>
            </Card>
          </div>
        );
      case 'hero':
        return renderSettings([
          { name: 'name', label: 'Name' },
          { name: 'bioHeadline', label: 'Headline' },
          { name: 'tagline', label: 'Tagline', multiline: true },
          { name: 'statusText', label: 'Status text' },
          { name: 'typingRoles', label: 'Typing roles (comma separated)' },
          { name: 'hireMeLabel', label: 'Hire me button label' },
          { name: 'hireMeWhatsappNumber', label: 'WhatsApp number' },
          { name: 'heroAvatarUrl', label: 'Hero image', asset: true },
        ]);
      case 'about':
        return (
          <div className="space-y-6">
            {renderSettings([
              { name: 'aboutHeading', label: 'Heading' },
              { name: 'aboutAvatarUrl', label: 'About image', asset: true },
              { name: 'aboutDescription1', label: 'Description 1', multiline: true },
              { name: 'aboutDescription2', label: 'Description 2', multiline: true },
              { name: 'aboutDescription3', label: 'Description 3', multiline: true },
            ])}
            {editor('about', portfolio.aboutTimeline)}
          </div>
        );
      case 'stats':
        return editor('stats', portfolio.stats);
      case 'experience':
        return (
          <div className="space-y-6">
            {renderSettings([{ name: 'experienceHeading', label: 'Section heading' }])}
            {editor('experience', portfolio.experiences)}
          </div>
        );
      case 'skills':
        return (
          <div className="space-y-6">
            {renderSettings([{ name: 'skillsHeading', label: 'Section heading' }])}
            {editor('skillCategories', portfolio.allSkillCategories ?? portfolio.skillCategories)}
            {editor('skills', portfolio.skills)}
          </div>
        );
      case 'services':
        return (
          <div className="space-y-6">
            {renderSettings([{ name: 'servicesHeading', label: 'Section heading' }])}
            {editor('services', portfolio.services)}
          </div>
        );
      case 'projects':
        return (
          <div className="space-y-6">
            {renderSettings([{ name: 'projectsHeading', label: 'Section heading' }])}
            {editor('projects', portfolio.projects)}
          </div>
        );
      case 'testimonials':
        return (
          <div className="space-y-6">
            {renderSettings([{ name: 'testimonialsHeading', label: 'Section heading' }])}
            {editor('testimonials', portfolio.testimonials)}
          </div>
        );
      case 'socials':
        return editor('socials', portfolio.socialLinks);
      case 'contact':
        return (
          <div className="space-y-6">
            {renderSettings([
              { name: 'contactHeadingTitle', label: 'Contact heading' },
              { name: 'contactHeadingSubtitle', label: 'Contact subtitle', multiline: true },
              { name: 'contactSocialsHeading', label: 'Social links heading' },
              { name: 'contactAvailabilityText', label: 'Availability text' },
            ])}
            {editor('contact', portfolio.contactInfo)}
          </div>
        );
      case 'resume':
        return (
          <div className="space-y-6">
            {renderSettings([{ name: 'downloadCvLabel', label: 'Download button label' }])}
            <ResumeEditor
              fileName={portfolio.settings.resumeFileName}
              fileUrl={portfolio.settings.resumeFileUrl}
              downloadLabel={portfolio.settings.downloadCvLabel}
              onUpload={async (file) => {
                setBusy(true);
                setError(null);
                try {
                  await uploadResumeFile(file);
                  await loadPortfolio();
                  setNotice('Resume uploaded and published.');
                } catch (uploadError) {
                  setError(uploadError instanceof Error ? uploadError.message : 'Could not upload resume.');
                } finally {
                  setBusy(false);
                }
              }}
              busy={busy}
            />
          </div>
        );
      case 'inbox':
        return (
          <InboxEditor
            messages={inboxMessages}
            onRefresh={loadInbox}
            onError={(message) => setError(message)}
          />
        );
      case 'chat':
        return <AdminChatInbox />;
      case 'footer':
        return renderSettings([
          { name: 'firstName', label: 'First name' },
          { name: 'lastName', label: 'Last name' },
          { name: 'footerBrandName', label: 'Brand name' },
          { name: 'footerTagline', label: 'Tagline', multiline: true },
          { name: 'footerCopyrightText', label: 'Copyright text' },
        ]);
      default:
        return null;
    }
  };

  if (authLoading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Checking admin access…</div>;
  }

  if (!admin) {
    return error && !error.includes('VITE_SUPABASE')
      ? <AdminAuth needsBootstrap={false} initialError={error} onAuthenticated={(user) => void handleAuthenticated(user)} />
      : error
        ? <SetupError message={error} />
        : <AdminAuth needsBootstrap={false} onAuthenticated={(user) => void handleAuthenticated(user)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2 text-primary"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
              <h1 className="text-xl font-semibold">Portfolio dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{admin.username}</span>
            <Button variant="outline" size="sm" onClick={() => void logoutAdmin().then(() => setAdmin(null)).catch((logoutError) => setError(logoutError instanceof Error ? logoutError.message : 'Could not sign out.'))}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </header>

        {error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">{notice}</p>}

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border bg-card p-3 shadow-sm">
            <nav className="space-y-1">
              {ADMIN_TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    activeTab === key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />{label}
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
      <CardHeader className="pb-3"><CardTitle className="text-sm text-muted-foreground">{label}</CardTitle></CardHeader>
      <CardContent><div className="text-3xl font-semibold">{value}</div><p className="mt-2 text-xs text-muted-foreground">{detail}</p></CardContent>
    </Card>
  );
}

function SettingsEditor({
  title,
  settings,
  fields,
  busy,
  onSave,
}: {
  title: string;
  settings: PortfolioData['settings'];
  fields: Array<{ name: keyof PortfolioData['settings']; label: string; multiline?: boolean; asset?: boolean }>;
  busy: boolean;
  onSave: (patch: Partial<PortfolioData['settings']>) => Promise<void>;
}) {
  const [values, setValues] = useState<Partial<PortfolioData['settings']>>({});
  useEffect(() => setValues({}), [settings.updatedAt]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave(values);
  };

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={save}>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => {
              const value = values[field.name] ?? settings[field.name];
              const displayed = Array.isArray(value) ? value.join(', ') : String(value ?? '');
              return (
                <label key={field.name} className={`block ${field.multiline ? 'md:col-span-2' : ''}`}>
                  <span className="mb-2 block text-sm font-medium text-muted-foreground">{field.label}</span>
                  {field.asset ? (
                    <AssetUploadField
                      label={field.label}
                      value={displayed}
                      disabled={busy}
                      onChange={(url) => setValues((current) => ({ ...current, [field.name]: url }))}
                    />
                  ) : field.multiline ? (
                    <textarea
                      value={displayed}
                      rows={4}
                      onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  ) : (
                    <input
                      value={displayed}
                      onChange={(event) => setValues((current) => ({
                        ...current,
                        [field.name]: field.name === 'typingRoles'
                          ? event.target.value.split(',').map((role) => role.trim()).filter(Boolean)
                          : event.target.value,
                      }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  )}
                </label>
              );
            })}
          </div>
          <div className="flex justify-end"><Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</Button></div>
        </form>
      </CardContent>
    </Card>
  );
}

function ResumeEditor({
  fileName,
  fileUrl,
  downloadLabel,
  onUpload,
  busy,
}: {
  fileName: string;
  fileUrl: string;
  downloadLabel: string;
  onUpload: (file: File) => Promise<void>;
  busy: boolean;
}) {
  return (
    <Card>
      <CardHeader><CardTitle>Resume / CV</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Current file: {fileName || 'No file uploaded'}</p>
        {fileUrl && <a className="text-sm text-primary underline" href={fileUrl} target="_blank" rel="noreferrer">Open current CV</a>}
        <p className="text-sm text-muted-foreground">Download button label: {downloadLabel}</p>
        <label className="block text-sm">
          <span className="mb-2 block text-muted-foreground">Upload PDF (maximum 10 MB)</span>
          <input
            type="file"
            accept="application/pdf,.pdf"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onUpload(file);
              event.currentTarget.value = '';
            }}
          />
        </label>
      </CardContent>
    </Card>
  );
}

function InboxEditor({
  messages,
  onRefresh,
  onError,
}: {
  messages: InboxMessage[];
  onRefresh: () => Promise<void>;
  onError: (message: string) => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const act = async (id: string, action: 'read' | 'delete') => {
    setBusyId(id);
    try {
      if (action === 'read') await updateInboxMessage(id, { isRead: true });
      else if (window.confirm('Delete this message permanently?')) await deleteInboxMessage(id);
      await onRefresh();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Could not update this inbox message.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Inbox</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {messages.length === 0 ? <p className="text-sm text-muted-foreground">No messages yet.</p> : messages.map((message) => (
          <article key={message.id} className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-semibold">{message.senderName || 'Visitor'} {!message.isRead && <span className="text-xs text-primary">New</span>}</p>
                <a className="text-sm text-primary underline" href={`mailto:${message.senderEmail}`}>{message.senderEmail || 'No email provided'}</a>
                <p className="mt-1 text-xs text-muted-foreground">{new Date(message.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                {!message.isRead && <Button size="sm" variant="outline" disabled={busyId === message.id} onClick={() => void act(message.id, 'read')}>Mark read</Button>}
                <Button size="sm" variant="destructive" disabled={busyId === message.id} onClick={() => void act(message.id, 'delete')}>Delete</Button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">{message.content}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

function SetupError({ message }: { message: string }) {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <Card className="max-w-xl">
        <CardHeader><CardTitle>Supabase configuration needed</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>{message}</p>
          <p>Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your local .env file, then restart the dev server.</p>
        </CardContent>
      </Card>
    </div>
  );
}
