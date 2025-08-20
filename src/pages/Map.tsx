import React from 'react';
import ChurchMap from '@/components/ChurchMap';

const MapPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Como Chegar</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Encontre a nossa igreja no Montijo. Estamos sempre prontos a recebê-lo de braços abertos.
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <ChurchMap className="max-w-4xl mx-auto" showDetails={true} />
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Informações Úteis</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Transportes Públicos</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Autocarro: Linhas 120, 121 (paragem junto à igreja)</p>
                  <p>• Comboio: Estação do Montijo (10 min a pé)</p>
                  <p>• Ferry: Terminal do Montijo (15 min a pé)</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Estacionamento</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Estacionamento gratuito disponível</p>
                  <p>• Lugares para pessoas com mobilidade reduzida</p>
                  <p>• Acesso fácil através da entrada principal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MapPage;