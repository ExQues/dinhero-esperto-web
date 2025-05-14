import { 
  BarChart, 
  Calendar, 
  DollarSign, 
  PieChart, 
  Users, 
  Bell, 
  Settings, 
  Archive,
  ShieldCheck, // Novo ícone para segurança
  Zap, // Novo ícone para velocidade/performance
  TrendingUp // Novo ícone para crescimento
} from 'lucide-react';

const features = [
  {
    icon: <DollarSign className="h-10 w-10 text-sky-500" />,
    title: 'Controle de Orçamento Detalhado',
    description: 'Defina suas metas financeiras e acompanhe despesas e receitas automaticamente com precisão.'
  },
  {
    icon: <PieChart className="h-10 w-10 text-blue-500" />,
    title: 'Relatórios Visuais Inteligentes',
    description: 'Visualize seus gastos por categoria com gráficos interativos e fáceis de entender.'
  },
  {
    icon: <Calendar className="h-10 w-10 text-sky-500" />,
    title: 'Lembretes de Pagamento Proativos',
    description: 'Nunca mais perca o prazo de uma conta com alertas personalizados e notificações inteligentes.'
  },
  {
    icon: <TrendingUp className="h-10 w-10 text-blue-500" />,
    title: 'Projeção Financeira Avançada',
    description: 'Planeje seu futuro financeiro com simulações de cenários e metas de longo prazo.'
  },
  {
    icon: <Users className="h-10 w-10 text-sky-500" />,
    title: 'Finanças Colaborativas Seguras',
    description: 'Compartilhe o controle financeiro com seu parceiro ou família de forma segura e organizada.'
  },
  {
    icon: <Bell className="h-10 w-10 text-blue-500" />,
    title: 'Alertas de Gastos Personalizáveis',
    description: 'Receba notificações instantâneas quando exceder o limite de uma categoria ou meta.'
  },
];

const premiumFeatures = [
  {
    icon: <Archive className="h-10 w-10 text-amber-400" />,
    title: 'Gestão de Estoque Integrada',
    description: 'Controle completo de produtos, estoque e vendas, sincronizado com suas finanças empresariais.'
  },
  {
    icon: <Settings className="h-10 w-10 text-amber-400" />,
    title: 'Ferramentas Avançadas para Empresas',
    description: 'Relatórios customizáveis, múltiplos perfis de usuário e automações para otimizar seu negócio.'
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-amber-400" />,
    title: 'Segurança de Nível Bancário',
    description: 'Proteção robusta para seus dados financeiros com criptografia de ponta e backups automáticos.'
  },
  {
    icon: <Zap className="h-10 w-10 text-amber-400" />,
    title: 'Performance e Suporte Prioritário',
    description: 'Acesso rápido à plataforma e suporte dedicado para garantir a melhor experiência para sua empresa.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Recursos <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">poderosos</span> para transformar suas finanças
          </h2>
          <p className="text-lg sm:text-xl text-slate-300">
            Nossa plataforma foi desenvolvida para simplificar o gerenciamento financeiro, 
            ajudando você a economizar mais e alcançar seus objetivos com clareza e segurança.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 border border-slate-700 transform hover:-translate-y-1 flex flex-col"
            >
              <div className="mb-5 self-start">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-slate-100">{feature.title}</h3>
              <p className="text-slate-400 text-sm flex-grow">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 md:mt-24 pt-12 md:pt-16 border-t border-slate-700">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-amber-400">Recursos Premium para Empresas</h2>
            <p className="text-md sm:text-lg text-slate-300">
              Eleve a gestão do seu negócio com ferramentas exclusivas e suporte especializado.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {premiumFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-slate-800 to-slate-800/70 p-6 rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all duration-300 border border-amber-700/50 transform hover:-translate-y-1 flex flex-col"
              >
                <div className="mb-5 self-start">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-amber-300">{feature.title}</h3>
                <p className="text-slate-400 text-sm flex-grow">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

