import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, Bot, User, ArrowLeft, RefreshCw, AlertCircle,
  Compass, MapPin, Calendar, Utensils, Shield
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { api } from '@/lib/api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  chips?: { label: string; route?: string }[];
}

const KNOWLEDGE_RESPONSES: { keywords: string[]; reply: string; chips?: { label: string; route?: string }[] }[] = [
  {
    keywords: ['itinerary', 'plan', '2-day', '3-day', 'days', 'schedule'],
    reply: `Here is a curated 2-Day Cultural & Heritage Itinerary for Benin City:

**Day 1: Royal Heritage & Ancient Antiquities**
• **Morning (9:30 AM):** Visit the **National Museum Benin City** in King's Square to view historical royal antiquities, bronze heads, and pre-colonial artifacts.
• **Mid-day (12:30 PM):** Walk to the **Emotan Statue** opposite Oba Market and explore the outer grounds of the historic **Palace of the Oba of Benin**.
• **Lunch (2:00 PM):** Head to **K&Q Restaurant** in GRA for traditional Banga Soup with yellow starch or Owo soup.
• **Afternoon (3:30 PM):** Explore **Igun Street (Guild of Bronze Casters)** to witness live lost-wax bronze smelting and support guild master artisans.

**Day 2: Sacred Architecture, Earthworks & Contemporary Arts**
• **Morning (10:00 AM):** Join a guided walk along the preserved sections of the **Benin Moat & Earthworks (Iya)** and visit **Ogiamien Ancient Palace**.
• **Afternoon (1:30 PM):** Visit the **Sir Victor Uwaifo Sound City & Art Centre** for a fascinating look at highlife music, sculptures, and kinetic arts.
• **Evening (5:30 PM):** Relax at **Bini Heritage Garden & Grill** with freshly grilled fish and palm wine.`,
    chips: [
      { label: 'View Heritage Sites', route: '#attractions' },
      { label: 'Book a Tour Guide', route: '#guides' },
      { label: 'Open Interactive Map', route: '#map' }
    ]
  },
  {
    keywords: ['today', 'what can i do', 'activities', 'now'],
    reply: `Today in Benin City, you can explore several verified cultural highlights:
1. **Visit Igun Street:** Master bronze casters are at their forges crafting traditional bronze sculptures and lost-wax art.
2. **Explore National Museum:** Open daily 9:00 AM - 5:00 PM at Ring Road with three galleries of Edo antiquities.
3. **Taste Edo Cuisine:** Stop by local dining spots for hot Pepper Soup, Banga Soup, or authentic Black Soup (Omoebe).
4. **Collect Digital Passport Stamps:** You can check in at major landmarks and claim stamps in your Benin360 passport!`,
    chips: [
      { label: 'Check Events', route: '#events' },
      { label: 'Food Guide', route: '#food' },
      { label: 'Claim Passport Stamp', route: '#passport' }
    ]
  },
  {
    keywords: ['dress', 'etiquette', 'protocol', 'rules', 'wear', 'palace'],
    reply: `**Palace & Cultural Etiquette in Benin City:**
• **Attire:** When visiting the Palace of the Oba of Benin or participating in monarchical ceremonies, dress modestly. **Avoid wearing black clothing**, as black is culturally reserved for specific mourning traditions in Benin culture.
• **Photography:** Photography of the outer courtyards and public monuments is allowed, but always ask permission before taking pictures of royal courtiers or inside restricted palace enclosures.
• **Greetings:** Polite traditional greetings are deeply respected. Saying *"Kóyo"* (Hello / Greetings) is a wonderful way to connect warmly with locals.`,
    chips: [
      { label: 'Palace Details', route: '#attractions/palace-of-the-oba-of-benin' },
      { label: 'Tour Guides', route: '#guides' }
    ]
  },
  {
    keywords: ['food', 'soup', 'eat', 'banga', 'owo', 'black soup', 'restaurant', 'dishes'],
    reply: `**Must-Try Edo Traditional Dishes in Benin City:**
1. **Banga Soup with Starch (Usi):** A rich palm fruit extract soup enriched with native herbs like *ataiko* and *orungebe*, served with yellow cassava starch.
2. **Owo Soup:** An iconic Edo celebratory yellow soup prepared with palm oil, native potash, smoked fish, and assorted meats, traditionally eaten with boiled yam or ripe plantains.
3. **Black Soup (Omoebe):** A celebrated medicinal and aromatic dark soup made from grounded scent leaves, bitter leaf, and traditional spices.
4. **Benin Pepper Soup:** A piping-hot herbal broth simmered with fresh river catfish or goat meat.

**Recommended Venues:** K&Q Restaurant & Lounge (GRA), Mama Eki Traditional Kitchen (Airport Rd), and Bini Heritage Garden.`,
    chips: [
      { label: 'Explore Food Guide', route: '#food' },
      { label: 'View Restaurants', route: '#restaurants' }
    ]
  },
  {
    keywords: ['coronation', 'oba', 'anniversary', '10th', 'festival', 'celebration'],
    reply: `The **10th Coronation Anniversary of the Oba of Benin** is a landmark monarchical jubilee celebrating a decade of cultural resurgence, community leadership, and global artifact repatriation.

**Key Highlighted Events on BENIN360:**
• Grand Royal Symposium & Exhibition
• Procession of Royal Palace Chiefs & Traditional Guilds
• Igun Street Master Bronze Casting Festival & Live Exhibition
• Benin Food & Culinary Heritage Gala

*Important notice: Event details and ceremonial schedules on BENIN360 are provided for visitor planning with clearly marked source tracking. Official declarations are made by the Benin Traditional Council.*`,
    chips: [
      { label: 'View Coronation Events', route: '#events' },
      { label: 'Add to Calendar', route: '#events' }
    ]
  },
  {
    keywords: ['transport', 'airport', 'taxi', 'driver', 'bni', 'flight'],
    reply: `**Getting Around Benin City:**
• **Benin Airport (BNI):** Located conveniently near the Government Reserved Area (GRA), just 10-15 minutes from prime hotels (Protea, Randekhi, Golden Tulip).
• **Private Drivers & Airport Shuttles:** You can request a vetted, air-conditioned vehicle or dedicated chauffeur directly through BENIN360's transport module.
• **City Mobility:** Taxis and ride-hailing services operate across the main arterial roads (Airport Road, Sapele Road, Akpakpava Road, and Uselu-Lagos Road).`,
    chips: [
      { label: 'Book Airport Transfer', route: '#transport' },
      { label: 'View Hotels', route: '#hotels' }
    ]
  },
  {
    keywords: ['bronze', 'igun', 'casters', 'casting', 'souvenir', 'mask', 'idia'],
    reply: `**The Historic Bronze Casters of Igun Street:**
Igun Eronmwon is a UNESCO-recognized guild of royal bronze casters operating continuously since the 13th century. Using the lost-wax (*cire perdue*) method, master founders sculpt intricate wax designs, coat them in clay, bake the mold to melt away the wax, and pour in molten bronze.
You can visit the street, watch the artisans work, and purchase authenticated bronze heads, leopard sculptures, and Queen Idia masks in the BENIN360 Marketplace.`,
    chips: [
      { label: 'Igun Street Site Profile', route: '#attractions/igun-bronze-casters-street' },
      { label: 'Shop Authentic Bronzes', route: '#marketplace' }
    ]
  }
];

export function AIAssistantPage() {
  const { navigate } = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `*Kóyo!* (Welcome!) I am the **BENIN360 AI Visitor Assistant**.\n\nI am here to help you navigate Benin City, discover coronation anniversary events, explore sacred heritage sites, find authentic Edo cuisine, and plan custom travel itineraries.\n\nWhat would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chips: [
        { label: 'Suggest a 2-day cultural itinerary' },
        { label: 'What traditional food should I try?' },
        { label: 'Palace etiquette and dress code' },
        { label: 'What are the 10th Coronation events?' },
        { label: 'How do I book an airport transfer?' }
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const lower = query.toLowerCase();
      const match = KNOWLEDGE_RESPONSES.find((item) =>
        item.keywords.some((kw) => lower.includes(kw))
      );

      let replyText = '';
      let replyChips = match?.chips;

      if (match) {
        replyText = match.reply;
      } else {
        const aiResponse = await api.askAI(query);
        replyText = aiResponse.reply;
        replyChips = [
          { label: 'Explore Heritage Sites', route: '#attractions' },
          { label: 'Coronation Events', route: '#events' },
          { label: 'Book a Guide', route: '#guides' }
        ];
      }

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: replyChips
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: `Thank you for asking about "${query}". On BENIN360, explore the verified directories for the Palace of the Oba of Benin, Igun Street Bronze Casters, upcoming coronation events, and local tour guides.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: [
          { label: 'Explore Heritage Sites', route: '#attractions' },
          { label: 'Coronation Events', route: '#events' }
        ]
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-100 animate-fade-in flex flex-col pb-6">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 flex-1 flex flex-col">
        {/* Top Header */}
        <div className="py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('#/')}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Benin Intelligence
          </div>
        </div>

        {/* Chat Box Container */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-200 flex flex-col overflow-hidden min-h-[580px]">
          {/* Chat Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 to-primary-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm sm:text-base leading-tight">Benin360 AI Visitor Guide</h2>
                <div className="text-[11px] text-primary-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success-400 inline-block animate-pulse" />
                  Ready to assist with Benin heritage & events
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setMessages([messages[0]]);
              }}
              title="Reset conversation"
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Trust Disclaimer Notice */}
          <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              BENIN360 AI answers using curated platform databases. It does not claim official representation of the Oba's Palace or governmental authorities.
            </p>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-primary-600 text-white rounded-br-xs shadow-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-xs border border-gray-200/70'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>

                  {m.chips && m.chips.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200/60 flex flex-wrap gap-1.5">
                      {m.chips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (chip.route) {
                              navigate(chip.route);
                            } else {
                              handleSend(chip.label);
                            }
                          }}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-white text-gray-700 border border-gray-200 hover:border-primary-400 hover:text-primary-700 hover:shadow-xs transition-all text-left"
                        >
                          {chip.label} &rarr;
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`text-[10px] mt-1.5 text-right ${m.sender === 'user' ? 'text-primary-200' : 'text-gray-400'}`}>
                    {m.timestamp}
                  </div>
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-4 text-sm text-gray-500 rounded-bl-xs flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-gray-400 ml-1">Searching curated Benin knowledge...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about events, palaces, food, hotels, or dress codes..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white rounded-2xl transition-all shadow-md shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
