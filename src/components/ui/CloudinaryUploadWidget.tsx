'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from './button';
import { UploadCloud, Link as LinkIcon, Plus } from 'lucide-react';

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (url: string) => void;
  uploadPreset?: string;
}

export function CloudinaryUploadWidget({ 
  onUploadSuccess, 
  uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'naqash'
}: CloudinaryUploadWidgetProps) {
  const [directUrl, setDirectUrl] = useState('');
  const [showDirectInput, setShowDirectInput] = useState(false);

  const handleDirectAdd = () => {
    if (directUrl.trim()) {
      onUploadSuccess(directUrl.trim());
      setDirectUrl('');
      setShowDirectInput(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <CldUploadWidget 
          uploadPreset={uploadPreset}
          options={{
            sources: ['local', 'url', 'camera'],
            multiple: true,
            clientAllowedFormats: ['png', 'jpeg', 'webp', 'jpg'],
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
              variant="outline" 
              onClick={() => open()}
              className="flex items-center gap-2 border-[#C9A15C]/60 hover:border-[#C9A15C] text-text-dark bg-ivory"
            >
              <UploadCloud className="w-4 h-4 text-burgundy" />
              Upload via Cloudinary
            </Button>
          )}
        </CldUploadWidget>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowDirectInput(!showDirectInput)}
          className="text-xs text-text-muted hover:text-text-dark flex items-center gap-1.5"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          {showDirectInput ? 'Hide URL input' : 'Or paste Cloudinary URL'}
        </Button>
      </div>

      {showDirectInput && (
        <div className="flex items-center gap-2 max-w-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <input
            type="url"
            placeholder="https://res.cloudinary.com/.../image.jpg"
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            className="flex-1 text-xs border border-[#DFD7C9] rounded-lg p-2.5 bg-background focus:outline-none focus:ring-1 focus:ring-burgundy"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleDirectAdd}
            disabled={!directUrl.trim()}
            className="bg-burgundy hover:bg-burgundy-deep text-white text-xs px-3 py-2.5 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
