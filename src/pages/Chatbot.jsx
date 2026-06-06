
import { useState, useRef, useEffect, useContext } from 'react';
import { Send, Mic, Sparkles, RefreshCw } from 'lucide-react';
import { DataContext, AuthContext } from '../App';
import { getTodayKey, calcSleepHours } from '../utils/dateUtils';



function VitaIcon({ size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <path
        d="M17 8C8 10 5.9 16.17 3.82 19.92C3.26 20.94 4.27 22 5.38 21.6C8.81 20.37 14.13 17.5 17 12C17 12 20 8 17 2C17 2 17 5.5 17 8Z"
        fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round"
      />
      <path d="M3.5 20C5 17 8.5 13.5 17 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const QUICK_PROMPTS = [
  'How can I improve my sleep?',
  'What should I eat today?',
  'Analyze my activity today',
  'Best exercises for me',
];

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

function buildSystemPrompt(user, stats) {
  return `You are Vita, a friendly and knowledgeable AI wellness coach inside the VitalAI health app.

The user's name is ${user?.name || 'there'}.

Here is their health data for today:
- Steps: ${stats.steps.toLocaleString()} (goal: 10,000)
- Water intake: ${(stats.water / 1000).toFixed(1)}L (goal: 2.5L)
- Sleep: ${stats.sleepHours != null ? stats.sleepHours.toFixed(1) + ' hours' : 'not logged'}
- Calories consumed: ${stats.calories} kcal (goal: 2,000 kcal)
- Mood: ${stats.mood}
- Weight: ${stats.weight ? stats.weight + ' ' + (stats.weightUnit || 'kg') : 'not logged'}
- Heart rate: ${stats.heartRate ? stats.heartRate + ' BPM' : 'not logged'}
- Blood pressure: ${stats.systolic && stats.diastolic ? stats.systolic + '/' + stats.diastolic + ' mmHg' : 'not logged'}
- Meals logged: ${stats.meals ? Object.entries(stats.meals).filter(([, v]) => v).map(([k]) => k).join(', ') || 'none' : 'none'}

Guidelines:
- Give short, friendly, specific responses based on THEIR actual data above.
- Always reference their real numbers when relevant.
- Use encouraging language but be honest if something needs improvement.
- Keep responses under 120 words unless they ask for a detailed plan.
- Use 1–2 relevant emojis per response, not more.
- Never give medical diagnoses. For serious symptoms suggest seeing a doctor.
- If they ask something unrelated to health, gently redirect them.`;
}

async function callGemini(systemPrompt, conversationHistory) {
  const contents = conversationHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // Prepend system instruction as first user/model exchange
  const allContents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: "Got it! I'm Vita, ready to help." }] },
    ...contents
  ];

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: allContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Gemini error:', JSON.stringify(data));
    throw new Error(data?.error?.message || 'Gemini API error');
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text
    || "I couldn't generate a response. Please try again.";
}

function ChatBubble({ msg }) {
  const isBot = msg.role === 'bot';
  return (
    <div className={`bubble-wrap ${isBot ? 'bot' : 'user'}`}>
      {isBot && (
        <div className="bot-avatar">
          <VitaIcon size={16} />
        </div>
      )}
      <div className={`bubble ${isBot ? 'bubble-bot' : 'bubble-user'}`}>
        {msg.typing ? (
          <div className="typing-dots">
            <span /><span /><span />
          </div>
        ) : (
          <>
            <p className="bubble-text">{msg.content}</p>
            <span className="bubble-time">{msg.time}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function Chatbot() {
  const { logData } = useContext(DataContext);
  const { user } = useContext(AuthContext);

  const todayKey = getTodayKey();
  const entry = logData[todayKey] || {};

  const sleepHours = calcSleepHours(entry.sleepStart, entry.sleepEnd);

  const stats = {
    steps: entry.steps || 0,
    water: entry.water || 0,
    calories: entry.calories || 0,
    mood: entry.mood || 'Not logged',
    weight: entry.weight || null,
    weightUnit: entry.weightUnit || 'kg',
    heartRate: entry.heartRate || null,
    systolic: entry.systolic || null,
    diastolic: entry.diastolic || null,
    meals: entry.meals || {},
    sleepHours,
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      content: `Hi ${user?.name || 'there'}! I'm Vita, your VitalAI wellness coach 🌿 Ask me anything about your health, fitness, nutrition, or sleep — I can see your today's data and give you personalised advice!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  // Only the actual conversation (not the first greeting) gets sent to Gemini
  const conversationHistory = useRef([]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || isTyping) return;
    setInput('');
    setError('');

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message to UI
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      content: userText,
      time: now,
    }]);

    // Add to history for context
    conversationHistory.current.push({ role: 'user', content: userText });

    // Show typing indicator
    setIsTyping(true);
    const tempId = Date.now() + 1;
    setMessages(prev => [...prev, { id: tempId, role: 'bot', typing: true }]);

    try {
      const systemPrompt = buildSystemPrompt(user, stats);
      const reply = await callGemini(systemPrompt, conversationHistory.current);

      // Add bot reply to history
      conversationHistory.current.push({ role: 'bot', content: reply });

      setMessages(prev => prev.map(m =>
        m.id === tempId
          ? { ...m, typing: false, content: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : m
      ));
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setError('Could not reach Vita right now. Check your API key or internet connection.');
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    conversationHistory.current = [];
    setError('');
    setMessages([{
      id: Date.now(),
      role: 'bot',
      content: "Chat cleared! How can I help you with your health today? 💚",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-ai-avatar">
            <VitaIcon size={22} />
          </div>
          <div>
            <h2 className="chat-title">Vita — AI Coach</h2>
            <div className="chat-status">
              <span className="status-dot" />
              <span>Powered by Gemini</span>
            </div>
          </div>
        </div>
        <button className="btn-ghost" onClick={clearChat} aria-label="Clear chat">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Quick Suggestions */}
      <div className="quick-chips">
        {QUICK_PROMPTS.map((p, i) => (
          <button key={i} className="chip" onClick={() => sendMessage(p)} disabled={isTyping}>
            <Sparkles size={11} /> {p}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          margin: '0 16px', padding: '10px 14px',
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 10, fontSize: 13, color: '#dc2626'
        }}>
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages">
        {messages.map(msg => <ChatBubble key={msg.id} msg={msg} />)}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="chat-input-bar">
        <div className="chat-input-wrap">
          <textarea
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask Vita about your health…"
            rows={1}
            disabled={isTyping}
          />
          <button className="chat-mic-btn btn-ghost" aria-label="Voice">
            <Mic size={18} />
          </button>
        </div>
        <button
          className={`chat-send-btn ${input.trim() ? 'active' : ''}`}
          onClick={() => sendMessage()}
          disabled={!input.trim() || isTyping}
          aria-label="Send"
        >
          <Send size={18} />
        </button>
      </div>

      <style>{`
        .chat-page {
          display: flex; flex-direction: column; height: 100%;
          background: #eef5ee; animation: fadeIn 0.3s ease;
        }
        .chat-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px; border-bottom: 1px solid #e5e7eb;
          background: rgba(255,255,255,0.95); backdrop-filter: blur(12px);
          position: sticky; top: 0; z-index: 10;
        }
        .chat-header-info { display: flex; align-items: center; gap: 12px; }
        .chat-ai-avatar {
          width: 42px; height: 42px; border-radius: 13px;
          background: var(--primary);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px var(--primary-glow);
        }
        .chat-title { font-size: 16px; font-weight: 800; color: #111827; letter-spacing: -0.2px; }
        .chat-status { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280; font-weight: 500; }
        .status-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.6);
          animation: pulse 2s infinite;
        }
        .quick-chips {
          display: flex; gap: 8px; padding: 12px 16px;
          overflow-x: auto; scrollbar-width: none; flex-shrink: 0;
        }
        .quick-chips::-webkit-scrollbar { display: none; }
        .quick-chips .chip {
          white-space: nowrap; flex-shrink: 0;
          background: white; border: 1.5px solid #e5e7eb; border-radius: 16px;
          padding: 6px 12px; font-size: 11px; font-weight: 600; color: #4b5563;
          display: inline-flex; align-items: center; gap: 4px; cursor: pointer;
          transition: all 0.2s;
        }
        .quick-chips .chip:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
        .quick-chips .chip:disabled { opacity: 0.5; cursor: not-allowed; }
        .chat-messages {
          flex: 1; overflow-y: auto; padding: 12px 16px;
          display: flex; flex-direction: column; gap: 12px;
          padding-bottom: 24px;
        }
        .bubble-wrap {
          display: flex; gap: 8px; max-width: 85%;
          animation: fadeUp 0.3s ease forwards;
        }
        .bubble-wrap.user { align-self: flex-end; flex-direction: row-reverse; }
        .bubble-wrap.bot  { align-self: flex-start; }
        .bot-avatar {
          width: 30px; height: 30px; border-radius: 10px; background: var(--primary);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 4px;
        }
        .bubble { border-radius: 18px; padding: 12px 16px; position: relative; }
        .bubble-bot {
          background: #ffffff; border: 1px solid #e5e7eb;
          border-bottom-left-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }
        .bubble-user {
          background: var(--primary); border-bottom-right-radius: 4px;
          box-shadow: 0 4px 14px var(--primary-glow);
        }
        .bubble-text { font-size: 13.5px; line-height: 1.55; color: #111827; white-space: pre-wrap; font-weight: 500; }
        .bubble-user .bubble-text { color: #fff; }
        .bubble-time { font-size: 10px; color: #9ca3af; font-weight: 600; display: block; margin-top: 6px; text-align: right; }
        .bubble-user .bubble-time { color: rgba(255,255,255,0.7); }
        .typing-dots { display: flex; gap: 5px; padding: 4px 0; }
        .typing-dots span {
          width: 8px; height: 8px; border-radius: 50%;
          background: #9ca3af; animation: pulse 1.2s ease infinite;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        .chat-input-bar {
          display: flex; align-items: flex-end; gap: 10px;
          padding: 12px 16px; border-top: 1px solid #e5e7eb;
          background: #ffffff; margin-bottom: 70px;
        }
        .chat-input-wrap {
          flex: 1; display: flex; align-items: center;
          background: #f9fafb; border: 1.5px solid #e5e7eb;
          border-radius: 22px; padding: 10px 14px; transition: border-color 0.2s;
        }
        .chat-input-wrap:focus-within { border-color: var(--primary); }
        .chat-input {
          flex: 1; background: none; border: none; outline: none;
          resize: none; font-family: 'Inter', sans-serif;
          font-size: 14px; color: #111827; line-height: 1.4;
          max-height: 100px; scrollbar-width: none;
        }
        .chat-input::placeholder { color: #9ca3af; }
        .chat-mic-btn { color: #9ca3af; padding: 0 4px; background: none; border: none; cursor: pointer; }
        .chat-mic-btn:hover { color: var(--primary); }
        .chat-send-btn {
          width: 44px; height: 44px; border-radius: 50%;
          background: #f3f4f6; border: 1.5px solid #e5e7eb;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #9ca3af; transition: all 0.2s; flex-shrink: 0;
        }
        .chat-send-btn.active {
          background: var(--primary); border-color: transparent; color: white;
          box-shadow: 0 4px 14px var(--primary-glow);
        }
        .btn-ghost { background: none; border: none; cursor: pointer; color: #9ca3af; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}
