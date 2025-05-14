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
    icon: <DollarSign className="h-10 w-10 text-money dark:text-sky-400" />,
    title: 'Controle de Orçamento',
    description: 'Defina suas metas financeiras e acompanhe despesas e receitas automaticamente.'
  },
  {
    icon: <PieChart className="h-10 w-10 text-finance dark:text-blue-400" />,
    title: 'Relatórios Visuais',
    description: 'Visualize seus gastos por categoria com relatórios simples de entender.'
  },
  {
    icon: <Calendar className="h-10 w-10 text-money dark:text-sky-400" />,
    title: 'Lembretes de Pagamento',
    description: 'Nunca mais perca o prazo de uma conta com alertas personalizados.'
  },
  {
    icon: <BarChart className="h-10 w-10 text-finance dark:text-blue-400" />,
    title: 'Projeção Financeira',
    description: 'Planeje seu futuro financeiro com simulações e metas realistas.'
  },
  {
    icon: <Users className="h-10 w-10 text-money dark:text-sky-400" />,
    title: 'Finanças em Família',
    description: 'Compartilhe o controle financeiro com seu parceiro ou família.'
  },
  {
    icon: <Bell className="h-10 w-10 text-finance dark:text-blue-400" />,
    title: 'Alertas de Gastos',
    description: 'Receba notificações quando exceder o limite de uma categoria.'
  },
];

const premiumFeatures = [
  {
    icon: <Archive className="h-10 w-10 text-amber-500 dark:text-amber-400" />,
    title: 'Gestão de Estoque',
    description: 'Controle completo de produtos, estoque e vendas para seu negócio.'
  },
  {
    icon: <Settings className="h-10 w-10 text-amber-500 dark:text-amber-400" />,
    title: 'Ferramentas para Empresas',
    description: 'Relatórios avançados, múltiplos usuários e automações para seu negócio.'
  }
];

const Features = () => {
  return (
    <section id="features" className="section-padding bg-white dark:bg-slate-900">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="heading-lg mb-6 text-gray-900 dark:text-white">Recursos poderosos para transformar suas finanças</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Nossa plataforma foi desenvolvida para simplificar o gerenciamento financeiro, 
            ajudando você a economizar mais e alcançar seus objetivos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-700 flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 pt-10 border-t border-gray-100 dark:border-slate-700">
          <h2 className="heading-md text-center mb-10 text-gray-900 dark:text-white">Recursos Premium para Empresas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-amber-200 dark:border-amber-700 flex flex-col items-center text-center sm:items-start sm:text-left">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-amber-50">{feature.title}</h3>
                <p className="text-gray-700 dark:text-amber-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

