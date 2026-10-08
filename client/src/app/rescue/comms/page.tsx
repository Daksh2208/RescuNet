"use client";

import { useEffect, useState, useRef } from "react";
import { MessageSquare, Send, Search, Hash, Plus, Loader2, AlertTriangle, Users } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

type CommsChannel = {
  id: string;
  name: string;
  createdAt: string;
  _count?: {
    messages: number;
  };
};

type CommsMessage = {
  id: string;
  text: string;
  createdAt: string;
  sender: {
    id: string;
    fullName: string;
    role: string;
  };
};

export default function RescueCommsPage() {
  const [channels, setChannels] = useState<CommsChannel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [messages, setMessages] = useState<CommsMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch current user id
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/user/me");
        if (res.data?.data?.id) {
          setCurrentUserId(res.data.data.id);
        }
      } catch (err) {
        console.error("Failed to get current user:", err);
      }
    };
    fetchMe();
  }, []);

  // Fetch channels on mount
  const fetchChannels = async () => {
    try {
      setLoadingChannels(true);
      const res = await api.get("/rescue/comms/channels");
      const list: CommsChannel[] = res.data.data || [];
      setChannels(list);
      if (list.length > 0 && !activeChannelId) {
        setActiveChannelId(list[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch channels:", err);
    } finally {
      setLoadingChannels(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  // Fetch messages when activeChannelId changes
  const fetchMessages = async (channelId: string) => {
    try {
      setLoadingMessages(true);
      const res = await api.get(`/rescue/comms/channels/${channelId}/messages`);
      setMessages(res.data.data?.messages || []);
    } catch (err) {
      console.error("Failed to fetch channel messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (activeChannelId) {
      fetchMessages(activeChannelId);
      // Interval to poll every 5 seconds for new messages
      const interval = setInterval(() => {
        api.get(`/rescue/comms/channels/${activeChannelId}/messages`)
          .then((res) => {
            if (res.data?.data?.messages) {
              setMessages(res.data.data.messages);
            }
          })
          .catch(() => {});
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [activeChannelId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChannelId || sendingMessage) return;

    try {
      setSendingMessage(true);
      const textToSend = inputText.trim();
      setInputText("");
      const res = await api.post(`/rescue/comms/channels/${activeChannelId}/messages`, {
        text: textToSend,
      });
      if (res.data?.data) {
        setMessages((prev) => [...prev, res.data.data]);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    try {
      const res = await api.post("/rescue/comms/channels", {
        name: newChannelName.trim(),
      });
      setShowNewChannelModal(false);
      setNewChannelName("");
      await fetchChannels();
      if (res.data?.data?.id) {
        setActiveChannelId(res.data.data.id);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create channel");
    }
  };

  const activeChannel = channels.find((c) => c.id === activeChannelId);
  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            Team Communications
          </h1>
          <p className="text-slate-500 text-sm mt-1">Encrypted radio text network for operational coordination</p>
        </div>
        <Link 
          href="/rescue"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-0">
        
        {/* Sidebar Channels (Left) */}
        <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search channels..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <button
              onClick={() => setShowNewChannelModal(true)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shrink-0 shadow-sm"
              title="Create channel"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="p-2 space-y-1 overflow-y-auto flex-1">
            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Radio Channels
            </div>
            {loadingChannels ? (
              <div className="p-4 text-center">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin mx-auto" />
              </div>
            ) : filteredChannels.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No channels found.
              </div>
            ) : (
              filteredChannels.map((ch) => {
                const isActive = ch.id === activeChannelId;
                return (
                  <button 
                    key={ch.id} 
                    onClick={() => setActiveChannelId(ch.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive 
                        ? "bg-blue-100/70 text-blue-800 font-bold" 
                        : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                      <span className="truncate">{ch.name}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area (Right) */}
        <div className="flex-1 flex flex-col bg-white min-h-0">
          {/* Chat Header */}
          <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-slate-400" />
              <h2 className="font-bold text-slate-900">{activeChannel?.name || "Select Channel"}</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Users className="h-4 w-4" /> Live Operational Channel
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loadingMessages ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                <MessageSquare className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-sm font-semibold">No transmissions in this channel yet.</p>
                <p className="text-xs text-slate-400 mt-1">Be the first to post operational updates.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = currentUserId ? msg.sender.id === currentUserId : msg.sender.role === "RESCUE";

                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-700">{msg.sender.fullName}</span>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                        {msg.sender.role}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe 
                        ? "bg-blue-600 text-white rounded-br-sm shadow-sm" 
                        : "bg-slate-100 text-slate-800 rounded-bl-sm border border-slate-200"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
            <form 
              onSubmit={handleSendMessage}
              className="flex items-center gap-3"
            >
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={activeChannel ? `Broadcast to #${activeChannel.name}...` : "Select a channel..."}
                disabled={!activeChannelId}
                className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={!inputText.trim() || sendingMessage || !activeChannelId}
                className="h-11 w-11 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm shrink-0"
              >
                {sendingMessage ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5 ml-0.5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* New Channel Modal */}
      {showNewChannelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Create Radio Channel</h3>
            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Channel Name
                </label>
                <input 
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="e.g. Sector 5 Extraction"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewChannelModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newChannelName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
