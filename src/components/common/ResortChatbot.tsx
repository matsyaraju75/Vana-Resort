/**
 * @file ResortChatbot.tsx
 * @description Vana Resort Araku AI Chatbot — Powered by Gemini AI (google/gemini-1.5-flash).
 * Falls back to smart rule-based responses when API key is not configured.
 * To enable AI: set VITE_GEMINI_API_KEY=AIzaSy... in your .env file.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Bot, User, Loader2, MessageCircle, Minus } from 'lucide-react';

// ─── Resort Knowledge Base (rule-based fallback) ───────────────────────────
const RESORT_KNOWLEDGE = {
  name: 'Vana Resort Araku',
  phone: '+91 90141 15175',
  whatsapp: '919014115175',
  email: 'matsyaraju909@gmail.com',
  address: 'Ranajilleda Waterfalls Road, Padmapuram, Araku Valley, Andhra Pradesh',
  checkIn: '12:00 PM',
  checkOut: '10:00 AM',
  rooms: [
    { name: 'Standard Non AC Room', price: '₹1,500/night', guests: 2, desc: 'Comfortable room with mountain ambiance, natural ventilation, and all basic amenities.' },
    { name: 'AC Deluxe Room', price: '₹2,500/night', guests: 3, desc: 'Spacious air-conditioned room with premium furnishings and valley-view balcony.' },
    { name: 'Junior Suite', price: '₹4,000/night', guests: 4, desc: 'Elegant suite with a separate living area, king bed, and panoramic Araku views.' },
    { name: 'Executive Suite', price: '₹6,000/night', guests: 4, desc: 'Our finest accommodation — private terrace, luxury bath, butler service on request.' },
  ],
  amenities: ['Swimming pool', 'Restaurant & dining', 'Bonfire area', 'Free parking', '24/7 power backup', 'Wi-Fi', 'Room service', 'Outdoor seating'],
  attractions: [
    { name: 'Padmapuram Gardens', distance: '2 km', entry: 'Free' },
    { name: 'Chaparai Waterfalls', distance: '7 km', entry: 'Free' },
    { name: 'Madagada View Point', distance: '16 km', entry: 'Free' },
    { name: 'Coffee Museum', distance: '5 km', entry: '₹30' },
    { name: 'Borra Caves', distance: '28 km', entry: '₹65' },
    { name: 'Tribal Museum', distance: '4 km', entry: '₹10' },
  ],
};

const SYSTEM_PROMPT = `You are a warm, helpful concierge assistant for ${RESORT_KNOWLEDGE.name}, an eco-luxury resort in Araku Valley, Andhra Pradesh, India.

Key resort facts:
- Address: ${RESORT_KNOWLEDGE.address}
- Phone: ${RESORT_KNOWLEDGE.phone} | Email: ${RESORT_KNOWLEDGE.email}
- Check-in: ${RESORT_KNOWLEDGE.checkIn} | Check-out: ${RESORT_KNOWLEDGE.checkOut}
- Rooms: Standard Non AC (₹1,500/night), AC Deluxe (₹2,500/night), Junior Suite (₹4,000/night), Executive Suite (₹6,000/night)
- Amenities: Swimming pool, restaurant, bonfire, free parking, Wi-Fi, 24/7 power backup, room service
- Nearby: Padmapuram Gardens (2km), Chaparai Waterfalls (7km), Madagada View Point (16km), Coffee Museum (5km), Borra Caves (28km)
- Train: Araku Railway Station is 4.6 km away

Instructions:
- Be warm, concise, and helpful (max 3-4 sentences per reply)
- Always encourage guests to book via the website or call +91 90141 15175
- If unsure about specific dates or availability, direct them to call or WhatsApp
- Use a friendly, professional hotel concierge tone
- Respond only in English unless the guest writes in another language`;

// ─── Rule-based smart fallback ─────────────────────────────────────────────
function getRuleBasedResponse(input: string): string {
  const q = input.toLowerCase();

  if (/(room|stay|accommodation|suite|deluxe|non.?ac|ac room)/i.test(q)) {
    return `We have 4 room categories at Vana Resort:\n\n🛏 **Standard Non AC** — ₹1,500/night\n🛏 **AC Deluxe** — ₹2,500/night\n🌟 **Junior Suite** — ₹4,000/night\n👑 **Executive Suite** — ₹6,000/night\n\nAll rooms include access to our pool, restaurant & free parking. Would you like to book one?`;
  }
  if (/(price|cost|rate|tariff|how much)/i.test(q)) {
    return `Our room rates start from ₹1,500/night (Standard Non AC) up to ₹6,000/night (Executive Suite). For the best rates and availability, call us at **+91 90141 15175** or book directly on our website!`;
  }
  if (/(check.?in|check.?out|time|arrival|departure)/i.test(q)) {
    return `Check-in is at **12:00 PM** and check-out is at **10:00 AM**. Early check-in and late check-out may be available on request — please call us at +91 90141 15175 to arrange.`;
  }
  if (/(pool|swim|swimming)/i.test(q)) {
    return `Yes! We have a beautiful **outdoor swimming pool** available to all resort guests. It's perfect for relaxing after a day of exploring Araku Valley's attractions! 🏊`;
  }
  if (/(wifi|internet|wi.?fi)/i.test(q)) {
    return `Yes, we offer **complimentary Wi-Fi** throughout the resort. Stay connected while enjoying the serene Araku Valley surroundings! 📶`;
  }
  if (/(food|restaurant|dining|breakfast|lunch|dinner|eat|meal)/i.test(q)) {
    return `We have an in-house **restaurant** serving authentic Andhra cuisine and popular dishes. Room service is also available. Meals can be arranged during booking — contact us at +91 90141 15175 for meal packages!`;
  }
  if (/(parking|car|vehicle|bike)/i.test(q)) {
    return `We offer **complimentary parking** for all guests. The resort has ample space for cars, bikes, and larger vehicles. Safe and secure! 🚗`;
  }
  if (/(attract|place|visit|sightseeing|nearby|around|tour)/i.test(q)) {
    return `Araku Valley has wonderful attractions near us:\n\n📍 Padmapuram Gardens — 2 km\n💧 Chaparai Waterfalls — 7 km\n⛰ Madagada View Point — 16 km\n☕ Coffee Museum — 5 km\n🦇 Borra Caves — 28 km\n\nWe can help arrange day trips — ask our front desk!`;
  }
  if (/(borra|caves|cave)/i.test(q)) {
    return `**Borra Caves** are about 28 km from the resort — one of the largest natural cave systems in India with stunning stalactite formations. Entry is ₹65. We recommend visiting in the morning. Our front desk can arrange transport!`;
  }
  if (/(train|railway|station|araku station|how to reach|reach|come|travel|direction)/i.test(q)) {
    return `**Araku Railway Station** is just 4.6 km from the resort. The scenic Vistadome train from Visakhapatnam is the most popular way to reach Araku! By road, we're on Ranajilleda Waterfalls Road, Padmapuram. Need pickup? Call +91 90141 15175.`;
  }
  if (/(book|reservation|reserve|availability)/i.test(q)) {
    return `To book a room or check availability:\n\n📞 Call: **+91 90141 15175**\n💬 WhatsApp: **+91 90141 15175**\n📧 Email: matsyaraju909@gmail.com\n\nOr use the **Book Now** button on our website for an instant reservation form!`;
  }
  if (/(bonfire|campfire|fire|evening)/i.test(q)) {
    return `Yes, we have a wonderful **bonfire area**! Evening bonfires are one of the most beloved experiences at Vana Resort — perfect for a chilly Araku night with family or friends 🔥. Ask our team when you arrive!`;
  }
  if (/(contact|phone|number|call|whatsapp|email)/i.test(q)) {
    return `You can reach us at:\n\n📞 **+91 90141 15175** (Front Desk)\n💬 **WhatsApp:** +91 90141 15175\n📧 **Email:** matsyaraju909@gmail.com\n⏰ Office Hours: 8:00 AM – 10:00 PM IST`;
  }
  if (/(address|location|where|map|gps|how far)/i.test(q)) {
    return `We're located at **Ranajilleda Waterfalls Road, Padmapuram, Araku Valley, Andhra Pradesh**. We're easily reachable by train (Araku Station: 4.6 km) or road from Visakhapatnam. Search "Vana Resort Araku" on Google Maps!`;
  }
  if (/(hello|hi |hey|good morning|good evening|good afternoon|namaste)/i.test(q)) {
    return `Hello! Welcome to **Vana Resort Araku** 🌿\n\nI'm your resort concierge. I can help you with:\n• Room rates & availability\n• Check-in/check-out times\n• Attractions & activities\n• Directions & transport\n• Booking assistance\n\nWhat can I help you with today?`;
  }
  if (/(thank|thanks|great|perfect|awesome|wonderful)/i.test(q)) {
    return `You're most welcome! 🙏 We look forward to welcoming you to Vana Resort Araku. For any further questions, don't hesitate to call us at **+91 90141 15175**. Have a wonderful day!`;
  }
  if (/(cancel|refund|policy)/i.test(q)) {
    return `For cancellation and refund policies, please contact our front desk directly at **+91 90141 15175** or email matsyaraju909@gmail.com. Our team will assist you with the best possible solution.`;
  }
  if (/(pet|dog|cat|animal)/i.test(q)) {
    return `For our pet policy, please contact us directly at **+91 90141 15175** — our team will let you know the current guidelines and arrange the best stay for you and your companions.`;
  }

  // Default
  return `Thank you for your question! For the most accurate and up-to-date assistance, please contact us:\n\n📞 **+91 90141 15175**\n💬 **WhatsApp:** +91 90141 15175\n\nOur front desk team is available **8 AM – 10 PM IST** and will be happy to help! 🌿`;
}

// ─── Gemini API call ───────────────────────────────────────────────────────
async function callGeminiAPI(messages: { role: string; content: string }[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || !apiKey.startsWith('AIzaSy')) {
    throw new Error('No valid Gemini API key');
  }

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [
      ...history,
      { role: 'user', parts: [{ text: lastMessage.content }] },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 300,
    },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not process your request.';
}

// ─── Types ─────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ─── Component ─────────────────────────────────────────────────────────────
export const ResortChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Welcome to **Vana Resort Araku**! 🌿\n\nI'm your resort concierge. Ask me about rooms, pricing, attractions, check-in times, or anything else about your stay!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let reply: string;
      try {
        reply = await callGeminiAPI(history);
      } catch {
        // Fallback to rule-based when Gemini unavailable
        reply = getRuleBasedResponse(text);
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick suggestion chips
  const QUICK_CHIPS = ['Room prices?', 'Check-in time?', 'Nearby attractions', 'How to reach?'];

  const formatMessage = (text: string) => {
    // Bold **text**
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={j}>{part.slice(2, -2)}</strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-50 flex items-end gap-2">
          {/* Greeting Bubble */}
          {hasUnread && (
            <div className="mb-1 bg-white text-slate-800 text-xs font-medium px-4 py-2 rounded-2xl rounded-bl-sm shadow-elevated border border-sand-border max-w-[180px] animate-fadeIn">
              👋 Hi! Ask me anything about the resort!
            </div>
          )}
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-vana-700 text-white shadow-xl shadow-vana-900/30 transition-all duration-300 hover:scale-110 hover:bg-vana-800 active:scale-95 focus:outline-none focus:ring-4 focus:ring-vana-300/50"
            aria-label="Open resort chatbot"
          >
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white animate-pulse" />
            )}
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 left-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-sand-border flex flex-col transition-all duration-300 ${
            isMinimized ? 'h-[60px]' : 'h-[520px]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-vana-800 to-vana-700 rounded-t-3xl flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-tight">Vana Concierge</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-vana-200 text-[11px]">Online • Vana Resort Araku</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                <Minus className="w-3.5 h-3.5 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-rose-500/70 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-sand-50/60">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                        msg.role === 'assistant'
                          ? 'bg-vana-100 border border-vana-200'
                          : 'bg-slate-200'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <Bot className="w-4 h-4 text-vana-700" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-slate-600" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'assistant'
                          ? 'bg-white border border-sand-border text-slate-800 rounded-bl-sm shadow-soft'
                          : 'bg-vana-700 text-white rounded-br-sm'
                      }`}
                    >
                      {formatMessage(msg.content)}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-vana-100 border border-vana-200 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-vana-700" />
                    </div>
                    <div className="bg-white border border-sand-border px-4 py-3 rounded-2xl rounded-bl-sm shadow-soft">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-vana-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-vana-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-vana-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick Chips */}
              {messages.length <= 2 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setInput(chip);
                        setTimeout(() => sendMessage(), 50);
                      }}
                      className="px-3 py-1.5 bg-vana-50 border border-vana-200 text-vana-800 text-[11px] font-semibold rounded-full hover:bg-vana-100 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Bar */}
              <div className="px-4 pb-4 pt-2 flex-shrink-0 border-t border-sand-border/70">
                <div className="flex items-center gap-2 bg-white border border-sand-border rounded-2xl px-4 py-2.5 shadow-soft focus-within:ring-2 focus-within:ring-vana-500/20 focus-within:border-vana-500 transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about rooms, pricing, attractions…"
                    className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none"
                    disabled={isLoading}
                    maxLength={500}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="flex-shrink-0 w-8 h-8 rounded-xl bg-vana-700 text-white flex items-center justify-center transition-all hover:bg-vana-800 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    aria-label="Send message"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-1.5">
                  Vana Resort Concierge • 8 AM–10 PM IST
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
