import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Camera, Film, Palette, EyeOff, Database } from 'lucide-react';
import { 
  fetchPassionItems, 
  createPassionItem, 
  updatePassionItem, 
  deletePassionItem, 
  seedPassionItems,
  isUuid,
  type PassionItem 
} from '@/lib/extendedApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AssetUploadField } from '@/admin/AssetUploadField';

export const AdminPassionEditor: React.FC = () => {
  const [items, setItems] = useState<PassionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<PassionItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'photography' | 'cinematography' | 'visual_art' | 'other'>('photography');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [location, setLocation] = useState('');
  const [gearInfo, setGearInfo] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchPassionItems(true);
      setItems(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Could not load passion items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const hasFallbackItems = items.some((it) => !isUuid(it.id));

  const handleSeed = async () => {
    if (!window.confirm('Save all default sample items into your Supabase database?')) return;
    setBusy(true);
    setError(null);
    try {
      await seedPassionItems();
      await loadData();
      setNotice('Default items successfully saved to Supabase!');
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to seed items to Supabase');
    } finally {
      setBusy(false);
    }
  };

  const openCreate = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('photography');
    setDescription('');
    setMediaUrl('');
    setThumbnailUrl('');
    setLocation('');
    setGearInfo('');
    setIsVisible(true);
    setIsCreating(true);
    setError(null);
    setNotice(null);
  };

  const openEdit = (item: PassionItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setDescription(item.description);
    setMediaUrl(item.mediaUrl);
    setThumbnailUrl(item.thumbnailUrl);
    setLocation(item.location);
    setGearInfo(item.gearInfo);
    setIsVisible(item.isVisible);
    setIsCreating(true);
    setError(null);
    setNotice(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setBusy(true);
    setError(null);

    const payload = {
      title: title.trim(),
      category,
      description: description.trim(),
      mediaUrl: mediaUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim() || mediaUrl.trim(),
      location: location.trim(),
      gearInfo: gearInfo.trim(),
      isVisible,
    };

    try {
      if (editingItem) {
        await updatePassionItem(editingItem.id, payload);
      } else {
        await createPassionItem(payload);
      }
      setIsCreating(false);
      setEditingItem(null);
      await loadData();
      setNotice('Creative item saved successfully.');
      setTimeout(() => setNotice(null), 3000);
    } catch (err: any) {
      setError(err?.message || 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this creative work?')) return;
    setBusy(true);
    setError(null);
    try {
      await deletePassionItem(id);
      await loadData();
      setNotice('Item removed successfully.');
      setTimeout(() => setNotice(null), 3000);
    } catch (err: any) {
      setError(err?.message || 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Creative Passions Manager</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Curate your photography captures, cinematography reels, and digital art pieces.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasFallbackItems && (
              <Button variant="outline" size="sm" onClick={handleSeed} disabled={busy}>
                <Database className="w-3.5 h-3.5 mr-1 text-primary" /> Save Samples to DB
              </Button>
            )}
            <Button onClick={openCreate} disabled={busy}>
              <Plus className="w-4 h-4 mr-1.5" /> Add Creative Work
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </p>
          )}
          {notice && (
            <p className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-xs text-green-300">
              {notice}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading creative items…</p>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground space-y-3">
              <p className="text-sm">No creative works added yet.</p>
              <Button variant="outline" size="sm" onClick={openCreate}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Your First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border flex items-center justify-center">
                      {it.thumbnailUrl || it.mediaUrl ? (
                        <img src={it.thumbnailUrl || it.mediaUrl} alt="" className="w-full h-full object-cover" />
                      ) : it.category === 'cinematography' ? (
                        <Film className="w-5 h-5 text-purple-400" />
                      ) : (
                        <Camera className="w-5 h-5 text-pink-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-pink-400 px-2 py-0.5 rounded-full bg-pink-500/10 uppercase">
                          {it.category.replace('_', ' ')}
                        </span>
                        {!it.isVisible && (
                          <span className="text-xs text-yellow-400 flex items-center gap-1">
                            <EyeOff className="w-3 h-3" /> Hidden
                          </span>
                        )}
                        {!isUuid(it.id) && (
                          <span className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                            Sample
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm text-foreground mt-1">
                        {it.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {it.location ? `${it.location} · ` : ''}{it.gearInfo || it.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openEdit(it)} disabled={busy}>
                      <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(it.id)} disabled={busy}>
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
            <CardTitle>{editingItem ? 'Edit Creative Work' : 'Add Creative Work'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Golden Hour Riverbank Reflection"
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
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    <option value="photography">Photography</option>
                    <option value="cinematography">Cinematography (Video/Reel)</option>
                    <option value="visual_art">Visual Arts &amp; 3D</option>
                    <option value="other">Other Creative Pursuits</option>
                  </select>
                </div>

                {/* Image / Video Media URL */}
                <div className="md:col-span-2">
                  <AssetUploadField
                    label="Media File / Photo"
                    value={mediaUrl}
                    disabled={busy}
                    onChange={(url) => setMediaUrl(url)}
                  />
                </div>

                {/* Video Embed Link if Cinematography */}
                {category === 'cinematography' && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      YouTube / Vimeo Reel Link
                    </label>
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                )}

                {/* Location */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Cox's Bazar / Bandarban"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Gear Info */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Camera Gear &amp; Settings
                  </label>
                  <input
                    type="text"
                    value={gearInfo}
                    onChange={(e) => setGearInfo(e.target.value)}
                    placeholder="e.g. Sony A7 IV · 24-70mm f/2.8"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Story / Caption
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="The story behind this photo, shooting conditions, lighting technique…"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Visibility */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isPassionVisible"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="isPassionVisible" className="text-sm font-medium text-foreground cursor-pointer">
                    Visible on Public Passion Gallery
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)} disabled={busy}>
                  Cancel
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy ? 'Saving…' : 'Save Item'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
