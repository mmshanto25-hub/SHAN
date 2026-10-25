import { useState } from 'react';
import { uploadPortfolioAsset } from '@/lib/api';

export function AssetUploadField({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be 10 MB or smaller.');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      onChange(await uploadPortfolioAsset(file, 'images'));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Could not upload image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://…"
        disabled={disabled || uploading}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <input
        type="file"
        accept="image/*"
        disabled={disabled || uploading}
        onChange={(event) => {
          void upload(event.target.files?.[0]);
          event.currentTarget.value = '';
        }}
        aria-label={`Upload ${label.toLowerCase()}`}
        className="block w-full text-xs text-muted-foreground"
      />
      {uploading && <p className="text-xs text-muted-foreground">Uploading image…</p>}
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
