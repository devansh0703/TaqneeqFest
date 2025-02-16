import React from 'react';
import { Compass, Brain, Rocket, Users, LineChart } from 'lucide-react';
import Chat from './components/Chat';

function App() {
  const handleQuickAction = async (prompt: string) => {
    const chatComponent = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (chatComponent) {
      chatComponent.value = prompt;
      chatComponent.dispatchEvent(new Event('input', { bubbles: true }));
      const form = chatComponent.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }
  };

  const quickActions = [
    {
      icon: Brain,
      text: "Validate Ideas",
      prompt: "Help me validate my startup idea. What are the key steps I should take to ensure product-market fit?",
      color: "text-purple-500"
    },
    {
      icon: Rocket,
      text: "Growth Strategy",
      prompt: "What are the most effective growth strategies for an early-stage startup with limited resources?",
      color: "text-blue-500"
    },
    {
      icon: Users,
      text: "Find Co-founders",
      prompt: "What should I look for in a potential co-founder? How can I find and evaluate potential co-founders?",
      color: "text-green-500"
    },
    {
      icon: LineChart,
      text: "Fundraising Tips",
      prompt: "What are the key elements of a successful fundraising strategy for a pre-seed startup?",
      color: "text-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">Founder's Compass</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
                <Chat />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-gray-300"
                  >
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                    <span className="font-medium">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="font-semibold mb-2 text-lg">Pro Tip</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                Start by validating your idea with potential customers before investing significant time and resources.
                Remember, successful startups solve real problems for real users.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;