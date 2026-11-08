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

export const FALLBACK_VLOGS: VlogPost[] = [
  {
    id: 'vlog-1',
    title: 'Building High-Performance Web Applications in 2026',
    slug: 'building-high-performance-web-apps-2026',
    summary: 'A deep dive into modern micro-frontends, reactive architecture, and bundle optimization techniques.',
    content: `Building modern web apps requires a balance between aesthetic fluidity and blazing-fast performance. In this post, we explore how cutting-edge bundlers, edge computing, and strict code-splitting keep load times well under 800ms.

### Key Highlights:
- **Instant Preloading:** How predictive routing transforms perceived user latency.
- **Micro-animations:** Crafting GPU-accelerated motion using Framer Motion without dropping 60 FPS.
- **Edge Storage:** Distributing reactive database queries with Supabase and global CDNs.`,
    postType: 'article',
    mediaUrl: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Architecture', 'Performance', 'React', 'TypeScript'],
    isPublished: true,
    createdAt: '2026-10-15T10:00:00Z',
  },
  {
    id: 'vlog-2',
    title: 'Behind The Lens: Cinematic Drone Footage in the Northern Valleys',
    slug: 'cinematic-drone-footage-northern-valleys',
    summary: 'Capturing 10-bit D-Log footage at sunrise, color grading in DaVinci Resolve, and sound design secrets.',
    content: 'Watch the full 4K documentary snippet where we explore dawn over the mist-covered riverbanks and mountain ridges.',
    postType: 'video',
    mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Cinematography', 'Drone', '4K', 'ColorGrading'],
    isPublished: true,
    createdAt: '2026-10-20T14:30:00Z',
  },
  {
    id: 'vlog-3',
    title: 'AI-Assisted Image Editing & Visual Storytelling Workflow',
    slug: 'ai-assisted-image-editing-workflow',
    summary: 'How combining ComfyUI, Photoshop Neural Filters, and manual retouching gives stunning surreal photography results.',
    content: `Generative AI doesn't replace artistic intent — it accelerates it. By chaining custom LoRA checkpoints with fine-grained color matching, we can achieve lighting precision that used to take days of post-processing.`,
    postType: 'gallery',
    mediaUrl: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI Art', 'Design', 'Photoshop', 'Generative Media'],
    isPublished: true,
    createdAt: '2026-10-28T09:15:00Z',
  },
];

export const FALLBACK_WORK_PROJECTS: WorkProject[] = [
  {
    id: 'work-1',
    title: 'PulsePay: Mobile Banking & Crypto Wallet',
    category: 'App Development',
    description: 'Next-gen cross-platform mobile application featuring biometric security, instant peer-to-peer microtransactions, and real-time crypto asset analytics.',
    tags: ['React Native', 'TypeScript', 'Node.js', 'Tailwind', 'WebSockets'],
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80',
    liveUrl: 'https://example.com/pulsepay',
    repoUrl: 'https://github.com/mmshanto25-hub',
    displayOrder: 0,
    isVisible: true,
    createdAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'work-2',
    title: 'OmniStudio: Enterprise SaaS Design System',
    category: 'Web Development',
    description: 'Comprehensive high-converting dashboard with multi-tenant collaboration, automated cloud deployments, dynamic theming, and Supabase RLS security.',
    tags: ['Next.js', 'React', 'TailwindCSS', 'Supabase', 'PostgreSQL'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    liveUrl: 'https://example.com/omnistudio',
    repoUrl: 'https://github.com/mmshanto25-hub',
    displayOrder: 1,
    isVisible: true,
    createdAt: '2026-09-10T00:00:00Z',
  },
  {
    id: 'work-3',
    title: 'NeuroCanvas: AI Generative Image Studio',
    category: 'AI & Image Editing',
    description: 'Automated creative studio tool providing instant AI background replacement, neural face enhancement, depth-of-field synthesis, and batch image export.',
    tags: ['Python', 'FastAPI', 'PyTorch', 'React', 'Canvas API'],
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80',
    liveUrl: 'https://example.com/neurocanvas',
    repoUrl: 'https://github.com/mmshanto25-hub',
    displayOrder: 2,
    isVisible: true,
    createdAt: '2026-09-20T00:00:00Z',
  },
  {
    id: 'work-4',
    title: 'Zenith Fitness: Wearable Companion App',
    category: 'App Development',
    description: 'Health & workout tracking mobile app with real-time BLE sensor heart-rate monitoring, interactive calorie charts, and personalized AI trainer tips.',
    tags: ['Flutter', 'Dart', 'Firebase', 'Bluetooth LE'],
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=80',
    liveUrl: 'https://example.com/zenith',
    repoUrl: 'https://github.com/mmshanto25-hub',
    displayOrder: 3,
    isVisible: true,
    createdAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'work-5',
    title: 'CyberVibe: Cyberpunk 3D Web Experience',
    category: 'Web Development',
    description: 'Interactive WebGL 3D product showcase with interactive lighting, physics-based cloth simulations, and spatial ambient audio tracks.',
    tags: ['Three.js', 'React Three Fiber', 'GLSL Shaders', 'Vite'],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    liveUrl: 'https://example.com/cybervibe',
    repoUrl: 'https://github.com/mmshanto25-hub',
    displayOrder: 4,
    isVisible: true,
    createdAt: '2026-10-05T00:00:00Z',
  },
  {
    id: 'work-6',
    title: 'Surrealist Visions: AI Concept Art Series',
    category: 'AI & Image Editing',
    description: 'Curated 100-piece collection exploring retro-futurism, neo-tokyo aesthetics, and organic architecture using fine-tuned diffusion models.',
    tags: ['Stable Diffusion', 'Midjourney', 'Photoshop', 'Topaz'],
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    liveUrl: 'https://example.com/surrealist',
    repoUrl: '',
    displayOrder: 5,
    isVisible: true,
    createdAt: '2026-10-18T00:00:00Z',
  },
];

export const FALLBACK_PASSIONS: PassionItem[] = [
  {
    id: 'pas-1',
    title: 'Golden Hour at the Old Riverbank',
    category: 'photography',
    description: 'Capturing the serenity of twilight reflections across still water and silhouetted fishermen boats.',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    location: 'Cox’s Bazar & Kuakata',
    gearInfo: 'Sony A7 IV · 24-70mm f/2.8 GM · ISO 100',
    displayOrder: 0,
    isVisible: true,
    createdAt: '2026-08-10T00:00:00Z',
  },
  {
    id: 'pas-2',
    title: 'Neon Noir: Dhaka City Nights',
    category: 'cinematography',
    description: 'Short cinematic mood film capturing rain-slicked asphalt, vibrant neon storefronts, and late-night rickshaw trails.',
    mediaUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    location: 'Dhaka City Nightscape',
    gearInfo: 'Sony FX3 · Sirui 50mm Anamorphic · Cine D-Log',
    displayOrder: 1,
    isVisible: true,
    createdAt: '2026-08-25T00:00:00Z',
  },
  {
    id: 'pas-3',
    title: 'Monochrome Street Perspectives',
    category: 'photography',
    description: 'High-contrast black-and-white candid portraiture celebrating urban geometry, architecture, and raw human emotions.',
    mediaUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&q=80',
    location: 'Old Town Heritage',
    gearInfo: 'Fujifilm X-T5 · 35mm f/1.4 · Acros Film Simulation',
    displayOrder: 2,
    isVisible: true,
    createdAt: '2026-09-05T00:00:00Z',
  },
  {
    id: 'pas-4',
    title: 'Echoes of the High Peaks',
    category: 'cinematography',
    description: 'A visual travel diary documentary across misted tea valleys and high forest ranges, set to custom atmospheric sound design.',
    mediaUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    location: 'Sreemangal & Bandarban',
    gearInfo: 'DJI Mavic 3 Pro & Blackmagic Pocket 6K',
    displayOrder: 3,
    isVisible: true,
    createdAt: '2026-09-18T00:00:00Z',
  },
  {
    id: 'pas-5',
    title: 'Macro Botanicals & Water Drops',
    category: 'photography',
    description: 'Exploring the intricate geometry of tropical flora, dew droplets, and microscopic reflections in early morning dawn.',
    mediaUrl: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=600&q=80',
    location: 'Botanical Garden',
    gearInfo: 'Sony 90mm f/2.8 Macro G OSS',
    displayOrder: 4,
    isVisible: true,
    createdAt: '2026-10-02T00:00:00Z',
  },
  {
    id: 'pas-6',
    title: 'Surreal Cyber Dreamscapes',
    category: 'visual_art',
    description: '3D matte painting and conceptual sci-fi environments blending futuristic architecture with ethereal cosmic nebulae.',
    mediaUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    location: 'Digital Concept Studio',
    gearInfo: 'Blender 4.2 · Octane Render · Photoshop',
    displayOrder: 5,
    isVisible: true,
    createdAt: '2026-10-22T00:00:00Z',
  },
];

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
