
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    id: 1,
    content: "Desde que comecei a usar o DinheroEsperto, consegui economizar mais de 20% do meu salário todo mês. A visualização clara dos meus gastos me ajudou a identificar onde estava desperdiçando dinheiro.",
    author: "Ana Silva",
    role: "Professora",
    avatar: "/placeholder.svg"
  },
  {
    id: 2,
    content: "Como autônomo, era difícil controlar minhas finanças. O DinheroEsperto simplificou tudo e agora consigo planejar melhor meus investimentos e despesas mensais.",
    author: "Carlos Oliveira",
    role: "Designer Freelancer",
    avatar: "/placeholder.svg"
  },
  {
    id: 3,
    content: "A versão premium para minha pequena loja foi um divisor de águas. O controle de estoque integrado com as finanças me economiza horas de trabalho toda semana.",
    author: "Julia Santos",
    role: "Proprietária de Loja",
    avatar: "/placeholder.svg"
  },
  {
    id: 4,
    content: "Finalmente um sistema que simplifica as finanças familiares! Eu e meu marido conseguimos alinhar nossos gastos e economizar para a casa própria.",
    author: "Mariana Costa",
    role: "Engenheira",
    avatar: "/placeholder.svg"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const nextTestimonial = () => {
    if (animating) return;
    
    setAnimating(true);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    
    setTimeout(() => {
      setAnimating(false);
    }, 500);
  };

  const prevTestimonial = () => {
    if (animating) return;
    
    setAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    
    setTimeout(() => {
      setAnimating(false);
    }, 500);
  };

  return (
    <section id="testimonials" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-lg mb-6">O que nossos usuários dizem</h2>
          <p className="text-gray-600 text-lg">
            Milhares de pessoas já transformaram suas finanças usando nossa plataforma. Veja alguns depoimentos.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="flex flex-col h-full">
              <div className="mb-8">
                <svg className="h-12 w-12 text-money/30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.039 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                </svg>
              </div>
              
              <div>
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={testimonial.id} 
                    className={`transition-opacity duration-500 absolute w-full ${
                      activeIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <p className="text-xl text-gray-700 italic mb-8">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                      <div>
                        <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                        <p className="text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-12 flex justify-between items-center">
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          activeIndex === index ? 'bg-money' : 'bg-gray-300'
                        }`}
                        onClick={() => setActiveIndex(index)}
                      />
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={prevTestimonial}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextTestimonial}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </Button>
                  </div>
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
