
import { 
  BarChart, 
  Calendar, 
  DollarSign, 
  PieChart, 
  Users, 
  Bell, 
  Settings, 
  Archive 
} from 'lucide-react';

const features = [
  {
    icon: <DollarSign className="h-10 w-10 text-money" />,
    title: 'Controle de Orçamento',
    description: 'Defina suas metas financeiras e acompanhe despesas e receitas automaticamente.'
  },
  {
    icon: <PieChart className="h-10 w-10 text-finance" />,
    title: 'Relatórios Visuais',
    description: 'Visualize seus gastos por categoria com relatórios simples de entender.'
  },
  {
    icon: <Calendar className="h-10 w-10 text-money" />,
    title: 'Lembretes de Pagamento',
    description: 'Nunca mais perca o prazo de uma conta com alertas personalizados.'
  },
  {
    icon: <BarChart className="h-10 w-10 text-finance" />,
    title: 'Projeção Financeira',
    description: 'Planeje seu futuro financeiro com simulações e metas realistas.'
  },
  {
    icon: <Users className="h-10 w-10 text-money" />,
    title: 'Finanças em Família',
    description: 'Compartilhe o controle financeiro com seu parceiro ou família.'
  },
  {
    icon: <Bell className="h-10 w-10 text-finance" />,
    title: 'Alertas de Gastos',
    description: 'Receba notificações quando exceder o limite de uma categoria.'
  },
];

const premiumFeatures = [
  {
    icon: <Archive className="h-10 w-10 text-amber-500" />,
    title: 'Gestão de Estoque',
    description: 'Controle completo de produtos, estoque e vendas para seu negócio.'
  },
  {
    icon: <Settings className="h-10 w-10 text-amber-500" />,
    title: 'Ferramentas para Empresas',
    description: 'Relatórios avançados, múltiplos usuários e automações para seu negócio.'
  }
];

const Features = () => {
  return (
    <section id="features" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-lg mb-6">Recursos poderosos para transformar suas finanças</h2>
          <p className="text-gray-600 text-lg">
            Nossa plataforma foi desenvolvida para simplificar o gerenciamento financeiro, 
            ajudando você a economizar mais e alcançar seus objetivos.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 pt-10 border-t border-gray-100">
          <h2 className="heading-md text-center mb-10">Recursos Premium para Empresas</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-sm border border-amber-200 hover:shadow-md transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
