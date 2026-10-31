export type AdminTab =
  | 'overview'
  | 'hero'
  | 'about'
  | 'stats'
  | 'experience'
  | 'skills'
  | 'services'
  | 'projects'
  | 'testimonials'
  | 'socials'
  | 'contact'
  | 'resume'
  | 'inbox'
  | 'chat'
  | 'footer';

export interface AdminUser {
  id: string;
  username: string;
}
