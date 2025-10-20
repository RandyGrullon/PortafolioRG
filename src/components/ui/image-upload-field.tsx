'use client';

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadFieldProps {
  id: string;
  label: string;
  value: string | string[];
  onChange: (files: FileList | null) => Promise<void>;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  previewImages?: string[];
  onRemoveImage?: (index: number) => void;
  accept?: string;
  description?: string;
  showDragDropText?: boolean;
  compact?: boolean;
  primaryIndex?: number;
  onSetPrimary?: (index: number) => void;
}

export function ImageUploadField({
  id,
  label,
  value,
  onChange,
  multiple = false,
  maxFiles = 10,
  maxSizeMB = 10,
  disabled = false,
  loading = false,
  className,
  previewImages = [],
  onRemoveImage,
  accept = "image/*",
  description,
  showDragDropText = true,
  compact = false,
  primaryIndex,
  onSetPrimary,
}: ImageUploadFieldProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (disabled || loading) return;

      const files = e.clipboardData?.files;
      if (files && files.length > 0) {
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (imageFiles.length > 0) {
          e.preventDefault();
          const dataTransfer = new DataTransfer();
          imageFiles.forEach(file => dataTransfer.items.add(file));
          await onChange(dataTransfer.files);
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [disabled, loading, onChange]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !loading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled || loading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await onChange(files);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled || loading) return;

    const files = e.target.files;
    if (files && files.length > 0) {
      await onChange(files);
      // Reset input value to allow re-uploading the same file
      e.target.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && !loading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const displayImages = Array.isArray(value) ? value : (value ? [value] : []);
  const hasImages = displayImages.length > 0 || previewImages.length > 0;

  return (
    <div className={cn("space-y-3", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer",
          "hover:border-primary/50 hover:bg-primary/5",
          isDragOver && "border-primary bg-primary/10 scale-[1.02]",
          disabled && "cursor-not-allowed opacity-50",
          loading && "cursor-wait",
          hasImages ? "border-border/50" : "border-border",
          compact ? "p-4" : "p-6",
          className
        )}
      >
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled || loading}
          className="hidden"
        />

        <div className={cn("flex flex-col items-center justify-center text-center", compact ? "space-y-2" : "space-y-3")}>
          {loading ? (
            <>
              <Loader2 className={cn("text-primary animate-spin", compact ? "w-6 h-6" : "w-8 h-8")} />
              <p className="text-sm text-foreground/70">Procesando imágenes...</p>
            </>
          ) : (
            <>
              <div className={cn("rounded-full flex items-center justify-center", compact ? "p-2 bg-primary/10" : "p-3 bg-primary/10")}>
                <Upload className={cn("text-primary", compact ? "w-4 h-4" : "w-6 h-6")} />
              </div>
              <div className={cn("space-y-1", compact && "space-y-0.5")}>
                <p className={cn("font-medium", compact ? "text-sm" : "text-sm")}>
                  {showDragDropText && isDragOver ? "Suelta las imágenes aquí" : "Haz clic para seleccionar o pega"}
                  {multiple ? " imágenes" : " imagen"}
                </p>
                <p className={cn("text-foreground/50", compact ? "text-xs" : "text-xs")}>
                  {multiple
                    ? `Hasta ${maxFiles} imágenes, ${maxSizeMB}MB cada una`
                    : `Máximo ${maxSizeMB}MB`
                  }
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-foreground/60">{description}</p>
      )}

      {/* Images Preview */}
      {hasImages && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {Array.isArray(value) ? `Imágenes (${displayImages.length + previewImages.length})` : "Imagen"}
          </Label>
          <div className={cn("grid gap-3", compact ? "grid-cols-3 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4")}>
            {/* Display uploaded images */}
            {displayImages.map((imageUrl, index) => (
              <div key={`uploaded-${index}`} className="relative group">
                <div className={cn("aspect-square rounded-lg overflow-hidden border border-border bg-muted/50", compact && "aspect-video")}>
                  <img
                    src={imageUrl}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="flex items-center justify-center h-full"><span class="text-xs text-destructive">Error</span></div>';
                      }
                    }}
                  />
                  {index === primaryIndex && (
                    <div className="absolute top-2 left-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    {onSetPrimary && index !== primaryIndex && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-6 w-6 p-0 bg-background/90 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetPrimary(index);
                        }}
                      >
                        <Star className="w-3 h-3" />
                      </Button>
                    )}
                    {onRemoveImage && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveImage(index);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Display preview images */}
            {previewImages.map((imageUrl, index) => (
              <div key={`preview-${index}`} className="relative group">
                <div className={cn("aspect-square rounded-lg overflow-hidden border border-border bg-muted/50", compact && "aspect-video")}>
                  <img
                    src={imageUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="flex items-center justify-center h-full"><span class="text-xs text-destructive">Error</span></div>';
                      }
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <div className={cn("rounded-full p-2 bg-background/90 backdrop-blur-sm", compact ? "p-1" : "p-2")}>
                    <ImageIcon className={cn("text-foreground", compact ? "w-3 h-3" : "w-4 h-4")} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}