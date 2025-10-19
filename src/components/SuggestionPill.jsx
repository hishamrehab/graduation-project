import React from 'react';

const SuggestionPill = ({ text, onClick }) => {
  return (
    <button
      onClick={() => onClick(text)}
      className="px-6 py-3 border-2 border-primary text-primary bg-white dark:bg-gray-800 dark:text-cyan-400 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white rounded-full transition-all hover:scale-105 text-sm lg:text-base font-medium shadow-sm"
    >
      {text}
    </button>
  );
};

export default SuggestionPill;
