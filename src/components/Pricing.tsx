
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '@/context/AuthContext';

const pricingPlans = [
  {
    title: 'Gratuito',
    price: 'R$ 0',
    description: 'Todas as funções essenciais para controlar suas finanças pessoais',
    features: [
      'Gestão de despesas e receitas',
      'Categorização de gastos',
      'Relatórios básicos',
      'Definição de metas',
      'Lembretes de contas',
      'Controle de orçamento'
    ],
    buttonText: 'Começar Grátis',
    highlight: false
  },
  {
    title: 'Premium',
    price: 'R$ 20/mês',
    description: 'Recursos avançados para empresas e controle de estoque',
    features: [
      'Todas as funções do plano gratuito',
      'Gestão completa de estoque',
      'Múltiplos usuários',
      'Relatórios avançados',
      'Controle de fluxo de caixa',
      'Previsões financeiras inteligentes',
      'Atendimento prioritário'
    ],
    buttonText: 'Assinar Premium',
    highlight: true
  }
];

const Pricing = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const { isAuthenticated, isPremium, upgradeToPremium } = useAuth();

  const handlePlanClick = (isPremiumPlan: boolean) => {
    if (!isAuthenticated) {
      setAuthMode('signup');
      setIsAuthModalOpen(true);
    } else if (isPremiumPlan && !isPremium) {
      handleUpgrade();
    }
  };

  const handleUpgrade = async () => {
    // In a real app, this would redirect to a payment page
    await upgradeToPremium();
    alert('Parabéns! Seu plano foi atualizado para Premium.');
  };

  return (
    <section id="pricing" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-lg mb-6">Planos simples para suas necessidades</h2>
          <p className="text-gray-600 text-lg">
            Escolha o plano ideal para suas necessidades financeiras, sem taxas escondidas.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl overflow-hidden shadow-lg border ${
                plan.highlight ? 'border-primary' : 'border-gray-100'
              }`}
            >
              {plan.highlight && (
                <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                  Recomendado para empresas
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.title === 'Premium' && <span className="text-gray-500 ml-1">/mês</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-money mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className={`w-full ${plan.highlight ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.highlight ? 'default' : 'outline'}
                  onClick={() => handlePlanClick(plan.title === 'Premium')}
                  disabled={isAuthenticated && ((plan.title === 'Premium' && isPremium) || (plan.title === 'Gratuito' && !isPremium))}
                >
                  {isAuthenticated 
                    ? plan.title === 'Premium'
                      ? isPremium 
                        ? 'Plano Atual' 
                        : 'Fazer Upgrade'
                      : !isPremium 
                        ? 'Plano Atual' 
                        : 'Fazer Downgrade'
                    : plan.buttonText
                  }
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
      />
    </section>
  );
};

export default Pricing;
