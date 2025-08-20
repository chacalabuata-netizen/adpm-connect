import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Image, Video, File, X } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: string;
}

export const ContentEditor = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadFiles(Array.from(files));
    }
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    
    try {
      for (const file of files) {
        // Validate file type
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        
        if (!isImage && !isVideo) {
          toast({
            title: "Erro",
            description: `Ficheiro ${file.name} não é suportado. Apenas imagens e vídeos são permitidos.`,
            variant: "destructive"
          });
          continue;
        }

        // Validate file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
          toast({
            title: "Erro",
            description: `Ficheiro ${file.name} é muito grande. Limite de 50MB.`,
            variant: "destructive"
          });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `community-content/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('church-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('church-images')
          .getPublicUrl(filePath);

        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          url: publicUrl,
          type: isImage ? 'image' : 'video',
          size: formatFileSize(file.size)
        };

        setUploadedFiles(prev => [...prev, newFile]);

        toast({
          title: "Sucesso",
          description: `${file.name} foi carregado com sucesso.`
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar ficheiros. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const saveContent = async () => {
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "Título é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Here you would save the content to your database
      // For now, we'll just show a success message
      toast({
        title: "Sucesso",
        description: "Conteúdo guardado com sucesso!"
      });

      // Reset form
      setTitle('');
      setDescription('');
      setUploadedFiles([]);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao guardar conteúdo.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Content Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              Informações do Conteúdo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="content-title">Título</Label>
              <Input
                id="content-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do conteúdo..."
              />
            </div>
            <div>
              <Label htmlFor="content-description">Descrição</Label>
              <Textarea
                id="content-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite a descrição do conteúdo..."
                rows={4}
              />
            </div>
            <Button onClick={saveContent} className="w-full">
              Guardar Conteúdo
            </Button>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Carregar Ficheiros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">
                Clique para carregar ficheiros
              </p>
              <p className="text-sm text-muted-foreground">
                Imagens e vídeos até 50MB
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, MP4, MOV, AVI
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {isUploading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">
                  A carregar ficheiros...
                </span>
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Ficheiros Carregados</Label>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      {file.type === 'image' ? (
                        <Image className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Video className="h-4 w-4 text-green-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pré-visualização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="relative group">
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={file.url}
                      className="w-full h-32 object-cover rounded-lg"
                      controls
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <p className="text-white text-sm text-center px-2">{file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};