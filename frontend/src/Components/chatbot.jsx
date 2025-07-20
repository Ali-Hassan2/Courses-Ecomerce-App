// components/Chatbot.tsx
import React from 'react';

const Chatbot = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg">
        Chat with us
      </button>
      {/* Later: Add popup window, messages, icons, etc. */}
    </div>
  );
};

export default Chatbot;
