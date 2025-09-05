import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Volume2, VolumeX, Clock, User, Calendar } from 'lucide-react';
import { useRadioPrograms } from '@/hooks/useRadioPrograms';

export default function Radio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { programs, loading } = useRadioPrograms();

  const radioUrl = "https://stream.zeno.fm/ug07t11zn0hvv";

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const getDayName = (dayIndex: number) => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayIndex];
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  const getCurrentProgram = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);

    return programs.find(program => 
      program.visible &&
      program.day_of_week === currentDay &&
      program.time_start <= currentTime &&
      (program.time_end ? program.time_end >= currentTime : true)
    );
  };

  const currentProgram = getCurrentProgram();

  const programsByDay = programs
    .filter(program => program.visible)
    .reduce((acc, program) => {
      const day = program.day_of_week;
      if (!acc[day]) acc[day] = [];
      acc[day].push(program);
      return acc;
    }, {} as Record<number, typeof programs>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Rádio ADPM Montijo
          </h1>
          <p className="text-lg text-muted-foreground">
            A sua rádio cristã - Transmitindo esperança e fé 24h
          </p>
        </div>

        {/* Player Section */}
        <Card className="mb-8 border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Transmissão Ao Vivo</CardTitle>
            {currentProgram && (
              <CardDescription className="text-lg">
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <User size={14} />
                    {currentProgram.host_name || 'Rádio ADPM'}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatTime(currentProgram.time_start)} - {currentProgram.time_end ? formatTime(currentProgram.time_end) : 'Fim'}
                  </Badge>
                </div>
                <div className="mt-2 font-semibold text-primary">
                  {currentProgram.title}
                </div>
                {currentProgram.description && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    {currentProgram.description}
                  </div>
                )}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              {/* Play Button */}
              <Button
                onClick={togglePlay}
                size="lg"
                className="w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                variant={isPlaying ? "secondary" : "default"}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </Button>

              {/* Volume Controls */}
              <div className="flex items-center space-x-4 w-full max-w-md">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="sm"
                  className="shrink-0"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-muted-foreground w-8">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>

              {/* Status */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isPlaying ? '🔴 Ao vivo' : 'Clique para ouvir'}
                </p>
              </div>
            </div>

            {/* Hidden Audio Element */}
            <audio
              ref={audioRef}
              src={radioUrl}
              preload="none"
              onLoadStart={() => setIsPlaying(true)}
              onError={() => setIsPlaying(false)}
            />
          </CardContent>
        </Card>

        {/* Programming Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={24} />
              Programação da Semana
            </CardTitle>
            <CardDescription>
              Confira a programação completa da Rádio ADPM Montijo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>Carregando programação...</p>
              </div>
            ) : (
              <Tabs defaultValue="0" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  {[0, 1, 2, 3, 4, 5, 6].map(day => (
                    <TabsTrigger key={day} value={day.toString()}>
                      {getDayName(day).slice(0, 3)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {[0, 1, 2, 3, 4, 5, 6].map(day => (
                  <TabsContent key={day} value={day.toString()} className="mt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{getDayName(day)}</h3>
                      {programsByDay[day] && programsByDay[day].length > 0 ? (
                        <div className="grid gap-4">
                          {programsByDay[day].map(program => (
                            <Card key={program.id} className="border-l-4 border-l-primary">
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold">{program.title}</h4>
                                    {program.description && (
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {program.description}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-4 mt-2">
                                      <Badge variant="outline" className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {formatTime(program.time_start)} - {program.time_end ? formatTime(program.time_end) : 'Fim'}
                                      </Badge>
                                      {program.host_name && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                          <User size={12} />
                                          {program.host_name}
                                        </Badge>
                                      )}
                                      {program.category && program.category !== 'general' && (
                                        <Badge variant="outline">
                                          {program.category}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>Nenhum programa programado para {getDayName(day).toLowerCase()}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Sobre a Rádio ADPM Montijo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                A Rádio ADPM Montijo é uma rádio cristã dedicada a transmitir mensagens de esperança, 
                fé e comunhão. Nossa programação inclui louvores, estudos bíblicos, mensagens 
                inspiradoras e momentos de oração para fortalecer a sua caminhada com Deus.
              </p>
              <p className="text-muted-foreground mt-4">
                Sintonize-nos e faça parte desta comunidade de fé que cresce a cada dia!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}