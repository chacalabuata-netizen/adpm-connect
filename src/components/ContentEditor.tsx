import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, FileText, Video, Save, Share, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
}

export const ContentEditor = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedContents, setSavedContents] = useState<any[]>([]);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setSelectedFiles(Array.from(files));
    }
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `community-content/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('church-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('church-images')
          .getPublicUrl(filePath);

        return {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          url: publicUrl,
          type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
          size: file.size
        };
      });

      const newFiles = await Promise.all(uploadPromises);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setSelectedFiles([]);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success("Ficheiros carregados com sucesso!");
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error("Erro ao carregar ficheiros");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // Load saved content
  useEffect(() => {
    loadSavedContent();
  }, []);

  const loadSavedContent = async () => {
    try {
      const { data, error } = await supabase
        .from('community_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedContents(data || []);
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
    }
  };

  const saveContent = async () => {
    if (!title.trim()) {
      toast.error("Por favor, insira um título");
      return;
    }

    if (!user) {
      toast.error("Erro de autenticação");
      return;
    }

    setSaving(true);
    try {
      const mediaUrls = uploadedFiles.map(file => file.url);
      
      if (selectedContentId) {
        // Update existing content
        const { error } = await supabase
          .from('community_content')
          .update({
            title,
            description,
            content,
            media_urls: mediaUrls,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedContentId);

        if (error) throw error;
        toast.success("Conteúdo atualizado com sucesso!");
      } else {
        // Create new content
        const { error } = await supabase
          .from('community_content')
          .insert({
            title,
            description,
            content,
            media_urls: mediaUrls,
            created_by: user.id
          });

        if (error) throw error;
        toast.success("Conteúdo salvo como rascunho!");
      }

      // Reset form and reload content
      setTitle("");
      setDescription("");
      setContent("");
      setUploadedFiles([]);
      setSelectedContentId(null);
      loadSavedContent();
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
      toast.error("Erro ao salvar conteúdo");
    } finally {
      setSaving(false);
    }
  };

  const publishToCommunity = async (contentId: string) => {
    try {
      // First get the content data
      const { data: contentData, error: fetchError } = await supabase
        .from('community_content')
        .select('*')
        .eq('id', contentId)
        .single();

      if (fetchError) throw fetchError;

      // Get the profile ID for the current user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        toast.error("Erro: Perfil do utilizador não encontrado");
        return;
      }

      if (!profile) {
        toast.error("Erro: Perfil do utilizador não encontrado");
        return;
      }

      // Create community post using profile ID
      const { error: postError } = await supabase
        .from('community_posts')
        .insert({
          title: contentData.title,
          content: `${contentData.description || ''}\n\n${contentData.content || ''}`,
          category: 'anuncio',
          author_id: profile.id,
          media_urls: contentData.media_urls
        });

      if (postError) {
        console.error('Erro ao criar post:', postError);
        throw postError;
      }

      // Update content status
      const { error: updateError } = await supabase
        .from('community_content')
        .update({ status: 'published' })
        .eq('id', contentId);

      if (updateError) throw updateError;

      toast.success("Conteúdo publicado na comunidade!");
      loadSavedContent();
    } catch (error) {
      console.error('Erro ao publicar:', error);
      toast.error("Erro ao publicar conteúdo");
    }
  };

  const editContent = (content: any) => {
    setTitle(content.title);
    setDescription(content.description || '');
    setContent(content.content || '');
    setSelectedContentId(content.id);
    
    // Load media files if any
    if (content.media_urls && content.media_urls.length > 0) {
      const files = content.media_urls.map((url: string, index: number) => ({
        id: `existing-${index}`,
        name: url.split('/').pop() || 'file',
        url,
        type: url.includes('.mp4') || url.includes('.webm') ? 'video' : 'image',
        size: 0
      }));
      setUploadedFiles(files);
    }
  };

  const deleteContent = async (contentId: string) => {
    if (!confirm('Tem certeza que deseja eliminar este conteúdo?')) return;

    try {
      const { error } = await supabase
        .from('community_content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;
      
      toast.success("Conteúdo eliminado!");
      loadSavedContent();
    } catch (error) {
      console.error('Erro ao eliminar:', error);
      toast.error("Erro ao eliminar conteúdo");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Form */}
          <Card className="lg:col-span-2 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedContentId ? 'Editar Conteúdo' : 'Novo Conteúdo'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Título</label>
                <Input
                  type="text"
                  placeholder="Digite o título do conteúdo..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Descrição</label>
                <Textarea
                  placeholder="Digite a descrição do conteúdo..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[80px] resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Conteúdo Detalhado</label>
                <Textarea
                  placeholder="Digite o conteúdo detalhado..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[120px] resize-none"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={saveContent}
                  disabled={saving}
                  className="flex-1"
                  size="lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Salvando...' : selectedContentId ? 'Atualizar' : 'Salvar Rascunho'}
                </Button>
                {selectedContentId && (
                  <Button 
                    onClick={() => {
                      setTitle("");
                      setDescription("");
                      setContent("");
                      setUploadedFiles([]);
                      setSelectedContentId(null);
                    }}
                    variant="outline"
                    size="lg"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Saved Content List */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Conteúdo Salvo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {savedContents.map((item) => (
                  <div key={item.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Status: {item.status === 'draft' ? 'Rascunho' : 'Publicado'}
                    </p>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => editContent(item)}
                        className="text-xs"
                      >
                        Editar
                      </Button>
                      {item.status === 'draft' && (
                        <Button 
                          size="sm"
                          onClick={() => publishToCommunity(item.id)}
                          className="text-xs"
                        >
                          <Share className="h-3 w-3 mr-1" />
                          Publicar
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteContent(item.id)}
                        className="text-xs"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {savedContents.length === 0 && (
                  <p className="text-muted-foreground text-sm">Nenhum conteúdo salvo</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* File Upload */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload de Ficheiros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">
                  Clique para selecionar ficheiros
                </p>
                <p className="text-sm text-muted-foreground">
                  Imagens e vídeos até 50MB
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

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Ficheiros Selecionados:</h4>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {file.name} ({formatFileSize(file.size)})
                    </div>
                  ))}
                  <Button 
                    onClick={uploadFiles}
                    disabled={uploading}
                    className="w-full"
                  >
                    {uploading ? 'Carregando...' : 'Carregar Ficheiros'}
                  </Button>
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Ficheiros Carregados:</h4>
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        {file.type === 'image' ? (
                          <Image className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Video className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-sm">{file.name}</span>
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

          {/* Preview */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pré-visualização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="relative">
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};