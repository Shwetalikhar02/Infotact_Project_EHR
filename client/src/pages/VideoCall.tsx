import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
  X, Send, Clock, Stethoscope
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CHAT_MESSAGES } from '@/data/index';
import { ROUTE_PATHS } from '@/lib/index';
import type { ChatMessage } from '@/lib/index';

export default function VideoCall() {
  const navigate = useNavigate();
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [connecting, setConnecting] = useState(true);
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate connecting animation — 2 sec delay
  useEffect(() => {
    const t = setTimeout(() => {
      setConnecting(false);
      // Start call timer
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleEndCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    navigate(ROUTE_PATHS.PATIENT_DASHBOARD);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      sender: 'patient',
      senderName: 'You',
      message: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(m => [...m, msg]);
    setNewMessage('');
  };

  return (
    <div className="h-screen w-screen bg-[#0d1117] flex flex-col overflow-hidden">
      {/* ── Connecting Overlay ── */}
      <AnimatePresence>
        {connecting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary z-50 flex flex-col items-center justify-center"
          >
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6 relative">
                <Stethoscope size={32} className="text-accent" />
                {/* Pulse rings */}
                <div className="absolute inset-0 rounded-full border-2 border-accent/40 animate-ping" />
                <div className="absolute -inset-4 rounded-full border border-accent/20 animate-ping" style={{ animationDelay: '0.3s' }} />
              </div>
              <h2 className="text-white font-bold text-xl mb-2">Connecting to Dr. Michael Chen</h2>
              <p className="text-white/60 text-sm mb-6">Securing your private video consultation...</p>
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header Bar ── */}
      <div className="bg-[#161b22] border-b border-white/10 px-4 py-3 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <Stethoscope size={16} className="text-accent" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Patient: Sarah Johnson</p>
            <p className="text-white/50 text-xs font-mono">Appt: {appointmentId?.toUpperCase() || 'APT001'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          {!connecting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 rounded-full px-3 py-1"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <Clock size={12} className="text-red-400" />
              <span className="text-red-300 text-xs font-mono font-bold">{formatTime(elapsed)}</span>
            </motion.div>
          )}

          {/* HIPAA Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-accent/10 border border-accent/20 rounded-full px-2.5 py-1">
            <div className="w-1.5 h-1.5 bg-accent rounded-full" />
            <span className="text-accent text-xs font-medium">End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      {/* ── Main Video Area ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Remote Video (Doctor) */}
        <div className={`flex-1 relative bg-gradient-to-br from-[#1a1f2e] to-[#0d1117] transition-all duration-300 ${chatOpen ? 'mr-80' : ''}`}>

          {/* Doctor video placeholder */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-primary/40 border-2 border-white/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-4xl">M</span>
              </div>
              {!connecting && (
                <>
                  <div className="absolute -inset-2 rounded-full border border-accent/30 animate-pulse" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#0d1117]" />
                </>
              )}
            </div>
            <p className="text-white font-semibold text-lg">Dr. Michael Chen</p>
            <p className="text-white/50 text-sm">Cardiologist • MediConnect</p>
            {!connecting && <p className="text-white/30 text-xs mt-1">Camera feed (simulated)</p>}
          </div>

          {/* Self-View PiP */}
          {!connecting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-24 right-4 w-36 h-24 bg-gradient-to-br from-[#2a2f3e] to-[#1a1f2e] rounded-xl border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center"
            >
              {cameraOn ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <p className="text-white/70 text-xs mt-1">You</p>
                </div>
              ) : (
                <div className="text-center">
                  <VideoOff size={20} className="text-white/40 mx-auto mb-1" />
                  <p className="text-white/40 text-xs">Camera Off</p>
                </div>
              )}
              <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-green-400" />
            </motion.div>
          )}
        </div>

        {/* ── Chat Side Panel ── */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-80 bg-[#161b22] border-l border-white/10 flex flex-col"
            >
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">Chat</h3>
                <button onClick={() => setChatOpen(false)} className="text-white/50 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${msg.sender === 'patient' ? 'order-last' : ''}`}>
                      <div className={`rounded-xl px-3 py-2 text-sm ${
                        msg.sender === 'patient'
                          ? 'bg-accent text-white rounded-tr-sm'
                          : 'bg-white/10 text-white rounded-tl-sm'
                      }`}>
                        {msg.message}
                      </div>
                      <p className={`text-xs text-white/30 mt-1 ${msg.sender === 'patient' ? 'text-right' : ''}`}>
                        {msg.senderName} • {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-3 border-t border-white/10 flex gap-2">
                <Input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 text-sm"
                />
                <Button size="icon" onClick={sendMessage} className="bg-accent hover:bg-accent/90 text-white shrink-0">
                  <Send size={15} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Control Bar ── */}
      {!connecting && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#161b22]/90 border-t border-white/10 px-6 py-4 flex items-center justify-center gap-4 shrink-0"
        >
          {/* Mute */}
          <button
            onClick={() => setMuted(!muted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
              muted ? 'bg-red-500/30 border border-red-500/50 text-red-400' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
            }`}
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Camera */}
          <button
            onClick={() => setCameraOn(!cameraOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
              !cameraOn ? 'bg-red-500/30 border border-red-500/50 text-red-400' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
            }`}
            title={cameraOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
              chatOpen ? 'bg-accent border border-accent/50 text-white' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
            }`}
            title="Toggle Chat"
          >
            <MessageSquare size={20} />
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30"
            title="End Call"
          >
            <PhoneOff size={22} />
          </button>
        </motion.div>
      )}
    </div>
  );
}
