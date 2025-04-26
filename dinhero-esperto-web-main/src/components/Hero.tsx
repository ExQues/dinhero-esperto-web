
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';

const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-finance-light to-money-light">
      <div className="container mx-auto section-padding">
        <div className="flex flex-col lg:flex-row lg:items-center">
          <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="heading-xl mb-6">
              Controle financeiro <span className="text-transparent bg-clip-text hero-gradient">simples e eficaz</span> para todos
            </h1>
            <p className="text-lg mb-8 text-gray-700 max-w-lg">
              Organize suas finanças, economize mais e alcance seus objetivos financeiros com nossa plataforma completa de gerenciamento de dinheiro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="hero-gradient" onClick={() => setIsAuthModalOpen(true)}>
                Começar Gratuitamente
              </Button>
              <Button size="lg" variant="outline">
                Ver demonstração
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Junte-se a <span className="font-medium text-gray-900">+5.000</span> pessoas que já controlam suas finanças
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative">
            <div className="relative bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 animate-float">
              <div className="p-4 bg-finance border-b border-gray-100">
                <h3 className="text-white font-medium">Visão Geral das Finanças</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Saldo Total</h4>
                  <p className="text-2xl font-bold text-money">R$ 5.840,00</p>
                  <p className="text-sm text-gray-500">Atualizado hoje</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Receitas</p>
                    <p className="text-lg font-bold text-money">R$ 3.500</p>
                  </div>
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Despesas</p>
                    <p className="text-lg font-bold text-red-500">R$ 1.250</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Categorias principais</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Moradia</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-3/5 h-full bg-money"></div>
                      </div>
                      <span className="text-xs text-gray-600">30%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Alimentação</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-2/5 h-full bg-finance"></div>
                      </div>
                      <span className="text-xs text-gray-600">20%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Transporte</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-1/4 h-full bg-amber-500"></div>
                      </div>
                      <span className="text-xs text-gray-600">15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode="signup" 
      />
    </section>
  );
};

export default Hero;
