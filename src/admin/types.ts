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
  | 'footer';

export interface AdminUser {
  id: string;
  username: string;
}
