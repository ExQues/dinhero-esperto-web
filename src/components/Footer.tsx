import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook", href: "#", icon: <Facebook className="h-5 w-5" /> },
    { name: "Instagram", href: "#", icon: <Instagram className="h-5 w-5" /> },
    { name: "Twitter", href: "#", icon: <Twitter className="h-5 w-5" /> },
  ];

  const footerSections = [
    {
      title: "Recursos",
      links: [
        { name: "Funcionalidades", href: "/#features" },
        { name: "Guia de Início Rápido", href: "#" },
        { name: "Vídeos Tutoriais", href: "#" },
        { name: "Blog de Finanças", href: "#" },
      ],
    },
    {
      title: "Empresa",
      links: [
        { name: "Sobre Nós", href: "#" },
        { name: "Carreiras", href: "#" },
        { name: "Planos e Preços", href: "/#pricing" },
        { name: "Depoimentos", href: "/#testimonials" },
      ],
    },
    {
      title: "Suporte",
      links: [
        { name: "Central de Ajuda", href: "#" },
        { name: "Fale Conosco", href: "#" },
        { name: "Política de Privacidade", href: "#" },
        { name: "Termos de Uso", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-10 md:mb-12">
          {/* Coluna da Logo e Descrição */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-5" aria-label="Página Inicial Dinhero Esperto">
              {/* O gradiente do logo é intencionalmente mantido, pois é uma característica da marca */}
              <span className="font-bold text-2xl bg-clip-text text-transparent hero-gradient">DinheroEsperto</span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
              Simplifique suas finanças e alcance seus objetivos financeiros com nossa plataforma completa e intuitiva.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-slate-500 dark:text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-200"
                  aria-label={`${social.name} Dinhero Esperto`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Colunas de Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-md mb-5">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 hover:underline transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-500 text-xs">
          <p>&copy; {currentYear} DinheroEsperto. Todos os direitos reservados. Feito com ❤️ pela equipe Manus.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

