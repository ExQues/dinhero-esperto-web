import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import AuthModal from "./AuthModal";
import { useAuth } from "@/context/AuthContext";

const pricingPlans = [
  {
    title: "Gratuito",
    price: "R$ 0",
    description: "Todas as funções essenciais para controlar suas finanças pessoais com clareza.",
    features: [
      "Gestão de despesas e receitas",
      "Categorização inteligente de gastos",
      "Relatórios básicos e intuitivos",
      "Definição de metas financeiras",
      "Lembretes de contas a pagar",
      "Controle de orçamento simplificado",
    ],
    buttonText: "Começar Gratuitamente",
    highlight: false,
    ctaClass: "bg-sky-600 hover:bg-sky-700 text-white",
    cardClass: "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
  },
  {
    title: "Premium",
    price: "R$ 20",
    pricePeriod: "/mês",
    description: "Recursos avançados para empresas, controle de estoque e insights poderosos.",
    features: [
      "Todas as funções do plano gratuito",
      "Gestão completa de estoque e inventário",
      "Múltiplos usuários e permissões",
      "Relatórios avançados e personalizáveis",
      "Controle de fluxo de caixa detalhado",
      "Previsões financeiras com IA",
      "Suporte prioritário dedicado",
    ],
    buttonText: "Assinar Premium",
    highlight: true,
    ctaClass: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg transform hover:scale-105 transition-transform duration-200",
    cardClass: "bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 border-amber-500 dark:border-amber-500 scale-105"
  },
];

const Pricing = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const { isAuthenticated, isPremium, upgradeToPremium } = useAuth();

  const handlePlanClick = (isPremiumPlan: boolean) => {
    if (!isAuthenticated) {
      setAuthMode("signup");
      setIsAuthModalOpen(true);
    } else if (isPremiumPlan && !isPremium) {
      handleUpgrade();
    }
  };

  const handleUpgrade = async () => {
    await upgradeToPremium();
    alert("Parabéns! Seu plano foi atualizado para Premium.");
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Planos <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500">flexíveis</span> para suas necessidades
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300">
            Escolha o plano ideal para suas finanças pessoais ou para sua empresa, sem taxas escondidas e com total transparência.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto items-stretch">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden shadow-2xl border flex flex-col ${plan.cardClass} ${plan.highlight ? "relative" : ""} transition-colors duration-300`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                  MAIS POPULAR
                </div>
              )}

              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? "text-amber-600 dark:text-amber-300" : "text-sky-600 dark:text-sky-400"}`}>{plan.title}</h3>
                <div className="mb-5">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? "text-slate-800 dark:text-white" : "text-slate-700 dark:text-slate-100"}`}>{plan.price}</span>
                  {plan.pricePeriod && <span className="text-slate-500 dark:text-slate-400 ml-1 text-lg">{plan.pricePeriod}</span>}
                </div>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm min-h-[40px]">{plan.description}</p>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className={`h-5 w-5 ${plan.highlight ? "text-amber-500 dark:text-amber-400" : "text-sky-600 dark:text-sky-500"} mr-2.5 mt-0.5 flex-shrink-0`} />
                      <span className="text-slate-600 dark:text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  className={`w-full font-semibold text-base py-3 ${plan.ctaClass}`}
                  onClick={() => handlePlanClick(plan.title === "Premium")}
                  disabled={isAuthenticated && ((plan.title === "Premium" && isPremium) || (plan.title === "Gratuito" && !isPremium))}
                >
                  {isAuthenticated
                    ? plan.title === "Premium"
                      ? isPremium
                        ? "Seu Plano Atual"
                        : "Fazer Upgrade Agora"
                      : !isPremium
                        ? "Seu Plano Atual"
                        : "Mudar para Gratuito"
                    : plan.buttonText}
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

