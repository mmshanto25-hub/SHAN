import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Tv, BookOpen, EyeOff, Database, Video } from 'lucide-react';
import { 
  fetchVlogPosts, 
  createVlogPost, 
  updateVlogPost, 
  deleteVlogPost, 
  seedVlogPosts,
  isUuid,
  type VlogPost 
} from '@/lib/extendedApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CloudinaryVideoUploader } from '@/admin/CloudinaryVideoUploader';

export const AdminVlogEditor: React.FC = () => {
  const [posts, setPosts] = useState<VlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<VlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [postType, setPostType] = useState<'article' | 'video' | 'gallery'>('video');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaPublicId, setMediaPublicId] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailPublicId, setThumbnailPublicId] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchVlogPosts(true);
      setPosts(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Could not load vlog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const hasFallbackItems = posts.some((p) => !isUuid(p.id));

  const handleSeed = async () => {
    if (!window.confirm('Save all default sample vlog posts into your database?')) return;
    setBusy(true);
    setError(null);
    try {
      await seedVlogPosts();
      await loadData();
      setNotice('Default vlogs successfully saved to database!');
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to seed vlogs to database');
    } finally {
      setBusy(false);
    }
  };

  const openCreate = () => {
    setEditingPost(null);
    setTitle('');
    setPostType('video');
    setSummary('');
    setContent('');
    setMediaUrl('');
    setMediaPublicId('');
    setThumbnailUrl('');
    setThumbnailPublicId('');
    setTags('');
    setIsPublished(true);
    setIsCreating(true);
    setError(null);
    setNotice(null);
  };

  const openEdit = (p: VlogPost) => {
    setEditingPost(p);
    setTitle(p.title);
    setPostType(p.postType);
    setSummary(p.summary);
    setContent(p.content);
    setMediaUrl(p.mediaUrl);
    setMediaPublicId(p.mediaPublicId || '');
    setThumbnailUrl(p.thumbnailUrl);
    setThumbnailPublicId(p.thumbnailPublicId || '');
    setTags(p.tags.join(', '));
    setIsPublished(p.isPublished);
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
      postType,
      summary: summary.trim(),
      content: content.trim(),
      mediaUrl: mediaUrl.trim(),
      mediaPublicId: mediaPublicId.trim(),
      thumbnailUrl: thumbnailUrl.trim(),
      thumbnailPublicId: thumbnailPublicId.trim(),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      isPublished,
    };

    try {
      if (editingPost) {
        await updateVlogPost(editingPost.id, payload);
      } else {
        await createVlogPost(payload);
      }
      setIsCreating(false);
      setEditingPost(null);
      await loadData();
      setNotice('Vlog entry saved successfully.');
      setTimeout(() => setNotice(null), 3000);
    } catch (err: any) {
      setError(err?.message || 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this post?')) return;
    setBusy(true);
    setError(null);
    try {
      await deleteVlogPost(id);
      await loadData();
      setNotice('Post removed successfully.');
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
            <CardTitle>Vlog &amp; Articles Manager</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Upload videos via Cloudinary Unsigned Upload (Preset: <code className="text-primary font-mono text-[11px]">portfolio_vlogs</code>) and manage articles.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasFallbackItems && (
              <Button variant="outline" size="sm" onClick={handleSeed} disabled={busy}>
                <Database className="w-3.5 h-3.5 mr-1 text-primary" /> Save Samples to DB
              </Button>
            )}
            <Button onClick={openCreate} disabled={busy}>
              <Plus className="w-4 h-4 mr-1.5" /> Add New Post
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
            <p className="text-sm text-muted-foreground">Loading posts…</p>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground space-y-3">
              <p className="text-sm">No posts created yet.</p>
              <Button variant="outline" size="sm" onClick={openCreate}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Your First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border flex items-center justify-center">
                      {post.thumbnailUrl ? (
                        <img src={post.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      ) : post.postType === 'video' ? (
                        <Tv className="w-5 h-5 text-red-400" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold text-primary px-1.5 py-0.5 rounded bg-primary/20">
                          {post.postType}
                        </span>
                        {!post.isPublished && (
                          <span className="text-xs text-yellow-400 flex items-center gap-1">
                            <EyeOff className="w-3 h-3" /> Draft
                          </span>
                        )}
                        {!isUuid(post.id) && (
                          <span className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                            Sample
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm text-foreground mt-1 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()} · {post.tags.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openEdit(post)} disabled={busy}>
                      <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)} disabled={busy}>
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor Modal / Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPost ? 'Edit Vlog Entry' : 'Create Vlog Entry'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Behind the Scenes Drone Shoot in the Northern Valleys"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Post Type */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Format / Type
                  </label>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    <option value="video">Video (Cloudinary Upload / Embed)</option>
                    <option value="article">Article (Text &amp; Images)</option>
                    <option value="gallery">Gallery (Visual Album)</option>
                  </select>
                </div>

                {/* Published Toggle */}
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium text-foreground cursor-pointer">
                    Visible on Public Vlog (Published)
                  </label>
                </div>

                {/* Cloudinary Video Upload Section */}
                <div className="md:col-span-2 p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      Vlog Video File (Cloudinary Unsigned Upload)
                    </span>
                  </div>
                  <CloudinaryVideoUploader
                    label="Select or Drag Video File (Unsigned Preset: portfolio_vlogs)"
                    mediaUrl={mediaUrl}
                    publicId={mediaPublicId}
                    resourceType="video"
                    onUploadComplete={(result) => {
                      setMediaUrl(result.secure_url);
                      setMediaPublicId(result.public_id);
                    }}
                    disabled={busy}
                  />
                </div>

                {/* Cloudinary Cover Thumbnail Upload Section */}
                <div className="md:col-span-2 p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                  <CloudinaryVideoUploader
                    label="Cover Thumbnail Image (Cloudinary Unsigned Upload)"
                    mediaUrl={thumbnailUrl}
                    publicId={thumbnailPublicId}
                    resourceType="image"
                    onUploadComplete={(result) => {
                      setThumbnailUrl(result.secure_url);
                      setThumbnailPublicId(result.public_id);
                    }}
                    disabled={busy}
                  />
                </div>

                {/* Summary */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Summary / Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="A brief punchy overview for the vlog snippet…"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Full Content */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Article Full Content / Story Notes
                  </label>
                  <textarea
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your article or notes here…"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Cinematography, 4K, ColorGrading, BehindTheScenes"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)} disabled={busy}>
                  Cancel
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy ? 'Saving…' : 'Save Vlog Entry'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
