import { useState, useRef, useEffect } from 'react';
import { Upload, X, CheckCircle2, Cloud, AlertCircle, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { api } from '@/lib/api';
import type { UploadResponse, StorageStatusResponse } from '@/types';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  aspectHint?: string;
}

export function ImageUpload({
  label = 'Upload Image',
  value = '',
  onChange,
  folder = 'uploads',
  className = '',
  aspectHint = 'JPG, PNG, WebP up to 15MB',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [storageInfo, setStorageInfo] = useState<StorageStatusResponse | null>(null);
  const [lastUploaded, setLastUploaded] = useState<UploadResponse | null>(null);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [manualUrl, setManualUrl] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  useEffect(() => {
    api.getStorageStatus()
      .then(setStorageInfo)
      .catch(() => {});
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setError(null);

    // Validate size (15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds 15MB limit.');
      return;
    }

    // Temporary local preview while uploading
    const tempUrl = URL.createObjectURL(file);
    setPreview(tempUrl);
    setUploading(true);

    try {
      const res = await api.uploadImage(file, folder);
      setPreview(res.url);
      setLastUploaded(res);
      onChange(res.url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    setLastUploaded(null);
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const applyManualUrl = () => {
    if (manualUrl.trim()) {
      setPreview(manualUrl.trim());
      onChange(manualUrl.trim());
      setShowUrlInput(false);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <label className="font-semibold text-gray-800 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-primary-600" />
          <span>{label}</span>
        </label>
        
        {/* Storage backend indicator badge */}
        <div className="flex items-center gap-1">
          {storageInfo?.configured ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <Cloud className="w-2.5 h-2.5" />
              Cloudflare R2
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200" title="Add CLOUDFLARE_R2_* to backend/.env to use Cloudflare R2">
              <Cloud className="w-2.5 h-2.5 opacity-60" />
              Local Storage
            </span>
          )}

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-primary-600 hover:text-primary-700 underline flex items-center gap-0.5 ml-1"
          >
            <LinkIcon className="w-2.5 h-2.5" />
            {showUrlInput ? 'Use Uploader' : 'Paste URL'}
          </button>
        </div>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
          <button
            type="button"
            onClick={applyManualUrl}
            className="px-3 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700"
          >
            Apply
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !preview && !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer overflow-hidden ${
            preview
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 hover:border-primary-500 bg-white hover:bg-primary-50/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
          />

          {preview ? (
            <div className="relative group w-full h-44 bg-gray-900 flex items-center justify-center">
              <img
                src={preview}
                alt="Upload preview"
                className="w-full h-full object-cover group-hover:opacity-85 transition-opacity"
              />

              {uploading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                  <span className="text-xs font-semibold">
                    {storageInfo?.configured ? 'Uploading to Cloudflare R2...' : 'Saving image...'}
                  </span>
                </div>
              )}

              {!uploading && (
                <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-black text-white text-xs backdrop-blur-sm flex items-center gap-1"
                    title="Replace image"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span className="text-[10px] hidden sm:inline">Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-700 text-white backdrop-blur-sm"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {lastUploaded && (
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>
                    {lastUploaded.storage === 'cloudflare_r2' ? 'Saved to Cloudflare R2' : 'Saved to storage'}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-gray-800">
                Click to browse or drag & drop photo
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">{aspectHint}</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1 text-[11px] text-red-600 mt-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
