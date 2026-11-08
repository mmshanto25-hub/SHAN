import React, { useState, useRef } from 'react';
import { Upload, Video, Image as ImageIcon, X, CheckCircle, AlertCircle, RefreshCw, FileVideo } from 'lucide-react';
import { uploadToCloudinaryUnsigned, type CloudinaryUploadResult } from '@/lib/cloudinary';

interface CloudinaryVideoUploaderProps {
  label?: string;
  mediaUrl: string;
  publicId?: string;
  resourceType?: 'video' | 'image' | 'auto';
  onUploadComplete: (result: { secure_url: string; public_id: string }) => void;
  disabled?: boolean;
}

export const CloudinaryVideoUploader: React.FC<CloudinaryVideoUploaderProps> = ({
  label = 'Upload Video File to Cloudinary',
  mediaUrl,
  publicId,
  resourceType = 'video',
  onUploadComplete,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file?: File) => {
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const result: CloudinaryUploadResult = await uploadToCloudinaryUnsigned(file, {
        resourceType,
        onProgress: (p) => setProgress(p),
      });

      onUploadComplete({
        secure_url: result.secure_url,
        public_id: result.public_id,
      });
      setProgress(100);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload file to Cloudinary.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled || uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const isVideoFile =
    mediaUrl &&
    (mediaUrl.includes('/video/upload') ||
      mediaUrl.endsWith('.mp4') ||
      mediaUrl.endsWith('.webm') ||
      mediaUrl.endsWith('.mov') ||
      mediaUrl.endsWith('.mkv'));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-muted-foreground">
          {label}
        </label>
        {publicId && (
          <span className="text-[11px] font-mono text-primary/80 truncate max-w-[200px]" title={publicId}>
            ID: {publicId}
          </span>
        )}
      </div>

      {/* Main Drag & Drop / Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (!uploading && !disabled) fileInputRef.current?.click();
        }}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-5 transition-all text-center flex flex-col items-center justify-center gap-2 ${
          isDragOver
            ? 'border-primary bg-primary/10 scale-[1.01]'
            : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10'
        } ${disabled || uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={resourceType === 'video' ? 'video/*' : resourceType === 'image' ? 'image/*' : 'video/*,image/*'}
          disabled={disabled || uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.currentTarget.value = '';
          }}
          className="hidden"
        />

        {uploading ? (
          <div className="w-full max-w-xs space-y-2 py-2">
            <div className="flex items-center justify-between text-xs text-foreground font-semibold">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
                Uploading to Cloudinary…
              </span>
              <span className="text-primary font-mono">{progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-premium transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Direct unsigned streaming to Cloudinary · Preset: portfolio_vlogs
            </p>
          </div>
        ) : mediaUrl ? (
          <div className="w-full flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                {isVideoFile ? <Video className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate max-w-[280px] sm:max-w-md">
                  {mediaUrl}
                </p>
                <p className="text-[10px] text-green-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3 h-3" /> Hosted on Cloudinary
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors shrink-0"
            >
              Replace
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-1">
              {resourceType === 'video' ? <FileVideo className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Click to browse or drop your {resourceType === 'video' ? 'video' : 'file'} here
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                MP4, WebM, MOV · Unsigned direct upload via preset <code className="text-primary font-mono text-[10px]">portfolio_vlogs</code>
              </p>
            </div>
          </>
        )}
      </div>

      {/* Manual direct URL fallback input */}
      <div className="flex items-center gap-2">
        <input
          type="url"
          value={mediaUrl}
          onChange={(e) => onUploadComplete({ secure_url: e.target.value, public_id: publicId || '' })}
          placeholder="Or paste an existing Cloudinary secure_url (https://res.cloudinary.com/...)"
          disabled={disabled || uploading}
          className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary"
        />
        {mediaUrl && (
          <button
            type="button"
            onClick={() => onUploadComplete({ secure_url: '', public_id: '' })}
            className="p-2 rounded-xl bg-white/5 hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
            title="Clear media URL"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}
    </div>
  );
};
