import { requireSupabase } from '@/lib/supabase';

export interface PortfolioData {
  settings: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    bioHeadline: string;
    tagline: string;
    statusText: string;
    typingRoles: string[];
    hireMeLabel: string;
    hireMeWhatsappNumber: string;
    downloadCvLabel: string;
    heroAvatarUrl: string;
    aboutHeading: string;
    aboutDescription1: string;
    aboutDescription2: string;
    aboutDescription3: string;
    aboutAvatarUrl: string;
    resumeFileName: string;
    resumeFileUrl: string;
    footerBrandName: string;
    footerTagline: string;
    footerCopyrightText: string;
    contactHeadingTitle: string;
    contactHeadingSubtitle: string;
    contactSocialsHeading: string;
    contactAvailabilityText: string;
    skillsHeading: string;
    servicesHeading: string;
    projectsHeading: string;
    experienceHeading: string;
    testimonialsHeading: string;
    updatedAt: string;
  };
  sectionVisibility: Record<string, boolean>;
  stats: Array<{ id: string; value: number; suffix: string; label: string; displayOrder: number; isVisible: boolean }>;
  aboutTimeline: Array<{ id: string; year: string; role: string; company: string; displayOrder: number; isVisible: boolean }>;
  experiences: Array<{ id: string; role: string; company: string; date: string; description: string; initials: string; displayOrder: number; isVisible: boolean }>;
  skillCategories: Array<{
    id: string;
    title: string;
    displayOrder: number;
    isVisible: boolean;
    skills: Array<{ id: string; categoryId: string; name: string; percent: number; icon: string; color: string; displayOrder: number; isVisible: boolean }>;
  }>;
  allSkillCategories?: Array<{ id: string; title: string; displayOrder: number; isVisible: boolean }>;
  skills: Array<{ id: string; categoryId: string; name: string; percent: number; icon: string; color: string; displayOrder: number; isVisible: boolean }>;
  services: Array<{ id: string; title: string; description: string; icon: string; displayOrder: number; isVisible: boolean }>;
  projects: Array<{ id: string; title: string; description: string; tags: string[]; color: string; imageUrl?: string | null; codeUrl?: string | null; liveUrl?: string | null; displayOrder: number; isVisible: boolean }>;
  testimonials: Array<{ id: string; name: string; position: string; text: string; initials: string; color: string; displayOrder: number; isVisible: boolean }>;
  socialLinks: Array<{ id: string; platform: string; label: string; url: string; icon: string; displayOrder: number; isVisible: boolean }>;
  contactInfo: Array<{ id: string; type: string; title: string; value: string; href?: string | null; displayOrder: number; isVisible: boolean }>;
  resume: { id: string; fileName: string; originalName: string; fileUrl: string; fileSize: number; mimeType: string; downloadLabel: string; uploadedAt: string };
}

export interface ChatConversation {
  id: string;
  visitorName?: string | null;
  visitorEmail?: string | null;
  lastMessageAt: string;
  unreadByAdmin: boolean;
  unreadByVisitor: boolean;
  isArchived: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'visitor' | 'admin';
  content: string;
  createdAt: string;
}

export interface InboxMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatMessageRow {
  id: string;
  conversation_id: string;
  sender: 'visitor' | 'admin';
  content: string;
  created_at: string;
}

interface ChatConversationRow {
  id: string;
  visitor_name: string;
  visitor_email: string;
  unread_by_admin: boolean;
  unread_by_visitor: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

type ItemSection =
  | 'stats'
  | 'about'
  | 'experience'
  | 'skillCategories'
  | 'skills'
  | 'services'
  | 'projects'
  | 'testimonials'
  | 'socials'
  | 'contact';

interface PortfolioItemRow {
  id: string;
  section: ItemSection;
  parent_id: string | null;
  content: Record<string, unknown>;
  display_order: number;
  is_visible: boolean;
}

function mapItem(row: PortfolioItemRow) {
  return {
    ...row.content,
    id: row.id,
    displayOrder: row.display_order,
    isVisible: row.is_visible,
    ...(row.parent_id ? { categoryId: row.parent_id } : {}),
  };
}

function notifyPortfolioChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('portfolio-content-changed'));
  }
}

async function readPortfolio(includeHidden: boolean): Promise<Partial<PortfolioData>> {
  const client = requireSupabase();
  const [settingsResult, itemsResult] = await Promise.all([
    client.from('portfolio_settings').select('data, section_visibility, updated_at').eq('id', 'main').maybeSingle(),
    client.from('portfolio_items').select('*').order('display_order', { ascending: true }),
  ]);

  if (settingsResult.error) throw settingsResult.error;
  if (itemsResult.error) throw itemsResult.error;

  const rows = (itemsResult.data ?? []) as PortfolioItemRow[];
  const bySection = (section: ItemSection) => rows.filter((row) => row.section === section).map(mapItem);
  const allSkillCategories = bySection('skillCategories') as NonNullable<PortfolioData['allSkillCategories']>;
  const skills = bySection('skills') as PortfolioData['skills'];

  return {
    settings: settingsResult.data?.data as PortfolioData['settings'] | undefined,
    sectionVisibility: (settingsResult.data?.section_visibility ?? {}) as Record<string, boolean>,
    stats: bySection('stats') as PortfolioData['stats'],
    aboutTimeline: bySection('about') as PortfolioData['aboutTimeline'],
    experiences: bySection('experience') as PortfolioData['experiences'],
    allSkillCategories,
    skillCategories: allSkillCategories
      .filter((category) => includeHidden || category.isVisible)
      .map((category) => ({
        ...category,
        skills: skills.filter((skill) =>
          skill.categoryId === category.id && (includeHidden || skill.isVisible),
        ),
      })),
    skills,
    services: bySection('services') as PortfolioData['services'],
    projects: bySection('projects') as PortfolioData['projects'],
    testimonials: bySection('testimonials') as PortfolioData['testimonials'],
    socialLinks: bySection('socials') as PortfolioData['socialLinks'],
    contactInfo: bySection('contact') as PortfolioData['contactInfo'],
    resume: {
      id: 'current',
      fileName: settingsResult.data?.data?.resumeFileName ?? '',
      originalName: settingsResult.data?.data?.resumeFileName ?? '',
      fileUrl: settingsResult.data?.data?.resumeFileUrl ?? '',
      fileSize: 0,
      mimeType: 'application/pdf',
      downloadLabel: settingsResult.data?.data?.downloadCvLabel ?? 'Download CV',
      uploadedAt: settingsResult.data?.updated_at ?? '',
    },
  };
}

export async function fetchPublicPortfolio(): Promise<Partial<PortfolioData>> {
  return readPortfolio(false);
}

export async function fetchAdminPortfolio(): Promise<Partial<PortfolioData>> {
  return readPortfolio(true);
}

export async function getAdminAuthStatus(): Promise<{
  needsBootstrap: boolean;
  authenticated: boolean;
  admin?: { id: string; username: string };
}> {
  const { data, error } = await requireSupabase().auth.getUser();
  if (error && error.name !== 'AuthSessionMissingError') throw error;
  if (!data.user) return { needsBootstrap: false, authenticated: false };
  const { data: isAdmin, error: adminError } = await requireSupabase().rpc('is_portfolio_admin');
  if (adminError) throw adminError;
  return {
    needsBootstrap: false,
    authenticated: Boolean(isAdmin),
    admin: isAdmin ? { id: data.user.id, username: data.user.email ?? 'admin' } : undefined,
  };
}

export async function loginAdmin(email: string, password: string) {
  const { data, error } = await requireSupabase().auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      throw new Error(
        'Supabase could not sign in with this email and password. In the Supabase project configured in .env, confirm this user exists and is active, then reset its password if needed. The admin email and password are not configured in .env.',
      );
    }
    throw error;
  }
  if (!data.user) throw new Error('Supabase did not return an authenticated user.');
  const { data: isAdmin, error: adminError } = await requireSupabase().rpc('is_portfolio_admin');
  if (adminError) {
    await requireSupabase().auth.signOut();
    throw adminError;
  }
  if (!isAdmin) {
    await requireSupabase().auth.signOut();
    throw new Error('This account is not authorized to manage this portfolio.');
  }
  return { admin: { id: data.user.id, username: data.user.email ?? email } };
}

export async function bootstrapAdmin() {
  throw new Error('For security, create the admin account in the Supabase dashboard with public sign-ups disabled.');
}

export async function logoutAdmin() {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw error;
}

export async function updateAdminSettings(patch: Partial<PortfolioData['settings']>) {
  const client = requireSupabase();
  const { data: current, error: readError } = await client
    .from('portfolio_settings')
    .select('data, section_visibility')
    .eq('id', 'main')
    .maybeSingle();
  if (readError) throw readError;

  const merged = { ...(current?.data ?? {}), ...patch, updatedAt: new Date().toISOString() };
  const { error } = await client.from('portfolio_settings').upsert({
    id: 'main',
    data: merged,
    section_visibility: current?.section_visibility ?? {},
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
  notifyPortfolioChange();
}

export async function updateSectionVisibility(section: string, isVisible: boolean) {
  const client = requireSupabase();
  const { data: current, error: readError } = await client
    .from('portfolio_settings')
    .select('data, section_visibility')
    .eq('id', 'main')
    .maybeSingle();
  if (readError) throw readError;

  const { error } = await client.from('portfolio_settings').upsert({
    id: 'main',
    data: current?.data ?? {},
    section_visibility: { ...(current?.section_visibility ?? {}), [section]: isVisible },
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
  notifyPortfolioChange();
}

function makeResourceApi(section: ItemSection) {
  const client = () => requireSupabase();
  return {
    create: async (values: Record<string, unknown>) => {
      const { data: existing, error: readError } = await client()
        .from('portfolio_items').select('display_order').eq('section', section);
      if (readError) throw readError;
      const displayOrder = existing?.length ?? 0;
      const { categoryId, isVisible, displayOrder: _order, id: _id, ...content } = values;
      const { data, error } = await client().from('portfolio_items').insert({
        section,
        parent_id: typeof categoryId === 'string' ? categoryId : null,
        content,
        display_order: displayOrder,
        is_visible: typeof isVisible === 'boolean' ? isVisible : true,
      }).select('id').single();
      if (error) throw error;
      notifyPortfolioChange();
      return data;
    },
    update: async (id: string, values: Record<string, unknown>) => {
      const { categoryId, isVisible, displayOrder, id: _id, ...content } = values;
      const update: Record<string, unknown> = { content };
      if (typeof categoryId === 'string') update.parent_id = categoryId;
      if (typeof isVisible === 'boolean') update.is_visible = isVisible;
      if (typeof displayOrder === 'number') update.display_order = displayOrder;
      const { error } = await client().from('portfolio_items')
        .update(update).eq('id', id).eq('section', section);
      if (error) throw error;
      notifyPortfolioChange();
    },
    delete: async (id: string) => {
      const { error } = await client().from('portfolio_items').delete().eq('id', id).eq('section', section);
      if (error) throw error;
      notifyPortfolioChange();
    },
    reorder: async (orderedIds: string[]) => {
      const results = await Promise.all(orderedIds.map((id, display_order) =>
        client().from('portfolio_items').update({ display_order }).eq('id', id).eq('section', section),
      ));
      const failed = results.find((result) => result.error);
      if (failed?.error) throw failed.error;
      notifyPortfolioChange();
    },
  };
}

export const apiStats = makeResourceApi('stats');
export const apiAboutTimeline = makeResourceApi('about');
export const apiExperiences = makeResourceApi('experience');
export const apiSkillCategories = makeResourceApi('skillCategories');
export const apiSkills = makeResourceApi('skills');
export const apiServices = makeResourceApi('services');
export const apiProjects = makeResourceApi('projects');
export const apiTestimonials = makeResourceApi('testimonials');
export const apiSocialLinks = makeResourceApi('socials');
export const apiContactInfo = makeResourceApi('contact');

export async function uploadPortfolioAsset(file: File, folder: 'images' | 'resume') {
  if (file.size > 10 * 1024 * 1024) throw new Error('File must be 10 MB or smaller.');
  if (folder === 'images' && !file.type.startsWith('image/')) throw new Error('Choose an image file.');
  if (folder === 'resume' && file.type !== 'application/pdf') throw new Error('Choose a PDF file.');
  const client = requireSupabase();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${folder}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await client.storage.from('portfolio-assets').upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return client.storage.from('portfolio-assets').getPublicUrl(path).data.publicUrl;
}

export async function uploadResumeFile(file: File, downloadLabel?: string) {
  if (file.type !== 'application/pdf') throw new Error('Please choose a PDF file.');
  const fileUrl = await uploadPortfolioAsset(file, 'resume');
  await updateAdminSettings({
    resumeFileName: file.name,
    resumeFileUrl: fileUrl,
    ...(downloadLabel ? { downloadCvLabel: downloadLabel } : {}),
  });
  return { fileUrl, fileName: file.name };
}

export async function updateResumeMetadata(data: { downloadLabel?: string; originalName?: string }) {
  const current = await fetchAdminPortfolio();
  const settings = current.settings;
  if (!settings) throw new Error('Portfolio settings have not been initialized.');
  await updateAdminSettings({
    ...(data.downloadLabel ? { downloadCvLabel: data.downloadLabel } : {}),
    ...(data.originalName ? { resumeFileName: data.originalName } : {}),
  });
}

export async function initializePortfolio(data: PortfolioData) {
  const client = requireSupabase();
  const { count, error: countError } = await client
    .from('portfolio_items').select('id', { count: 'exact', head: true });
  if (countError) throw countError;
  if ((count ?? 0) > 0) throw new Error('Portfolio content is already initialized.');

  const { error: settingsError } = await client.from('portfolio_settings').upsert({
    id: 'main',
    data: data.settings,
    section_visibility: Object.fromEntries([
      'hero', 'about', 'skills', 'services', 'projects', 'experience', 'testimonials', 'contact', 'footer',
    ].map((section) => [section, true])),
    updated_at: new Date().toISOString(),
  });
  if (settingsError) throw settingsError;

  const insertRows = async (section: ItemSection, items: Array<Record<string, unknown>>): Promise<Array<{ id: string }>> => {
    if (!items.length) return [];
    const rows = items.map((item, index) => {
      const { id: _id, displayOrder, isVisible, categoryId, skills: _skills, ...content } = item;
      return {
        section,
        parent_id: section === 'skills'
          ? (typeof categoryId === 'string' ? categoryId : null)
          : null,
        content,
        display_order: typeof displayOrder === 'number' ? displayOrder : index,
        is_visible: typeof isVisible === 'boolean' ? isVisible : true,
      };
    });
    const { data: inserted, error } = await client.from('portfolio_items').insert(rows).select('id');
    if (error) throw error;
    return inserted ?? [];
  };

  await insertRows('stats', data.stats);
  await insertRows('about', data.aboutTimeline);
  await insertRows('experience', data.experiences);
  const categories = data.allSkillCategories ?? data.skillCategories;
  const categoryRows = await insertRows('skillCategories', categories);
  const oldToNewCategory = new Map<string, string>();
  categories.forEach((category, index) => oldToNewCategory.set(category.id, categoryRows[index].id));
  const seedSkills = data.skillCategories.flatMap((category) =>
    category.skills.map((skill) => ({ ...skill, categoryId: oldToNewCategory.get(category.id) ?? '' })),
  );
  await insertRows('skills', seedSkills);
  await insertRows('services', data.services);
  await insertRows('projects', data.projects);
  await insertRows('testimonials', data.testimonials);
  await insertRows('socials', data.socialLinks);
  await insertRows('contact', data.contactInfo);
  notifyPortfolioChange();
}

export async function submitInboxMessage(input: { senderName: string; senderEmail: string; content: string }) {
  const { error } = await requireSupabase().from('inbox_messages').insert({
    sender_name: input.senderName.trim(),
    sender_email: input.senderEmail.trim(),
    content: input.content.trim(),
  });
  if (error) throw error;
  notifyPortfolioChange();
}

export async function fetchInboxMessages(): Promise<InboxMessage[]> {
  const { data, error } = await requireSupabase().from('inbox_messages')
    .select('*').order('created_at', { ascending: false });
  if (error) throw error;
  notifyPortfolioChange();
  return (data ?? []).map((row) => ({
    id: row.id,
    senderName: row.sender_name,
    senderEmail: row.sender_email,
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));
}

export async function updateInboxMessage(id: string, patch: { isRead?: boolean }) {
  const update: Record<string, unknown> = {};
  if (typeof patch.isRead === 'boolean') update.is_read = patch.isRead;
  const { error } = await requireSupabase().from('inbox_messages').update(update).eq('id', id);
  if (error) throw error;
  notifyPortfolioChange();
}

export async function deleteInboxMessage(id: string) {
  const { error } = await requireSupabase().from('inbox_messages').delete().eq('id', id);
  if (error) throw error;
}

export async function sendVisitorMessage(payload: { visitorToken: string; content: string; name?: string; email?: string }) {
  const { data, error } = await requireSupabase().rpc('send_visitor_chat_message', {
    p_visitor_token: payload.visitorToken,
    p_content: payload.content,
    p_name: payload.name ?? '',
    p_email: payload.email ?? '',
  });
  if (error) throw error;
  const result = data as { message: Message };
  return result;
}

export async function fetchVisitorThread(visitorToken: string, markRead = false): Promise<{ conversation: ChatConversation | null; messages: Message[] }> {
  const { data, error } = await requireSupabase().rpc('get_visitor_chat', {
    p_visitor_token: visitorToken,
    p_mark_read: markRead,
  });
  if (error) throw error;
  return data as { conversation: ChatConversation | null; messages: Message[] };
}

export async function fetchChatConversations(): Promise<ChatConversation[]> {
  const { data, error } = await requireSupabase().from('chat_conversations')
    .select('id, visitor_name, visitor_email, unread_by_admin, unread_by_visitor, is_archived, created_at, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as ChatConversationRow[]).map((row) => ({
    id: row.id,
    visitorName: row.visitor_name,
    visitorEmail: row.visitor_email,
    unreadByAdmin: row.unread_by_admin,
    unreadByVisitor: row.unread_by_visitor,
    isArchived: row.is_archived,
    createdAt: row.created_at,
    lastMessageAt: row.updated_at,
  }));
}

export async function fetchAdminChatMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await requireSupabase().from('chat_messages')
    .select('id, conversation_id, sender, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return ((data ?? []) as ChatMessageRow[]).map((row) => ({
    id: row.id,
    conversationId: row.conversation_id,
    sender: row.sender,
    content: row.content,
    createdAt: row.created_at,
  }));
}

export async function markChatConversationRead(conversationId: string) {
  const { error } = await requireSupabase().from('chat_conversations')
    .update({ unread_by_admin: false })
    .eq('id', conversationId);
  if (error) throw error;
}

export async function sendAdminChatMessage(conversationId: string, content: string) {
  const message = content.trim();
  if (!message || message.length > 2000) throw new Error('Message must contain between 1 and 2000 characters.');
  const { error } = await requireSupabase().from('chat_messages').insert({
    conversation_id: conversationId,
    sender: 'admin',
    content: message,
  });
  if (error) throw error;
}

export async function markVisitorThreadRead(visitorToken: string) {
  const { error } = await requireSupabase().rpc('get_visitor_chat', {
    p_visitor_token: visitorToken,
    p_mark_read: true,
  });
  if (error) throw error;
}
