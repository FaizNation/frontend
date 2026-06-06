import { useState, useRef, useEffect } from 'react';
import aiService from '../../services/aiService';

const ChatBot = ({ stressLevel, recommendations }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: 'Halo! Aku MindBot 🤖✨ Asisten kesehatan mental AI-mu. Aku siap membantu dengan tips stres, kecemasan, tidur, atau sekadar mendengarkan. Bagaimana perasaanmu hari ini?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const userMessage = typeof textToSend === 'string' ? textToSend : message.trim();
    if (!userMessage || isLoading) return;

    if (typeof textToSend !== 'string') setMessage('');
    
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text: userMessage, time: now }]);
    setIsLoading(true);

    try {
      const botResponse = await aiService.chat(userMessage, stressLevel, recommendations);
      
      let responseText = '';
      if (typeof botResponse === 'string') {
        responseText = botResponse;
      } else if (botResponse && typeof botResponse === 'object') {
        responseText = botResponse.response || botResponse.reply || botResponse.message || botResponse.data || JSON.stringify(botResponse);
      } else {
        responseText = String(botResponse);
      }

      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: responseText, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Maaf, saya sedang mengalami kendala teknis. Silakan coba beberapa saat lagi.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Aku merasa stres",
    "Tips meditasi",
    "Susah tidur",
    "Butuh teman bicara"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-lexend">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[300px] sm:w-[360px] h-[480px] bg-white rounded-[28px] shadow-[0_20px_50px_-12px_rgba(12,82,82,0.12)] border border-gray-100 flex flex-col overflow-hidden animate-fade-in animate-zoom-in">
          {/* Header */}
          <div className="bg-[#f8fdfd] px-5 py-3.5 flex justify-between items-center border-b border-gray-50">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#0c5252] flex items-center justify-center shadow-md shadow-[#0c5252]/20">
                <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <div>
                <h3 className="font-manrope font-black text-[#1a1c1a] text-base leading-tight">MindBot</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AI Asisten Mental</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400"
            >
              <span className="material-symbols-outlined text-xl font-bold">close</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white custom-scrollbar">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex gap-2.5 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.role === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-[#0c5252] flex items-center justify-center shrink-0 self-end mb-0.5">
                      <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                    </div>
                  )}
                  <div 
                    className={`p-3.5 rounded-[20px] text-[13px] leading-relaxed whitespace-pre-wrap break-words ${
                      msg.role === 'user' 
                        ? 'bg-[#0c5252] text-white rounded-tr-none shadow-sm shadow-[#0c5252]/10' 
                        : 'bg-white text-[#3f4848] rounded-tl-none border border-gray-100 shadow-sm'
                    }`}
                  >
                    {typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text)}
                  </div>
                </div>
                <span className={`text-[9px] font-bold text-gray-300 mt-1.5 ${msg.role === 'user' ? 'mr-1.5' : 'ml-9'}`}>
                  {msg.time}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2.5 animate-fade-in">
                <div className="w-6 h-6 rounded-full bg-[#0c5252] flex items-center justify-center shrink-0 self-end">
                   <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-[20px] rounded-tl-none border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-[#0c5252]/40 rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-[#0c5252]/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1 h-1 bg-[#0c5252]/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Area */}
          <div className="p-5 bg-white space-y-3.5">
            {/* Suggestions */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="px-3.5 py-1.5 rounded-full border border-primary/10 text-[#0c5252] text-[10px] font-bold whitespace-nowrap hover:bg-primary/5 transition-colors active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }} 
              className="flex items-center gap-2.5 bg-[#f4f6f6] p-1.5 rounded-[20px]"
            >
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ceritakan perasaanmu..."
                className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-1.5 text-[13px] text-[#1a1c1a] placeholder:text-gray-400 font-medium"
              />
              <button 
                type="submit"
                disabled={!message.trim() || isLoading}
                className="w-9 h-9 rounded-full bg-[#0c5252] text-white flex items-center justify-center shadow-md shadow-[#0c5252]/10 hover:scale-105 active:scale-90 transition-all disabled:opacity-40 disabled:hover:scale-100"
              >
                <span className="material-symbols-outlined text-[18px] rotate-[-30deg] translate-x-0.5 -translate-y-0.5">send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 active:scale-90 group relative ${
          isOpen ? 'bg-white text-[#0c5252] border border-gray-100' : 'bg-[#2D6A6A] text-white hover:scale-110'
        }`}
      >
        <span className={`material-symbols-outlined text-[28px] transition-all duration-500 ${isOpen ? 'rotate-90' : 'group-hover:rotate-12'}`}>
          {isOpen ? 'close' : 'chat_bubble'}
        </span>
        {!isOpen && (
          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#faf9f6] shadow-sm animate-pulse"></div>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
