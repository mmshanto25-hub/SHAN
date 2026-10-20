// Frontend API client for public and admin operations

const API_BASE = '/api';

async function readApiResponse<T>(res: Response, fallbackMessage: string): Promise<T> {
  const body = await res.text();
  let data: unknown;

  try {
    data = body ? JSON.parse(body) : null;
  } catch {
    const message = body.trim().startsWith('A server error has occurred')
      ? 'The API server failed to run. Check the Vercel API deployment logs.'
      : `The API returned an invalid response (HTTP ${res.status}).`;
    throw new Error(message);
  }

  if (!res.ok) {
    const error = data && typeof data === 'object' && 'error' in data
      ? String(data.error)
      : fallbackMessage;
    throw new Error(error);
  }

  return data as T;
}

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
    updatedAt: string;
  };
  stats: Array<{
    id: string;
    value: number;
    suffix: string;
    label: string;
    displayOrder: number;
    isVisible: boolean;
  }>;
  aboutTimeline: Array<{
    id: string;
    year: string;
    role: string;
    company: string;
    displayOrder: number;
    isVisible: boolean;
  }>;
  experiences: Array<{
    id: string;
    role: string;
    company: string;
    date: string;
    description: string;
    initials: string;
    displayOrder: number;
    isVisible: boolean;
  }>;
  skillCategories: Array<{
    id: string;
    title: string;
    displayOrder: number;
    isVisible: boolean;
    skills: Array<{
      id: string;
      categoryId: string;
      name: string;
      percent: number;
      icon: string;
      color: string;
      displayOrder: number;
      isVisible: boolean;
    }>;
  }>;
  allSkillCategories?: Array<{
    id: string;
    title: string;
    displayOrder: number;
    isVisible: boolean;
  }>;
  skills: Array<{
    id: string;
    categoryId: string;
    name: string;
    percent: number;
    icon: string;
    color: string;
    displayOrder: number;
    isVisible: boolean;
  }>;
  services: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    displayOrder: number;
    isVisible: boolean;
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    tags: string[];
    color: string;
    imageUrl?: string | null;
    codeUrl?: string | null;
    liveUrl?: string | null;
    displayOrder: number;
    isVisible: boolean;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    position: string;
    text: string;
    initials: string;
    color: string;
    displayOrder: number;
    isVisible: boolean;
  }>;
  socialLinks: Array<{
    id: string;
    platform: string;
    label: string;
    url: string;
    icon: string;
    displayOrder: number;
    isVisible: boolean;
  }>;
  contactInfo: Array<{
    id: string;
    type: string;
    title: string;
    value: string;
    href?: string | null;
    displayOrder: number;
    isVisible: boolean;
  }>;
  resume: {
    id: string;
    fileName: string;
    originalName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    downloadLabel: string;
    uploadedAt: string;
  };
}

export interface Conversation {
  id: string;
  visitorToken: string;
  visitorName?: string | null;
  visitorEmail?: string | null;
  lastMessageText?: string | null;
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

// Fetch public portfolio
export async function fetchPublicPortfolio(): Promise<PortfolioData> {
  const res = await fetch(`${API_BASE}/portfolio`);
  if (!res.ok) {
    throw new Error('Failed to load portfolio content');
  }
  return res.json();
}

// Check admin auth status
export async function getAdminAuthStatus(): Promise<{
  needsBootstrap: boolean;
  authenticated: boolean;
  admin?: { id: string; username: string };
}> {
  const res = await fetch(`${API_BASE}/admin/auth/status`, { credentials: 'include' });
  const data = await readApiResponse<{
    needsBootstrap: boolean;
    authenticated: boolean;
    admin?: { id: string; username: string } | null;
  }>(res, 'Failed to check auth status');
  return { ...data, admin: data.admin ?? undefined };
}

// Admin login
export async function loginAdmin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include'
  });
  return readApiResponse<{ admin: { id: string; username: string } }>(res, 'Login failed');
}

// Admin bootstrap setup
export async function bootstrapAdmin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/admin/auth/bootstrap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include'
  });
  return readApiResponse<{ admin: { id: string; username: string } }>(res, 'Bootstrap failed');
}

// Admin logout
export async function logoutAdmin() {
  const res = await fetch(`${API_BASE}/admin/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  return res.json();
}

// Fetch admin portfolio (includes hidden items)
export async function fetchAdminPortfolio(): Promise<PortfolioData> {
  const res = await fetch(`${API_BASE}/admin/portfolio`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to load admin portfolio');
  }
  return res.json();
}

// Update settings
export async function updateAdminSettings(patch: Partial<PortfolioData['settings']>) {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
    credentials: 'include'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update settings');
  return data;
}

// Generic CRUD helper for admin resources
async function adminRequest(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}/admin/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    credentials: 'include'
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Operation failed');
  }
  return data;
}

// Stats
export const apiStats = {
  create: (data: any) => adminRequest('stats', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => adminRequest(`stats/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => adminRequest(`stats/${id}`, { method: 'DELETE' }),
  reorder: (orderedIds: string[]) => adminRequest('stats/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
};

// About Timeline
export const apiAboutTimeline = {
  create: (data: any) => adminRequest('about-timeline', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => adminRequest(`about-timeline/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => adminRequest(`about-timeline/${id}`, { method: 'DELETE' }),
  reorder: (orderedIds: string[]) => adminRequest('about-timeline/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
};

// Work Experiences
export const apiExperiences = {
  create: (data: any) => adminRequest('experiences', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => adminRequest(`experiences/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => adminRequest(`experiences/${id}`, { method: 'DELETE' }),
  reorder: (orderedIds: string[]) => adminRequest('experiences/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
};

// Skill Categories & Skills
export const apiSkillCategories = {
  create: (data: any) => adminRequest('skill-categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => adminRequest(`skill-categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => adminRequest(`skill-categories/${id}`, { method: 'DELETE' }),
  reorder: (orderedIds: string[]) => adminRequest('skill-categories/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
};

export const apiSkills = {
  create: (data: any) => adminRequest('skills', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => adminRequest(`skills/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => adminRequest(`skills/${id}`, { method: 'DELETE' }),
  reorder: (orderedIds: string[]) => adminRequest('skills/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
};

// Services
export const apiServices = {
  create: (data: any) => adminRequest('services', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => adminRequest(`services/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => adminRequest(`services/${id}`, { method: 'DELETE' }),
  reorder: (orderedIds: string[]) => adminRequest('services/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
};

// Projects
export const apiProjects = {
  create: (data: any) => adminRequest('projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => adminRequest(`projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => adminRequest(`projects/${id}`, { method: 'DELETE' }),
  reorder: (orderedIds: string[]) => adminRequest('projects/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
};

// Testimonials
export const apiTestimonials = {
  create: (data: any) => adminRequest('testimonials', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => adminRequest(`testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => adminRequest(`testimonials/${id}`, { method: 'DELETE' }),
  reorder: (orderedIds: string[]) => adminRequest('testimonials/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
};

// Social Links
export const apiSocialLinks = {
  create: (data: any) => adminRequest('social-links', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => adminRequest(`social-links/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => adminRequest(`social-links/${id}`, { method: 'DELETE' }),
  reorder: (orderedIds: string[]) => adminRequest('social-links/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
};

// Contact Info
export const apiContactInfo = {
  create: (data: any) => adminRequest('contact-info', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => adminRequest(`contact-info/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => adminRequest(`contact-info/${id}`, { method: 'DELETE' }),
  reorder: (orderedIds: string[]) => adminRequest('contact-info/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
};

// Resume Upload & Details
export async function uploadResumeFile(file: File, downloadLabel?: string) {
  const formData = new FormData();
  formData.append('resume', file);
  if (downloadLabel) {
    formData.append('downloadLabel', downloadLabel);
  }

  const res = await fetch(`${API_BASE}/admin/resume/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to upload resume file');
  return data;
}

export async function updateResumeMetadata(data: { downloadLabel?: string; originalName?: string }) {
  return adminRequest('resume', { method: 'PATCH', body: JSON.stringify(data) });
}

// Inbox & Conversations
export const apiInbox = {
  getConversations: (archived = false) => adminRequest(`conversations?archived=${archived}`),
  getThread: (id: string) => adminRequest(`conversations/${id}`),
  sendReply: (id: string, content: string) => adminRequest(`conversations/${id}/messages`, { method: 'POST', body: JSON.stringify({ content }) }),
  markRead: (id: string) => adminRequest(`conversations/${id}/read`, { method: 'POST' }),
  archive: (id: string, isArchived: boolean) => adminRequest(`conversations/${id}/archive`, { method: 'POST', body: JSON.stringify({ isArchived }) }),
  delete: (id: string) => adminRequest(`conversations/${id}`, { method: 'DELETE' }),
};

// Visitor Chat API
export async function sendVisitorMessage(payload: {
  visitorToken: string;
  content: string;
  name?: string;
  email?: string;
}) {
  const res = await fetch(`${API_BASE}/chat/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send message');
  return data;
}

export async function fetchVisitorThread(visitorToken: string): Promise<{
  conversation: Conversation | null;
  messages: Message[];
}> {
  const res = await fetch(`${API_BASE}/chat/messages?visitorToken=${encodeURIComponent(visitorToken)}`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function markVisitorThreadRead(visitorToken: string) {
  const res = await fetch(`${API_BASE}/chat/read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorToken })
  });
  return res.json();
}
