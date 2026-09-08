"use client";

import { useState } from "react";
import { MessageSquare, Send, PhoneCall, Video, Search, Hash } from "lucide-react";
import Link from "next/link";

export default function RescueCommsPage() {
  const [message, setMessage] = useState("");

  const channels = [
    { id: "ch-1", name: "Global Dispatch", unread: 2 },
    { id: "ch-2", name: "Sector 4 Updates", unread: 0 },
    { id: "ch-3", name: "Medical Triage", unread: 5 },
    { id: "ch-4", name: "Logistics", unread: 0 },
  ];

  const chatHistory = [
    {
      id: 1,
      sender: "Command HQ",
      role: "DISPATCH",
      time: "09:05 AM",
      text: "All units, be advised of severe structural damage on Main Street. Use alternative routing via 5th Avenue.",
      isMe: false
    },
    {
      id: 2,
      sender: "Unit Bravo-2",
      role: "RESCUE",
      time: "09:08 AM",
      text: "Copy that Command. We are rerouting now. ETA to Sector 4 is 12 minutes.",
      isMe: false
    },
    {
      id: 3,
      sender: "Unit Alpha-1",
      role: "RESCUE",
      time: "09:12 AM",
      text: "We have arrived at the shelter. Proceeding with extraction.",
      isMe: true
    }
  ];

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

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar Channels (Left) */}
        <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search channels..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          
          <div className="p-2 space-y-1 overflow-y-auto flex-1">
            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Radio Channels
            </div>
            {channels.map((ch, idx) => (
              <button 
                key={ch.id} 
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  idx === 0 
                    ? "bg-blue-100/50 text-blue-700 font-bold" 
                    : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 font-medium"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Hash className={`h-4 w-4 ${idx === 0 ? "text-blue-500" : "text-slate-400"}`} />
                  <span className="truncate">{ch.name}</span>
                </div>
                {ch.unread > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {ch.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area (Right) */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-slate-400" />
              <h2 className="font-bold text-slate-900">Global Dispatch</h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-200 shadow-sm">
                <PhoneCall className="h-4 w-4" />
              </button>
              <button className="h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-200 shadow-sm">
                <Video className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-700">{msg.sender}</span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{msg.role}</span>
                  <span className="text-xs text-slate-400 ml-1">{msg.time}</span>
                </div>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.isMe 
                    ? "bg-blue-600 text-white rounded-br-sm shadow-sm" 
                    : "bg-slate-100 text-slate-800 rounded-bl-sm border border-slate-200"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); setMessage(""); }}
              className="flex items-center gap-3"
            >
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Broadcast to Global Dispatch..." 
                className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
              <button 
                type="submit"
                disabled={!message.trim()}
                className="h-11 w-11 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm shrink-0"
              >
                <Send className="h-5 w-5 ml-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
