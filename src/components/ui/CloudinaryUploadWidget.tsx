'use client';

import { useState, useRef } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from './button';
import { 
  UploadCloud, 
  Laptop, 
  Link as LinkIcon, 
  Plus, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon 
} from 'lucide-react';

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (url: string) => void;
  uploadPreset?: string;
  multiple?: boolean;
  compact?: boolean;
  className?: string;
}

export function CloudinaryUploadWidget({ 
  onUploadSuccess, 
  uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'naqash',
  multiple = true,
  compact = false,
  className = '',
}: CloudinaryUploadWidgetProps) {
  const [directUrl, setDirectUrl] = useState('');
  const [showDirectInput, setShowDirectInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; filename: string } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessCount, setUploadSuccessCount] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'slqao1ue';

  const handleDirectAdd = () => {
    if (directUrl.trim()) {
      onUploadSuccess(directUrl.trim());
      setDirectUrl('');
      setShowDirectInput(false);
    }
  };

  /**
   * Uploads a single file to Cloudinary: tries direct client POST first, falls back to Next.js API
   */
  const uploadSingleFile = async (file: File): Promise<string> => {
    // 1. Try direct upload to Cloudinary API with upload_preset
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.secure_url) {
        return data.secure_url;
      }
      if (data?.error?.message) {
        throw new Error(data.error.message);
      }
    } catch (clientErr) {
      console.warn('Direct Cloudinary upload failed, falling back to server route:', clientErr);
    }

    // 2. Fallback to Next.js server route /api/upload
    const serverFormData = new FormData();
    serverFormData.append('file', file);

    const serverRes = await fetch('/api/upload', {
      method: 'POST',
      body: serverFormData,
    });

    const serverData = await serverRes.json();
    if (serverRes.ok && serverData.url) {
      return serverData.url;
    }

    throw new Error(serverData?.error || 'Failed to upload image to Cloudinary.');
  };

  /**
   * Process multiple or single files selected from user's local system
   */
  const handleFilesSelected = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).filter((file) => 
      file.type.startsWith('image/')
    );

    if (fileArray.length === 0) {
      setUploadError('Please select valid image files (PNG, JPG, WEBP, AVIF).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccessCount(0);

    let successCount = 0;
    const total = fileArray.length;

    for (let i = 0; i < total; i++) {
      const file = fileArray[i];
      setUploadProgress({ current: i + 1, total, filename: file.name });

      try {
        const secureUrl = await uploadSingleFile(file);
        onUploadSuccess(secureUrl);
        successCount++;
        setUploadSuccessCount(successCount);
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
        setUploadError(`Failed to upload "${file.name}": ${(err as Error).message}`);
        // If single file, stop; if multiple, continue with the rest
        if (total === 1) break;
      }
    }

    setIsUploading(false);
    setUploadProgress(null);

    // Reset native input so the user can select the same file again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Clear success message after 4 seconds
    setTimeout(() => {
      setUploadSuccessCount(0);
    }, 4000);
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden native file input for OS file dialog */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files) {
            handleFilesSelected(e.target.files);
          }
        }}
        multiple={multiple}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
        className="hidden"
      />

      {/* Drag & Drop / Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer text-center relative overflow-hidden ${
          compact ? 'p-4' : 'p-6'
        } ${
          isDragging
            ? 'border-burgundy bg-burgundy/5 scale-[1.01]'
            : 'border-[#DFD7C9] bg-ivory/60 hover:bg-cream-alt/50 hover:border-[#C9A15C]'
        } ${isUploading ? 'pointer-events-none opacity-80' : ''}`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2 py-2">
            <Loader2 className="w-8 h-8 text-burgundy animate-spin" />
            <div className="text-xs font-semibold text-text-dark">
              Uploading to Cloudinary...
            </div>
            {uploadProgress && (
              <p className="text-[11px] text-text-muted">
                Processing {uploadProgress.current} of {uploadProgress.total}:{' '}
                <span className="font-mono font-medium text-text-dark">{uploadProgress.filename}</span>
              </p>
            )}
            <div className="w-48 bg-[#DFD7C9] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-burgundy h-full transition-all duration-300"
                style={{
                  width: uploadProgress
                    ? `${(uploadProgress.current / uploadProgress.total) * 100}%`
                    : '50%',
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-burgundy/10 flex items-center justify-center text-burgundy">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-dark">
                Click to browse files from your computer
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                or drag & drop photography here <span className="text-[#C9A15C] font-medium">(auto-uploaded to Cloudinary)</span>
              </p>
            </div>
            <span className="inline-block text-[10px] uppercase tracking-wider text-text-muted/80 bg-white px-2.5 py-0.5 rounded-full border border-[#DFD7C9]">
              PNG, JPG, WEBP, AVIF up to 10MB
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Direct System Upload Button */}
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 border-burgundy/40 text-burgundy hover:bg-burgundy hover:text-white bg-white shadow-xs cursor-pointer text-xs uppercase tracking-wider font-semibold rounded-xl h-9"
          >
            <Laptop className="w-3.5 h-3.5" />
            Upload from Computer
          </Button>

          {/* Cloudinary Widget (Alternate) */}
          <CldUploadWidget 
            uploadPreset={uploadPreset}
            options={{
              sources: ['local', 'url', 'camera', 'dropbox'],
              multiple: multiple,
              clientAllowedFormats: ['png', 'jpeg', 'webp', 'jpg', 'avif'],
            }}
            onSuccess={(result: any) => {
              if (result?.info?.secure_url) {
                onUploadSuccess(result.info.secure_url);
              }
            }}
            onError={(error: any) => {
              console.error('Cloudinary upload error:', error);
            }}
          >
            {({ open }) => (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => open()}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-dark cursor-pointer rounded-xl h-9"
              >
                <UploadCloud className="w-3.5 h-3.5 text-text-muted" />
                Cloudinary Widget
              </Button>
            )}
          </CldUploadWidget>
        </div>

        {/* Paste URL Toggle */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowDirectInput(!showDirectInput)}
          className="text-xs text-text-muted hover:text-burgundy flex items-center gap-1.5 cursor-pointer rounded-xl h-9"
        >
          <LinkIcon className="w-3 h-3" />
          {showDirectInput ? 'Hide URL' : 'Or paste Cloudinary URL'}
        </Button>
      </div>

      {/* Success Notification */}
      {uploadSuccessCount > 0 && !isUploading && (
        <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-800 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Successfully uploaded {uploadSuccessCount} image{uploadSuccessCount > 1 ? 's' : ''} to Cloudinary!
          </span>
        </div>
      )}

      {/* Error Notification */}
      {uploadError && (
        <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="flex-1">{uploadError}</span>
          <button 
            type="button" 
            onClick={() => setUploadError(null)}
            className="text-red-700 hover:text-red-900 font-bold ml-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Direct URL Input */}
      {showDirectInput && (
        <div className="flex items-center gap-2 max-w-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <input
            type="url"
            placeholder="https://res.cloudinary.com/.../image.jpg"
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            className="flex-1 text-xs border border-[#DFD7C9] rounded-xl p-2.5 bg-white focus:outline-none focus:border-burgundy"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleDirectAdd}
            disabled={!directUrl.trim()}
            className="bg-burgundy hover:bg-burgundy-deep text-white text-xs px-4 py-2.5 flex items-center gap-1 rounded-xl shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add URL
          </Button>
        </div>
      )}
    </div>
  );
}
