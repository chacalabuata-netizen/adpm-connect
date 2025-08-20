import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImagesUploaded: (urls: string[]) => void;
  maxImages?: number;
  existingImages?: string[];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesUploaded,
  maxImages = 5,
  existingImages = []
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        toast({
          title: "Erro",
          description: `${file.name} não é um tipo de imagem válido`,
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "Erro", 
          description: `${file.name} é muito grande (máximo 5MB)`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length + existingImages.length > maxImages) {
      toast({
        title: "Erro",
        description: `Máximo de ${maxImages} imagens permitidas`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFiles(validFiles);
    
    // Create preview URLs
    const previews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('church-images')
          .upload(`community/${fileName}`, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('church-images')
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      onImagesUploaded([...existingImages, ...uploadedUrls]);
      setSelectedFiles([]);
      setPreviewUrls([]);
      
      toast({
        title: "Sucesso",
        description: `${uploadedUrls.length} imagem(s) carregada(s) com sucesso!`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as imagens",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removePreview = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const removeExistingImage = (url: string) => {
    const newImages = existingImages.filter(img => img !== url);
    onImagesUploaded(newImages);
  };

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Clique para selecionar imagens ou arraste aqui
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG, GIF até 5MB • Máximo {maxImages} imagens
          </p>
        </label>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Carregando imagens...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {/* Selected Files Preview */}
      {previewUrls.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Imagens selecionadas:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <button
                  onClick={() => removePreview(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={uploading}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={uploadImages} 
            disabled={uploading}
            className="w-full"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            {uploading ? 'Carregando...' : `Carregar ${selectedFiles.length} imagem(s)`}
          </Button>
        </div>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Imagens carregadas:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {existingImages.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <button
                  onClick={() => removeExistingImage(url)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={uploading}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
