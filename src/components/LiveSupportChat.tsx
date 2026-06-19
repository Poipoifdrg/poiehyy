import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { Send, X, MessageSquare, Headphones, ShieldCheck } from 'lucide-react';

interface LiveSupportChatProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export default function LiveSupportChat({
  isOpen,
  onClose,
  messages,
  onSendMessage,
}: LiveSupportChatProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  // Scroll to bottom on updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl border border-purple-100 shadow-2xl flex flex-col overflow-hidden animate-fade-in-up"
      id="live-support-panel"
    >
      {/* Chat header */}
      <div className="bg-gradient-to-r from-brand-purple to-brand-purple-dark text-white p-4 flex justify-between items-center border-b border-brand-orange/15 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center relative shadow-inner">
            <Headphones size={18} className="text-brand-gold animate-bounce-short" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-brand-purple"></span>
          </div>
          <div>
            <h3 className="text-xs font-bold leading-tight flex items-center gap-1">
              <span>บริการแอดมิน paopao VIP</span>
              <ShieldCheck size={12} className="text-brand-gold fill-brand-gold text-brand-purple" />
            </h3>
            <p className="text-[10px] text-stone-300">ความช่วยเหลือแบบ Real-time 24 ชม.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/15 rounded-full text-white/85 hover:text-white transition-all cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages layout */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/10" id="chat-messages-scroll">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col max-w-[80%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              {/* Sender name label */}
              <span className="text-[9px] text-stone-400 font-medium mb-1 px-1">
                {msg.senderName} • {msg.timestamp}
              </span>
              
              {/* Bubble */}
              <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                isUser
                  ? 'bg-brand-purple text-white rounded-tr-none shadow-sm'
                  : msg.sender === 'admin'
                  ? 'bg-white border border-purple-100 text-stone-850 rounded-tl-none shadow-3xs'
                  : 'bg-orange-50 border border-orange-100 text-stone-850 rounded-tl-none shadow-3xs'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Recommended suggestions to speed click */}
      <div className="px-3.5 py-1.5 bg-purple-50/30 border-t border-purple-50 flex gap-2 overflow-x-auto whitespace-nowrap text-[10px]">
        <button
          onClick={() => onSendMessage('ตรวจสอบประวัติแท้แบรนด์เนมอย่างไร?')}
          className="px-2.5 py-1 bg-white hover:bg-purple-100/60 border border-purple-100 rounded-full text-brand-purple cursor-pointer pr-3"
        >
          🔍 ตรวจสอบแท้ยินดีต้อนรับ
        </button>
        <button
          onClick={() => onSendMessage('ฉันจะเพิ่มสินค้าฝากขายได้อย่างไร?')}
          className="px-2.5 py-1 bg-white hover:bg-purple-100/60 border border-purple-100 rounded-full text-brand-purple cursor-pointer pr-3"
        >
          🛍️ สมัครฝากส่งทำอย่างไร
        </button>
      </div>

      {/* Chat footer input bar */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-100 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="แชตคุยกับแอดมินเกี่ยวกับออเดอร์ หรือข้อสงสัย..."
          className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-brand-purple/20 focus:outline-hidden text-gray-800"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
