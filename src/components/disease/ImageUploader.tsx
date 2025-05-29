import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X, Camera, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading?: boolean;
  className?: string;
}

export function ImageUploader({ 
  onImageUpload, 
  isLoading = false, 
  className = '' 
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const processFile = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, or WebP)');
      return false;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return false;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    return true;
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    
    if (processFile(file)) {
      onImageUpload(file);
    }
  }, [onImageUpload, processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setError(null);
    
    if (processFile(file)) {
      onImageUpload(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    disabled: isLoading,
    noClick: !!preview
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-green-500 bg-green-50 scale-[1.01] shadow-md' : 'border-gray-200 hover:border-green-400'}
          ${isLoading ? 'opacity-80 cursor-wait' : ''}
          ${preview ? 'p-2' : 'min-h-[240px] flex items-center justify-center'}
          overflow-hidden bg-white
        `}
      >
        <input 
          {...getInputProps()} 
          onChange={handleFileInput}
          className="hidden"
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3 w-full h-full">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-green-500 animate-pulse" />
              <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-green-600 animate-spin" />
            </div>
            <p className="text-sm font-medium text-gray-700">Analyzing your image</p>
            <p className="text-xs text-gray-500 max-w-xs">This may take a few moments...</p>
          </div>
        ) : preview ? (
          <div className="relative group">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={preview}
                alt="Preview"
                className={`mx-auto max-h-[400px] w-auto object-contain transition-transform duration-300 ${
                  isHovered ? 'scale-105' : 'scale-100'
                }`}
              />
              {isHovered && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 w-full">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-green-500" />
                </div>
                <div className="absolute -right-1 -bottom-1 bg-white p-1.5 rounded-full shadow-sm border border-gray-200">
                  <Camera className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {isDragActive ? 'Drop the image here' : 'Upload a photo'}
                </p>
                <p className="text-xs text-gray-500">
                  {isDragActive 
                    ? 'Release to upload' 
                    : 'Drag & drop an image, or click to select'}
                  </p>
              </div>
              
              <div className="w-full max-w-xs">
                <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-50 border border-gray-200">
                    JPG
                  </span>
                  <span className="mx-1 text-gray-400">•</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-50 border border-gray-200">
                    PNG
                  </span>
                  <span className="mx-1 text-gray-400">•</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-50 border border-gray-200">
                    WEBP
                  </span>
                  <span className="ml-2 text-gray-400">≤5MB</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
          <p className="text-sm text-red-700 flex items-start">
            <X className="flex-shrink-0 h-4 w-4 mt-0.5 mr-1.5" />
            <span>{error}</span>
          </p>
        </div>
      )}
      
      {!isLoading && !preview && (
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <ImageIcon className="h-4 w-4 text-gray-400" />
          <span>For best results, take a clear photo of the affected leaves or fruit</span>
        </div>
      )}
      
      {preview && (
        <Button 
          type="button" 
          className="mt-4 w-full" 
          disabled={isLoading}
          onClick={() => document.dispatchEvent(new Event('submit-disease-detection'))}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Detect Disease'
          )}
        </Button>
      )}
    </div>
  );
}
