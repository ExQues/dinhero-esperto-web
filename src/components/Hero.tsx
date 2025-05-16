import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';

const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-slate-50 to-sky-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-800 dark:text-white py-16 md:py-24 lg:py-32 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
          {/* Conteúdo de Texto */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-slate-900 dark:text-white">
              Controle financeiro <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700 dark:from-sky-400 dark:to-blue-500">simples e eficaz</span> para todos
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-xl mx-auto lg:mx-0">
              Organize suas finanças, economize mais e alcance seus objetivos financeiros com nossa plataforma completa de gerenciamento de dinheiro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button 
                size="lg" 
                className="text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-sky-500 dark:to-blue-600 dark:hover:from-sky-600 dark:hover:to-blue-700 font-semibold shadow-lg transform hover:scale-105 transition-transform duration-200"
                onClick={() => setIsAuthModalOpen(true)} 
                aria-label="Começar Gratuitamente"
              >
                Começar Gratuitamente
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-slate-400 dark:border-slate-500 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-500 dark:hover:border-slate-400 transition-colors duration-200 font-semibold"
                aria-label="Ver demonstração"
              >
                Ver demonstração
              </Button>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start text-sm text-slate-500 dark:text-slate-400">
              <div className="flex -space-x-2 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i} 
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-700"
                    src={`https://i.pravatar.cc/40?img=${i+10}`} 
                    alt={`Usuário ${i}`}
                  />
                ))}
              </div>
              <p>
                Junte-se a <span className="font-bold text-slate-700 dark:text-slate-200">+5.000</span> pessoas que já controlam suas finanças
              </p>
            </div>
          </div>
          
          {/* Imagem/Card de Exemplo */}
          <div className="w-full lg:w-1/2 relative mt-10 lg:mt-0">
            <div className="relative bg-white dark:bg-slate-800 shadow-2xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 transform transition-all duration-500 hover:scale-105 animate-float-slow">
              <div className="p-5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-sky-600 dark:to-blue-700 border-b border-slate-200 dark:border-slate-600">
                <h3 className="text-white font-semibold text-lg">Visão Geral das Finanças</h3>
              </div>
              <div className="p-5 space-y-5">
                <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg shadow-md">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Saldo Total</h4>
                  <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">R$ 5.840,00</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Atualizado hoje</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1 bg-slate-100 dark:bg-slate-700 p-4 rounded-lg shadow-md">
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Receitas</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">R$ 3.500</p>
                  </div>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-700 p-4 rounded-lg shadow-md">
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Despesas</p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">R$ 1.250</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-700 dark:text-slate-200">Categorias principais</h4>
                  {[ { name: "Moradia", percent: 30, color: "bg-sky-500" }, 
                    { name: "Alimentação", percent: 20, color: "bg-blue-500" }, 
                    { name: "Transporte", percent: 15, color: "bg-amber-500" }].map(cat => (
                    <div key={cat.name} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 dark:text-slate-300">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                          <div className={`h-full ${cat.color}`} style={{ width: `${cat.percent}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">{cat.percent}%</span>
                      </div>
                    </div>
                  ))}
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

