import React from 'react';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-slate-300">
        Esta página está em desenvolvimento. Em breve, você poderá gerenciar seus {title.toLowerCase()} aqui.
      </p>
      <p className="text-md text-slate-400 mt-2">
        Agradecemos a sua paciência!
      </p>
    </div>
  );
};

export default PlaceholderPage;

