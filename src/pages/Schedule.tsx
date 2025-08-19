import React from 'react';
import { useSchedules } from '@/hooks/useSchedules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, MapPin } from 'lucide-react';

const Schedule = () => {
  const { schedules, loading, getDayName, formatScheduleTime } = useSchedules();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">A carregar horários...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-primary rounded-full">
            <Clock className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Horário dos Cultos
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Junte-se a nós nos nossos momentos de adoração, estudo e comunhão. 
          Todos são bem-vindos!
        </p>
      </div>

      {/* Services Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className="hover:shadow-warm transition-all duration-300 hover:-translate-y-1 border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-xl">{schedule.title}</CardTitle>
                <Badge variant="secondary">{getDayName(schedule.day_of_week)}</Badge>
              </div>
              {schedule.description && (
                <CardDescription className="text-base">
                  {schedule.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-primary">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{getDayName(schedule.day_of_week)}</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium text-lg">{formatScheduleTime(schedule.time_start, schedule.time_end)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Schedule;