import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'; // Adicionando Quote para o ícone de citação

const testimonials = [
  {
    id: 1,
    content: "Desde que comecei a usar o DinheroEsperto, consegui economizar mais de 20% do meu salário todo mês. A visualização clara dos meus gastos me ajudou a identificar onde estava desperdiçando dinheiro.",
    author: "Ana Silva",
    role: "Professora",
    avatar: "https://i.pravatar.cc/80?img=1" // Usando avatares de placeholder reais
  },
  {
    id: 2,
    content: "Como autônomo, era difícil controlar minhas finanças. O DinheroEsperto simplificou tudo e agora consigo planejar melhor meus investimentos e despesas mensais.",
    author: "Carlos Oliveira",
    role: "Designer Freelancer",
    avatar: "https://i.pravatar.cc/80?img=2"
  },
  {
    id: 3,
    content: "A versão premium para minha pequena loja foi um divisor de águas. O controle de estoque integrado com as finanças me economiza horas de trabalho toda semana.",
    author: "Julia Santos",
    role: "Proprietária de Loja",
    avatar: "https://i.pravatar.cc/80?img=3"
  },
  {
    id: 4,
    content: "Finalmente um sistema que simplifica as finanças familiares! Eu e meu marido conseguimos alinhar nossos gastos e economizar para a casa própria.",
    author: "Mariana Costa",
    role: "Engenheira",
    avatar: "https://i.pravatar.cc/80?img=4"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const handleNavigation = (newIndex: number) => {
    if (animating) return;
    setAnimating(true);
    setActiveIndex(newIndex);
    setTimeout(() => {
      setAnimating(false);
    }, 300); // Duração da animação de opacidade
  };

  const nextTestimonial = () => {
    const newIndex = activeIndex === testimonials.length - 1 ? 0 : activeIndex + 1;
    handleNavigation(newIndex);
  };

  const prevTestimonial = () => {
    const newIndex = activeIndex === 0 ? testimonials.length - 1 : activeIndex - 1;
    handleNavigation(newIndex);
  };

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white leading-tight">
            O que nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">usuários dizem</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300">
            Milhares de pessoas já transformaram suas finanças usando nossa plataforma. Veja alguns depoimentos.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto relative">
          {/* Card de Depoimento */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 md:p-10 border border-slate-200 dark:border-slate-700 transition-colors duration-300 min-h-[380px] md:min-h-[320px] flex flex-col justify-between">
            <div>
              <Quote className="h-10 w-10 text-sky-500 dark:text-sky-400 mb-4 opacity-70" />
              <div className="relative h-[150px] md:h-[120px] overflow-hidden">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={testimonial.id} 
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out flex items-center ${
                      activeIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <p className="text-md md:text-lg text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center mb-6">
                <img 
                  src={testimonials[activeIndex].avatar} 
                  alt={testimonials[activeIndex].author} 
                  className="w-12 h-12 rounded-full mr-4 border-2 border-sky-200 dark:border-sky-700"
                />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100">{testimonials[activeIndex].author}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{testimonials[activeIndex].role}</p>
                </div>
              </div>

              {/* Navegação e Paginação */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      aria-label={`Ver depoimento ${index + 1}`}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out ${
                        activeIndex === index ? 'bg-sky-500 dark:bg-sky-400 scale-125' : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                      }`}
                      onClick={() => handleNavigation(index)}
                    />
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

