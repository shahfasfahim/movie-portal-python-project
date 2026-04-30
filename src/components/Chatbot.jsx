import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMovie } from '../context/MovieContext';
import { MessageSquare, X, Send } from 'lucide-react';
import { chatWithMovieBotEnhanced, isMovieDataQuery } from '../api/groq';

const Chatbot = () => {
  const { currentMovieForChat } = useMovie();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFetchingMovies, setIsFetchingMovies] = useState(false);
  const [error, setError] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [lastHadMovieData, setLastHadMovieData] = useState(false);

  const currentContext = useMemo(() => {
    if (currentMovieForChat?.title) {
      return {
        title: currentMovieForChat.title,
        year: currentMovieForChat.year,
        genre: currentMovieForChat.genre,
      };
    }
    return null;
  }, [currentMovieForChat]);

  useEffect(() => {
    if (!open) return;
    setError(null);
  }, [open]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || messageCount >= 10) return;

    const newMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setError(null);
    setMessageCount((count) => count + 1);

    // Check if user is asking for movie data
    const queriesMovieData = isMovieDataQuery(trimmed);

    try {
      // Show appropriate loading indicator
      if (queriesMovieData) {
        setIsFetchingMovies(true);
        setIsTyping(false);
      } else {
        setIsTyping(true);
        setIsFetchingMovies(false);
      }

      // Use enhanced chat that includes trending movie data
      const response = await chatWithMovieBotEnhanced(newMessages, currentContext, queriesMovieData);
      
      setLastHadMovieData(response.hadMovieData);
      setMessages((prev) => [...prev, { role: 'assistant', content: response.reply }].slice(-8));
    } catch (err) {
      console.error('[Chatbot] sendMessage error:', err);
      setError(err.message || 'AI is taking a break. Try again shortly.');
    } finally {
      setIsTyping(false);
      setIsFetchingMovies(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageCount >= 10) {
      setError('Chat limit reached. Refresh the page to start a new session.');
      return;
    }
    sendMessage();
  };

  const headerText = currentContext ? `Chat about ${currentContext.title}` : 'Movie Chatbot';

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-80 md:w-[26rem] rounded-3xl border border-slate-700 bg-slate-950/95 shadow-2xl backdrop-blur-xl text-white">
          <div className="flex items-center justify-between rounded-t-3xl bg-slate-900 px-4 py-3 border-b border-slate-700">
            <div>
              <p className="font-semibold">AI Movie Chat</p>
              <p className="text-xs text-slate-400">{headerText}</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-slate-800 transition">
              <X size={18} />
            </button>
          </div>
          <div className="max-h-96 space-y-3 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
            {messages.length === 0 && (
              <div className="rounded-3xl bg-slate-900 p-4 text-sm text-slate-300">
                Ask the chatbot about cast, trivia, awards, box office, or behind-the-scenes facts. You can also ask about trending movies!
              </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`rounded-3xl p-3 ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-slate-800 text-slate-100'}`}>
                <p className="text-sm leading-6">{message.content}</p>
                {message.role === 'assistant' && lastHadMovieData && index === messages.length - 1 && (
                  <p className="text-xs text-emerald-300 mt-1">Powered by real-time movie data</p>
                )}
              </div>
            ))}
            {(isTyping || isFetchingMovies) && (
              <div className="rounded-3xl bg-slate-800 p-3 text-slate-300">
                {isFetchingMovies ? 'Fetching latest movies...' : 'AI is thinking...'}
              </div>
            )}
          </div>
          {error && (
            <div className="rounded-b-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-700 px-4 py-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the cast or trivia..."
              className="flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none"
            />
            <button type="submit" className="rounded-2xl bg-blue-600 px-3 py-2 text-white hover:bg-blue-500 transition">
              <Send size={16} />
            </button>
          </form>
          <div className="rounded-b-3xl bg-slate-900 px-4 py-2 text-xs text-slate-500 border-t border-slate-700">
            <span className="mr-2">Powered by Groq + TMDB</span>
            <span>{messageCount}/10 messages</span>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl hover:bg-blue-500 transition"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
