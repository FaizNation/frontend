import { useState, useRef, useEffect } from 'react';
import aiService from '../../services/aiService';

const ChatBot = ({ stressLevel, recommendations }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Halo! Saya Dr. MindBalance. Bagaimana perasaan Anda hari ini? Saya di sini untuk membantu Anda mengelola stres dan memberikan dukungan.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const botResponse = await aiService.chat(userMessage, stressLevel, recommendations);
      
      // Ensure the response is a string to prevent React render crashes (white screen)
      let responseText = '';
      if (typeof botResponse === 'string') {
        responseText = botResponse;
      } else if (botResponse && typeof botResponse === 'object') {
        // Handle common object response structures from Python APIs
        responseText = botResponse.response || botResponse.reply || botResponse.message || botResponse.data || JSON.stringify(botResponse);
      } else {
        responseText = String(botResponse);
      }

      setMessages(prev => [...prev, { role: 'bot', text: responseText }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Maaf, saya sedang mengalami kendala teknis. Silakan coba beberapa saat lagi.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-lexend">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in animate-zoom-in">
          {/* Header */}
          <div className="bg-primary p-5 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner">
                <span className="material-symbols-outlined text-white text-2xl">neurology</span>
              </div>
              <div>
                <h3 className="font-manrope font-bold text-sm leading-tight">Dr. MindBalance</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-medium text-white/80">Aktif & Siap Membantu</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none border border-primary/20' 
                      : 'bg-white text-on-surface rounded-tl-none border border-gray-100'
                  }`}
                >
                  {typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-50">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ketik pesan Anda di sini..."
                className="w-full pl-4 pr-14 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm text-on-surface placeholder:text-gray-400"
              />
              <button 
                type="submit"
                disabled={!message.trim() || isLoading}
                className="absolute right-2 p-2 text-primary hover:bg-primary/5 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <span className="material-symbols-outlined font-bold">send</span>
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-2">AI kami dilatih untuk membantu, namun tetap konsultasikan dengan ahli jika diperlukan.</p>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-primary/30 transition-all duration-300 active:scale-90 group ${
          isOpen ? 'bg-white text-primary border border-gray-100' : 'bg-primary text-white hover:scale-105'
        }`}
      >
        <span className={`material-symbols-outlined text-3xl transition-transform duration-300 ${isOpen ? 'rotate-90 scale-90' : 'group-hover:rotate-12'}`}>
          {isOpen ? 'close' : 'chat'}
        </span>
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></div>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
