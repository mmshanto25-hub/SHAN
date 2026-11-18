import { supabase } from '@/lib/supabase';

export interface VlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  postType: 'article' | 'video' | 'gallery';
  mediaUrl: string;
  mediaPublicId?: string;
  thumbnailUrl: string;
  thumbnailPublicId?: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
}

export interface WorkProject {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  imageUrl: string;
  liveUrl: string;
  repoUrl: string;
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
}

export interface PassionItem {
  id: string;
  title: string;
  category: 'photography' | 'cinematography' | 'visual_art' | 'other';
  description: string;
  mediaUrl: string;
  thumbnailUrl: string;
  location: string;
  gearInfo: string;
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
}

export const FALLBACK_VLOGS: VlogPost[] = [];

export const FALLBACK_WORK_PROJECTS: WorkProject[] = [];

export const FALLBACK_PASSIONS: PassionItem[] = [];

// UUID validator to distinguish database rows from sample fallback items
export function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

// Track deleted fallback items locally so user deletions always succeed
function getDeletedFallbackIds(key: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(`deleted_fallback_${key}`);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function markFallbackDeleted(key: string, id: string) {
  if (typeof window === 'undefined') return;
  try {
    const set = getDeletedFallbackIds(key);
    set.add(id);
    localStorage.setItem(`deleted_fallback_${key}`, JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
}

function notifyChange(eventKey: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(eventKey));
  }
}

// ----------------- VLOG API -----------------
export async function fetchVlogPosts(includeUnpublished = false): Promise<VlogPost[]> {
  const deletedSet = getDeletedFallbackIds('vlog');
  const fallbackFiltered = FALLBACK_VLOGS.filter((p) => !deletedSet.has(p.id));

  if (!supabase) return fallbackFiltered;
  try {
    let query = supabase.from('vlog_posts').select('*').order('created_at', { ascending: false });
    if (!includeUnpublished) {
      query = query.eq('is_published', true);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return fallbackFiltered;
    }
    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      slug: row.slug || '',
      summary: row.summary || '',
      content: row.content || '',
      postType: row.post_type || 'article',
      mediaUrl: row.media_url || '',
      mediaPublicId: row.media_public_id || '',
      thumbnailUrl: row.thumbnail_url || '',
      thumbnailPublicId: row.thumbnail_public_id || '',
      tags: Array.isArray(row.tags) ? row.tags : [],
      isPublished: row.is_published,
      createdAt: row.created_at,
    }));
  } catch {
    return fallbackFiltered;
  }
}

export async function createVlogPost(item: Partial<VlogPost>): Promise<void> {
  if (!supabase) throw new Error('Supabase client not initialized');
  const payload: any = {
    title: item.title,
    slug: item.slug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    summary: item.summary || '',
    content: item.content || '',
    post_type: item.postType || 'article',
    media_url: item.mediaUrl || '',
    thumbnail_url: item.thumbnailUrl || '',
    tags: item.tags || [],
    is_published: item.isPublished !== false,
  };
  if (item.mediaPublicId !== undefined) payload.media_public_id = item.mediaPublicId;
  if (item.thumbnailPublicId !== undefined) payload.thumbnail_public_id = item.thumbnailPublicId;

  const { error } = await supabase.from('vlog_posts').insert(payload);
  if (error) throw new Error(error.message || 'Failed to create vlog post in Supabase');
  notifyChange('vlog-changed');
}

export async function updateVlogPost(id: string, item: Partial<VlogPost>): Promise<void> {
  // If it's a fallback item, convert it to a real database entry
  if (!isUuid(id)) {
    await createVlogPost(item);
    markFallbackDeleted('vlog', id);
    notifyChange('vlog-changed');
    return;
  }

  if (!supabase) throw new Error('Supabase client not initialized');
  const payload: any = {};
  if (item.title !== undefined) payload.title = item.title;
  if (item.slug !== undefined) payload.slug = item.slug;
  if (item.summary !== undefined) payload.summary = item.summary;
  if (item.content !== undefined) payload.content = item.content;
  if (item.postType !== undefined) payload.post_type = item.postType;
  if (item.mediaUrl !== undefined) payload.media_url = item.mediaUrl;
  if (item.mediaPublicId !== undefined) payload.media_public_id = item.mediaPublicId;
  if (item.thumbnailUrl !== undefined) payload.thumbnail_url = item.thumbnailUrl;
  if (item.thumbnailPublicId !== undefined) payload.thumbnail_public_id = item.thumbnailPublicId;
  if (item.tags !== undefined) payload.tags = item.tags;
  if (item.isPublished !== undefined) payload.is_published = item.isPublished;
  payload.updated_at = new Date().toISOString();

  const { error } = await supabase.from('vlog_posts').update(payload).eq('id', id);
  if (error) throw new Error(error.message || 'Failed to update vlog post');
  notifyChange('vlog-changed');
}

export async function deleteVlogPost(id: string): Promise<void> {
  // If it's a fallback item, delete locally
  if (!isUuid(id)) {
    markFallbackDeleted('vlog', id);
    notifyChange('vlog-changed');
    return;
  }

  if (!supabase) throw new Error('Supabase client not initialized');
  const { error } = await supabase.from('vlog_posts').delete().eq('id', id);
  if (error) throw new Error(error.message || 'Database error while deleting vlog post');
  notifyChange('vlog-changed');
}

export async function seedVlogPosts(): Promise<void> {
  if (!supabase) throw new Error('Supabase client not initialized');
  for (const post of FALLBACK_VLOGS) {
    await createVlogPost(post);
  }
}

// ----------------- WORK PROJECTS API -----------------
export async function fetchWorkProjects(includeHidden = false): Promise<WorkProject[]> {
  const deletedSet = getDeletedFallbackIds('work');
  const fallbackFiltered = FALLBACK_WORK_PROJECTS.filter((p) => !deletedSet.has(p.id));

  if (!supabase) return fallbackFiltered;
  try {
    let query = supabase.from('work_projects').select('*').order('display_order', { ascending: true });
    if (!includeHidden) {
      query = query.eq('is_visible', true);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return fallbackFiltered;
    }
    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category || 'Web Development',
      description: row.description || '',
      tags: Array.isArray(row.tags) ? row.tags : [],
      imageUrl: row.image_url || '',
      liveUrl: row.live_url || '',
      repoUrl: row.repo_url || '',
      displayOrder: row.display_order ?? 0,
      isVisible: row.is_visible,
      createdAt: row.created_at,
    }));
  } catch {
    return fallbackFiltered;
  }
}

export async function createWorkProject(item: Partial<WorkProject>): Promise<void> {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { error } = await supabase.from('work_projects').insert({
    title: item.title,
    category: item.category || 'Web Development',
    description: item.description || '',
    tags: item.tags || [],
    image_url: item.imageUrl || '',
    live_url: item.liveUrl || '',
    repo_url: item.repoUrl || '',
    display_order: item.displayOrder ?? 0,
    is_visible: item.isVisible !== false,
  });
  if (error) throw new Error(error.message || 'Failed to create work project in Supabase');
  notifyChange('work-changed');
}

export async function updateWorkProject(id: string, item: Partial<WorkProject>): Promise<void> {
  if (!isUuid(id)) {
    await createWorkProject(item);
    markFallbackDeleted('work', id);
    notifyChange('work-changed');
    return;
  }

  if (!supabase) throw new Error('Supabase client not initialized');
  const payload: any = {};
  if (item.title !== undefined) payload.title = item.title;
  if (item.category !== undefined) payload.category = item.category;
  if (item.description !== undefined) payload.description = item.description;
  if (item.tags !== undefined) payload.tags = item.tags;
  if (item.imageUrl !== undefined) payload.image_url = item.imageUrl;
  if (item.liveUrl !== undefined) payload.live_url = item.liveUrl;
  if (item.repoUrl !== undefined) payload.repo_url = item.repoUrl;
  if (item.displayOrder !== undefined) payload.display_order = item.displayOrder;
  if (item.isVisible !== undefined) payload.is_visible = item.isVisible;
  payload.updated_at = new Date().toISOString();

  const { error } = await supabase.from('work_projects').update(payload).eq('id', id);
  if (error) throw new Error(error.message || 'Failed to update work project');
  notifyChange('work-changed');
}

export async function deleteWorkProject(id: string): Promise<void> {
  if (!isUuid(id)) {
    markFallbackDeleted('work', id);
    notifyChange('work-changed');
    return;
  }

  if (!supabase) throw new Error('Supabase client not initialized');
  const { error } = await supabase.from('work_projects').delete().eq('id', id);
  if (error) throw new Error(error.message || 'Database error while deleting work project');
  notifyChange('work-changed');
}

export async function seedWorkProjects(): Promise<void> {
  if (!supabase) throw new Error('Supabase client not initialized');
  for (const proj of FALLBACK_WORK_PROJECTS) {
    await createWorkProject(proj);
  }
}

// ----------------- PASSION ITEMS API -----------------
export async function fetchPassionItems(includeHidden = false): Promise<PassionItem[]> {
  const deletedSet = getDeletedFallbackIds('passions');
  const fallbackFiltered = FALLBACK_PASSIONS.filter((p) => !deletedSet.has(p.id));

  if (!supabase) return fallbackFiltered;
  try {
    let query = supabase.from('passion_items').select('*').order('display_order', { ascending: true });
    if (!includeHidden) {
      query = query.eq('is_visible', true);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return fallbackFiltered;
    }
    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category || 'photography',
      description: row.description || '',
      mediaUrl: row.media_url || '',
      thumbnailUrl: row.thumbnail_url || '',
      location: row.location || '',
      gearInfo: row.gear_info || '',
      displayOrder: row.display_order ?? 0,
      isVisible: row.is_visible,
      createdAt: row.created_at,
    }));
  } catch {
    return fallbackFiltered;
  }
}

export async function createPassionItem(item: Partial<PassionItem>): Promise<void> {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { error } = await supabase.from('passion_items').insert({
    title: item.title,
    category: item.category || 'photography',
    description: item.description || '',
    media_url: item.mediaUrl || '',
    thumbnail_url: item.thumbnailUrl || '',
    location: item.location || '',
    gear_info: item.gearInfo || '',
    display_order: item.displayOrder ?? 0,
    is_visible: item.isVisible !== false,
  });
  if (error) throw new Error(error.message || 'Failed to create creative passion item in Supabase');
  notifyChange('passion-changed');
}

export async function updatePassionItem(id: string, item: Partial<PassionItem>): Promise<void> {
  if (!isUuid(id)) {
    await createPassionItem(item);
    markFallbackDeleted('passions', id);
    notifyChange('passion-changed');
    return;
  }

  if (!supabase) throw new Error('Supabase client not initialized');
  const payload: any = {};
  if (item.title !== undefined) payload.title = item.title;
  if (item.category !== undefined) payload.category = item.category;
  if (item.description !== undefined) payload.description = item.description;
  if (item.mediaUrl !== undefined) payload.media_url = item.mediaUrl;
  if (item.thumbnailUrl !== undefined) payload.thumbnail_url = item.thumbnailUrl;
  if (item.location !== undefined) payload.location = item.location;
  if (item.gearInfo !== undefined) payload.gear_info = item.gearInfo;
  if (item.displayOrder !== undefined) payload.display_order = item.displayOrder;
  if (item.isVisible !== undefined) payload.is_visible = item.isVisible;
  payload.updated_at = new Date().toISOString();

  const { error } = await supabase.from('passion_items').update(payload).eq('id', id);
  if (error) throw new Error(error.message || 'Failed to update passion item');
  notifyChange('passion-changed');
}

export async function deletePassionItem(id: string): Promise<void> {
  if (!isUuid(id)) {
    markFallbackDeleted('passions', id);
    notifyChange('passion-changed');
    return;
  }

  if (!supabase) throw new Error('Supabase client not initialized');
  const { error } = await supabase.from('passion_items').delete().eq('id', id);
  if (error) throw new Error(error.message || 'Database error while deleting passion item');
  notifyChange('passion-changed');
}

export async function seedPassionItems(): Promise<void> {
  if (!supabase) throw new Error('Supabase client not initialized');
  for (const item of FALLBACK_PASSIONS) {
    await createPassionItem(item);
  }
}
