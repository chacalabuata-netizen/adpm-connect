import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, Phone, Clock, ExternalLink } from 'lucide-react';

interface ChurchMapProps {
  className?: string;
  showDetails?: boolean;
}

const ChurchMap: React.FC<ChurchMapProps> = ({ className = "", showDetails = true }) => {
  const churchInfo = {
    name: "Igreja Adventista do Sétimo Dia - Montijo",
    address: "Rua António José Saraiva, 2870-344 Montijo",
    phone: "+351 212 303 456",
    hours: "Sábados: 9:30 - 12:00",
    website: "https://adventistas.org"
  };

  const openDirections = () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const coordinates = `38.7071,-8.9728`;
    
    if (isMobile) {
      // Try to open in native maps app
      const androidUrl = `geo:${coordinates}?q=${encodeURIComponent(churchInfo.name)}`;
      const iosUrl = `maps://maps.google.com/maps?q=${coordinates}`;
      
      if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
        window.open(iosUrl, '_blank');
      } else {
        window.open(androidUrl, '_blank');
      }
    } else {
      // Open in Google Maps web
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        {/* Google Maps Embed */}
        <div className="w-full h-[400px] rounded-lg shadow-lg overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!4v1756894534110!6m8!1m7!1sck0yQX_O9zcdICEqskMeaQ!2m2!1d38.70446541180975!2d-8.970729087805001!3f162.17!4f-17.78!5f0.7820865974627469"
            width="100%" 
            height="100%" 
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da Igreja"
          />
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={openDirections}
              className="bg-primary hover:bg-primary/90 text-white shadow-lg"
              size="sm"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Como Chegar
            </Button>
            <Button 
              onClick={() => window.open(`tel:${churchInfo.phone}`, '_self')}
              variant="secondary"
              className="shadow-lg"
              size="sm"
            >
              <Phone className="h-4 w-4 mr-2" />
              Ligar
            </Button>
          </div>
        </div>
      </div>

      {/* Church Details Card */}
      {showDetails && (
        <Card className="mt-4 p-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-base">{churchInfo.name}</h3>
                <p className="text-sm text-muted-foreground">{churchInfo.address}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Horários de Culto</p>
                <p className="text-sm text-muted-foreground">{churchInfo.hours}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Contacto</p>
                <a 
                  href={`tel:${churchInfo.phone}`} 
                  className="text-sm text-primary hover:underline"
                >
                  {churchInfo.phone}
                </a>
              </div>
            </div>

            <div className="pt-2 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(churchInfo.website, '_blank')}
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visitar Website
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChurchMap;