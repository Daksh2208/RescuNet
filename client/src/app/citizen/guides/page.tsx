"use client";

import { useState } from "react";
import { Info, BookOpen, Wind, Flame, Waves, Activity, ArrowRight, PawPrint } from "lucide-react";
import Link from "next/link";

export default function SafetyGuidesPage() {
  const [expandedGuide, setExpandedGuide] = useState<number | null>(null);

  const guides = [
    {
      title: "Flood & Water Logging Protocol",
      description: "WHO/NIDM certified guidelines for evacuation, electrical safety, and disease prevention.",
      content: (
        <>
          <p><strong>Pre-Flood Preparation (NIDM):</strong></p>
          <p>• Know your local relief centers and evacuation routes.</p>
          <p>• Keep a 72-hour emergency kit ready, placed above ground level.</p>
          <br/>
          <p><strong>During a Flood:</strong></p>
          <p>• Disconnect all electrical appliances to prevent electrocution.</p>
          <p>• Never walk or drive through floodwaters. Just 6 inches of moving water can knock an adult down, and 2 feet can sweep away a vehicle.</p>
          <p>• Move to higher ground immediately; do not wait for instructions if water is rising rapidly.</p>
          <br/>
          <p><strong>Health & Sanitation (WHO):</strong></p>
          <p>• Drink only boiled or bottled water to prevent water-borne diseases like cholera and typhoid.</p>
          <p>• Wash hands frequently with soap and clean water.</p>
          <p>• For Pets: Keep them leashed or in carriers. Floodwaters carry parasites and toxic chemicals.</p>
        </>
      ),
      icon: Waves,
      color: "text-blue-600",
      bg: "bg-blue-50",
      badge: "Water"
    },
    {
      title: "Earthquake Survival Guide",
      description: "Official Drop, Cover, and Hold On protocols and structural safety guidelines.",
      content: (
        <>
          <p><strong>During the Earthquake (NIDM/WHO):</strong></p>
          <p>• <strong>DROP</strong> down onto your hands and knees before the earthquake knocks you down.</p>
          <p>• <strong>COVER</strong> your head and neck (and your entire body if possible) underneath a sturdy table or desk.</p>
          <p>• <strong>HOLD ON</strong> to your shelter until the shaking stops.</p>
          <p>• If outdoors, move to a clear area away from buildings, trees, streetlights, and power lines.</p>
          <br/>
          <p><strong>After the Earthquake:</strong></p>
          <p>• Expect aftershocks. Each time you feel one, Drop, Cover, and Hold On.</p>
          <p>• Do not light matches or turn on electrical switches, as gas leaks are highly probable.</p>
          <p>• For Pets: Keep animals secured in crates. The stress of the quake and aftershocks can cause extreme panic and lead them to bolt.</p>
        </>
      ),
      icon: Activity,
      color: "text-purple-600",
      bg: "bg-purple-50",
      badge: "Seismic"
    },
    {
      title: "Fire & Smoke Evacuation",
      description: "Low-visibility navigation, smoke inhalation prevention, and safe extraction.",
      content: (
        <>
          <p><strong>Evacuation Protocol (NIDM):</strong></p>
          <p>• Crawl low under the smoke to your exit; heavy smoke and poisonous gases collect first along the ceiling.</p>
          <p>• Before opening a door, feel the doorknob and the cracks around the door. If it is hot, leave the door closed and use your secondary exit.</p>
          <p>• Once outside, go immediately to your designated family meeting place. Never re-enter a burning building.</p>
          <br/>
          <p><strong>Health & First Aid (WHO):</strong></p>
          <p>• If someone suffers from smoke inhalation, move them to fresh air immediately and seek emergency medical assistance.</p>
          <p>• Cover your nose and mouth with a wet cloth to filter out some smoke particles.</p>
          <p>• For Pets: Wrap pets in a blanket to protect them from sparks and heat during evacuation.</p>
        </>
      ),
      icon: Flame,
      color: "text-red-600",
      bg: "bg-red-50",
      badge: "Fire"
    },
    {
      title: "Cyclone & Severe Storms",
      description: "Structural securing, indoor shelter tactics, and post-cyclone hazards.",
      content: (
        <>
          <p><strong>Preparation Phase (NIDM):</strong></p>
          <p>• Secure all loose outdoor items (furniture, tools, garbage cans) that could become lethal projectiles in high winds.</p>
          <p>• Tape, board up, or close storm shutters on all windows to prevent shattered glass from blowing indoors.</p>
          <br/>
          <p><strong>During the Cyclone:</strong></p>
          <p>• Retreat to a safe indoor room (preferably windowless, on the lowest floor) with your 72-hour survival kit.</p>
          <p>• Do NOT leave the safe room when the 'eye' of the cyclone passes over. The calm is deceptive, and winds will violently return from the opposite direction.</p>
          <br/>
          <p><strong>Health & Safety (WHO):</strong></p>
          <p>• Stay clear of fallen power lines and report them immediately.</p>
          <p>• For Pets: Bring all animals indoors well before the storm hits. Keep them in carriers to prevent them from hiding in inaccessible spaces out of fear.</p>
        </>
      ),
      icon: Wind,
      color: "text-teal-600",
      bg: "bg-teal-50",
      badge: "Weather"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Multi-Disaster Safety Guides</h1>
          <p className="text-slate-500 text-sm mt-1">Life-saving protocols for you and your animals</p>
        </div>
        <Link 
          href="/citizen"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="h-16 w-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center shrink-0">
          <BookOpen className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-teal-900 mb-2">Emergency Kit Checklist</h2>
          <p className="text-sm text-teal-800 mb-4">
            A well-prepared 72-hour kit is the most important step in disaster survival. Ensure you have supplies for all family members, including pets.
          </p>
          <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg text-sm transition-colors">
            Download PDF Checklist
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map((guide, i) => (
          <div 
            key={i} 
            onClick={() => setExpandedGuide(expandedGuide === i ? null : i)}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${guide.bg} ${guide.color}`}>
                <guide.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {guide.badge}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{guide.title}</h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              {guide.description}
            </p>
            
            {expandedGuide === i ? (
              <div className="mt-2 pt-4 border-t border-slate-100 text-sm text-slate-800 space-y-2 whitespace-pre-line animate-fade-in-up">
                {guide.content}
              </div>
            ) : (
              <div className={`mt-auto flex items-center text-sm font-bold ${guide.color}`}>
                Read Full Guide <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-white text-center mt-8 shadow-md">
        <PawPrint className="h-8 w-8 text-orange-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold mb-2">Don't Forget Your Pets</h3>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Animals sense disasters before we do and may try to hide. Always keep a sturdy carrier or leash accessible, and ensure your pet's ID tags and microchip information are up to date.
        </p>
      </div>
    </div>
  );
}
