import React, { useState, useRef } from 'react';
import { Plus, ArrowUp, X, FileText } from 'lucide-react';

const ChatInput = ({ onSend, disabled = false, placeholder = "اسأل عن أي شيء", centered = false, isSidebarOpen = true }) => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message, selectedFiles);
      setMessage('');
      setSelectedFiles([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={` bg-gradient-to-t from-gray-50 dark:from-gray-900 via-gray-50 dark:via-gray-900 to-transparent pt-8 pb-6 px-4 transition-all duration-300 ease-out ${ isSidebarOpen ? 'lg:right-72' : 'lg:right-20'} right-14`}>
      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
        {/* Selected Files */}
        
        {selectedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-primary rounded-lg px-3 py-2 shadow-sm"
              >
                <FileText size={16} className="text-primary" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Container */}
        <div className="relative bg-primary rounded-full shadow-2xl flex items-center gap-3 px-6 py-4">
          {/* File Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors flex-shrink-0"
            title="إرفاق ملف"
          >
            <Plus size={22} />
          </button>

          {/* Input Field */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
           className="flex-1 bg-transparent text-white placeholder-white placeholder-opacity-80 text-base lg:text-lg outline-none border-none focus:outline-none focus:ring-0"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="bg-white text-primary p-2 rounded-full hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <ArrowUp size={22} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
