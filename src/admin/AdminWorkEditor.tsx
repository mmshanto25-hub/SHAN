import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, ExternalLink, Github, EyeOff } from 'lucide-react';
import { 
  fetchWorkProjects, 
  createWorkProject, 
  updateWorkProject, 
  deleteWorkProject, 
  type WorkProject 
} from '@/lib/extendedApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AssetUploadField } from '@/admin/AssetUploadField';

const STANDARD_CATEGORIES = [
  'Web Development',
  'App Development',
  'AI & Image Editing',
  'UI/UX Design',
  'Cloud Architecture',
  'Other',
];

export const AdminWorkEditor: React.FC = () => {
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<WorkProject | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchWorkProjects(true);
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load work projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const openCreate = () => {
    setEditingProject(null);
    setTitle('');
    setCategory('Web Development');
    setCustomCategory('');
    setDescription('');
    setTags('');
    setImageUrl('');
    setLiveUrl('');
    setRepoUrl('');
    setIsVisible(true);
    setIsCreating(true);
    setError(null);
  };

  const openEdit = (p: WorkProject) => {
    setEditingProject(p);
    setTitle(p.title);
    if (STANDARD_CATEGORIES.includes(p.category)) {
      setCategory(p.category);
      setCustomCategory('');
    } else {
      setCategory('Custom');
      setCustomCategory(p.category);
    }
    setDescription(p.description);
    setTags(p.tags.join(', '));
    setImageUrl(p.imageUrl);
    setLiveUrl(p.liveUrl);
    setRepoUrl(p.repoUrl);
    setIsVisible(p.isVisible);
    setIsCreating(true);
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setBusy(true);
    setError(null);

    const finalCategory = category === 'Custom' ? customCategory.trim() || 'General' : category;

    const payload = {
      title: title.trim(),
      category: finalCategory,
      description: description.trim(),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      imageUrl: imageUrl.trim(),
      liveUrl: liveUrl.trim(),
      repoUrl: repoUrl.trim(),
      isVisible,
    };

    try {
      if (editingProject) {
        await updateWorkProject(editingProject.id, payload);
      } else {
        await createWorkProject(payload);
      }
      setIsCreating(false);
      setEditingProject(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this project showcase entry?')) return;
    setBusy(true);
    try {
      await deleteWorkProject(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Work Showcase Manager</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Manage App Development, Web Development, and AI Image Editing deliveries.
            </p>
          </div>
          <Button onClick={openCreate} disabled={busy}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Project
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading projects…</p>
          ) : projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects found.</p>
          ) : (
            <div className="space-y-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                      {proj.imageUrl ? (
                        <img src={proj.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10">
                          {proj.category}
                        </span>
                        {!proj.isVisible && (
                          <span className="text-xs text-yellow-400 flex items-center gap-1">
                            <EyeOff className="w-3 h-3" /> Hidden
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm text-foreground mt-1">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {proj.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openEdit(proj)} disabled={busy}>
                      <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(proj.id)} disabled={busy}>
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProject ? 'Edit Project' : 'Add New Work Project'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. PulsePay Crypto Mobile App"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    {STANDARD_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Custom">Custom Category…</option>
                  </select>
                  {category === 'Custom' && (
                    <input
                      type="text"
                      placeholder="Type custom category name…"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  )}
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <AssetUploadField
                    label="Project Cover / Screenshot"
                    value={imageUrl}
                    disabled={busy}
                    onChange={(url) => setImageUrl(url)}
                  />
                </div>

                {/* Live URL */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://myproject.com"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Repo URL */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Source Code Link (GitHub / GitLab)
                  </label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Project Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe problem solved, architecture used, key metrics…"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Tech Stack Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="React Native, Node.js, Tailwind, FastAPI"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Visibility */}
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isWorkVisible"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="isWorkVisible" className="text-sm font-medium text-foreground cursor-pointer">
                    Visible on Public Work Page
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)} disabled={busy}>
                  Cancel
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy ? 'Saving…' : 'Save Project'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
