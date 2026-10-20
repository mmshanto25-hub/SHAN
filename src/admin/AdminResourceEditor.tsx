import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
  apiAboutTimeline,
  apiContactInfo,
  apiExperiences,
  apiProjects,
  apiServices,
  apiSkillCategories,
  apiSkills,
  apiSocialLinks,
  apiStats,
  apiTestimonials,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ResourceKey =
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

type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'tags' | 'select';

interface FieldDefinition {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

interface ResourceDefinition {
  title: string;
  fields: FieldDefinition[];
  api: {
    create: (data: Record<string, unknown>) => Promise<unknown>;
    update: (id: string, data: Record<string, unknown>) => Promise<unknown>;
    delete: (id: string) => Promise<unknown>;
  };
}

const resources: Record<ResourceKey, Omit<ResourceDefinition, 'fields' | 'api'> & { fields: FieldDefinition[] }> = {
  stats: {
    title: 'About stats',
    fields: [
      { name: 'value', label: 'Value', type: 'number', required: true },
      { name: 'suffix', label: 'Suffix' },
      { name: 'label', label: 'Label', required: true },
      { name: 'isVisible', label: 'Visible on portfolio', type: 'boolean' },
    ],
  },
  about: {
    title: 'About timeline',
    fields: [
      { name: 'year', label: 'Year', required: true },
      { name: 'role', label: 'Role', required: true },
      { name: 'company', label: 'Company / school', required: true },
      { name: 'isVisible', label: 'Visible on portfolio', type: 'boolean' },
    ],
  },
  experience: {
    title: 'Work experience',
    fields: [
      { name: 'role', label: 'Role', required: true },
      { name: 'company', label: 'Company', required: true },
      { name: 'date', label: 'Date range', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'initials', label: 'Badge initials' },
      { name: 'isVisible', label: 'Visible on portfolio', type: 'boolean' },
    ],
  },
  skillCategories: {
    title: 'Skill categories',
    fields: [
      { name: 'title', label: 'Category name', required: true },
      { name: 'isVisible', label: 'Visible on portfolio', type: 'boolean' },
    ],
  },
  skills: {
    title: 'Skills',
    fields: [
      { name: 'categoryId', label: 'Category', type: 'select', required: true },
      { name: 'name', label: 'Skill name', required: true },
      { name: 'percent', label: 'Proficiency (0–100)', type: 'number', required: true },
      { name: 'icon', label: 'Icon name' },
      { name: 'color', label: 'Icon color' },
      { name: 'isVisible', label: 'Visible on portfolio', type: 'boolean' },
    ],
  },
  services: {
    title: 'Services',
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'icon', label: 'Icon name' },
      { name: 'isVisible', label: 'Visible on portfolio', type: 'boolean' },
    ],
  },
  projects: {
    title: 'Projects',
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'tags', label: 'Tags (comma separated)', type: 'tags' },
      { name: 'color', label: 'Gradient classes' },
      { name: 'imageUrl', label: 'Image URL' },
      { name: 'codeUrl', label: 'Source code URL' },
      { name: 'liveUrl', label: 'Live site URL' },
      { name: 'isVisible', label: 'Visible on portfolio', type: 'boolean' },
    ],
  },
  testimonials: {
    title: 'Testimonials',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'position', label: 'Position' },
      { name: 'text', label: 'Testimonial', type: 'textarea', required: true },
      { name: 'initials', label: 'Badge initials' },
      { name: 'color', label: 'Gradient classes' },
      { name: 'isVisible', label: 'Visible on portfolio', type: 'boolean' },
    ],
  },
  socials: {
    title: 'Social links',
    fields: [
      { name: 'platform', label: 'Platform', required: true },
      { name: 'label', label: 'Display label' },
      { name: 'url', label: 'URL', required: true },
      { name: 'icon', label: 'Icon name' },
      { name: 'isVisible', label: 'Visible on portfolio', type: 'boolean' },
    ],
  },
  contact: {
    title: 'Contact information',
    fields: [
      { name: 'type', label: 'Type (email, phone, location, etc.)', required: true },
      { name: 'title', label: 'Title', required: true },
      { name: 'value', label: 'Value', required: true },
      { name: 'href', label: 'Link URL (optional)' },
      { name: 'isVisible', label: 'Visible on portfolio', type: 'boolean' },
    ],
  },
};

const resourceApis: Record<ResourceKey, ResourceDefinition['api']> = {
  stats: apiStats,
  about: apiAboutTimeline,
  experience: apiExperiences,
  skillCategories: apiSkillCategories,
  skills: apiSkills,
  services: apiServices,
  projects: apiProjects,
  testimonials: apiTestimonials,
  socials: apiSocialLinks,
  contact: apiContactInfo,
};

interface AdminResourceEditorProps {
  resource: ResourceKey;
  items: object[];
  categories?: Array<{ id: string; title: string }>;
  onChanged?: () => Promise<void>;
  readOnly?: boolean;
}

function getId(item: object): string | null {
  if ('id' in item && typeof item.id === 'string') return item.id;
  return null;
}

function getItemValue(item: object, key: string): unknown {
  return key in item ? item[key as keyof typeof item] : undefined;
}

function createInitialValues(fields: FieldDefinition[], item?: object): Record<string, string | number | boolean> {
  return Object.fromEntries(fields.map((field) => {
    const value = item ? getItemValue(item, field.name) : undefined;
    if (field.type === 'boolean') {
      return [field.name, typeof value === 'boolean' ? value : true];
    }
    if (field.type === 'number') {
      return [field.name, typeof value === 'number' ? value : 0];
    }
    if (field.type === 'tags') {
      return [field.name, Array.isArray(value) ? value.join(', ') : String(value ?? '')];
    }
    return [field.name, typeof value === 'string' ? value : ''];
  }));
}

export function AdminResourceEditor({ resource, items, categories = [], onChanged, readOnly = false }: AdminResourceEditorProps) {
  const queryClient = useQueryClient();
  const definition = resources[resource];
  const api = resourceApis[resource];
  const fields = definition.fields.map((field) => field.name === 'categoryId'
    ? { ...field, options: categories.map((category) => ({ value: category.id, label: category.title })) }
    : field);
  const [editingItem, setEditingItem] = useState<object | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [values, setValues] = useState<Record<string, string | number | boolean>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCreate = () => {
    setEditingItem(null);
    setValues(createInitialValues(fields));
    setError(null);
    setIsCreating(true);
  };

  const startEdit = (item: object) => {
    setEditingItem(item);
    setValues(createInitialValues(fields, item));
    setError(null);
    setIsCreating(true);
  };

  const closeForm = () => {
    setIsCreating(false);
    setEditingItem(null);
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const payload: Record<string, unknown> = {};

    for (const field of fields) {
      const value = values[field.name];
      if (field.type === 'tags') {
        payload[field.name] = String(value ?? '').split(',').map((tag) => tag.trim()).filter(Boolean);
      } else if (field.type === 'number') {
        payload[field.name] = Number(value);
      } else {
        payload[field.name] = value;
      }
    }

    try {
      const id = editingItem ? getId(editingItem) : null;
      if (editingItem && !id) throw new Error('Could not identify this item.');
      if (id) await api.update(id, payload);
      else await api.create(payload);
      await onChanged?.();
      await queryClient.invalidateQueries({ queryKey: ['public-portfolio'] });
      closeForm();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this item.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item: object) => {
    const id = getId(item);
    if (!id || !window.confirm('Delete this item? This cannot be undone.')) return;
    setBusy(true);
    setError(null);
    try {
      await api.delete(id);
      await onChanged?.();
      await queryClient.invalidateQueries({ queryKey: ['public-portfolio'] });
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete this item.');
    } finally {
      setBusy(false);
    }
  };

  const getItemTitle = (item: object) => {
    const preferred = ['title', 'name', 'label', 'role', 'year'];
    const title = preferred.map((key) => getItemValue(item, key)).find((value) => typeof value === 'string' && value);
    return title ?? 'Untitled item';
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>{definition.title}</CardTitle>
          {!readOnly && (
            <Button onClick={startCreate} disabled={busy}>
              <Plus className="h-4 w-4" /> Add item
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items yet. Add one to show it on the portfolio.</p>
          ) : items.map((item, index) => {
            const id = getId(item) ?? String(index);
            const isVisible = getItemValue(item, 'isVisible');
            return (
              <div key={id} className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="font-medium text-foreground">{String(getItemTitle(item))}</div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{id}</span>
                    {typeof isVisible === 'boolean' && <span>{isVisible ? 'Visible' : 'Hidden'}</span>}
                    {resource === 'skills' && (
                      <span>{categories.find((category) => category.id === getItemValue(item, 'categoryId'))?.title ?? 'Unassigned category'}</span>
                    )}
                  </div>
                </div>
                {!readOnly && (
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(item)} disabled={busy}>
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => void remove(item)} disabled={busy}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {!readOnly && isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit item' : 'Add item'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={(event) => void save(event)}>
              <div className="grid gap-4 md:grid-cols-2">
                {fields.map((field) => (
                  <label key={field.name} className={`block ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                    {field.type === 'boolean' ? (
                      <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                        <input
                          type="checkbox"
                          checked={Boolean(values[field.name])}
                          onChange={(event) => setValues({ ...values, [field.name]: event.target.checked })}
                          className="h-4 w-4 accent-primary"
                        />
                        {field.label}
                      </span>
                    ) : (
                      <>
                        <span className="mb-2 block text-sm font-medium text-muted-foreground">{field.label}</span>
                        {field.type === 'textarea' ? (
                          <textarea
                            value={String(values[field.name] ?? '')}
                            required={field.required}
                            rows={4}
                            onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                          />
                        ) : field.type === 'select' ? (
                          <select
                            value={String(values[field.name] ?? '')}
                            required={field.required}
                            onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                          >
                            <option value="">Select a category</option>
                            {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                          </select>
                        ) : (
                          <input
                            type={field.type === 'number' ? 'number' : 'text'}
                            min={field.type === 'number' && field.name === 'percent' ? 0 : undefined}
                            max={field.type === 'number' && field.name === 'percent' ? 100 : undefined}
                            step={field.type === 'number' ? 1 : undefined}
                            value={String(values[field.name] ?? '')}
                            required={field.required}
                            onChange={(event) => setValues({ ...values, [field.name]: field.type === 'number' ? Number(event.target.value) : event.target.value })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                          />
                        )}
                      </>
                    )}
                  </label>
                ))}
              </div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeForm} disabled={busy}>Cancel</Button>
                <Button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save item'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!isCreating && error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
