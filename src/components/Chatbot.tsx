
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your farming assistant. Ask me anything about crops, diseases, weather, or farming techniques!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const farmingQnA = {
    'crop rotation': 'Crop rotation helps maintain soil fertility. Rotate legumes with cereals, and include cover crops to improve soil health.',
    'fertilizer': 'Use organic fertilizers like compost and vermicompost. For chemical fertilizers, follow soil test recommendations.',
    'irrigation': 'Water early morning or evening to reduce evaporation. Use drip irrigation for water efficiency.',
    'pest control': 'Use integrated pest management (IPM). Try neem oil, companion planting, and beneficial insects before chemicals.',
    'soil testing': 'Test soil every 2-3 years for pH, nutrients, and organic matter. Contact your local agricultural extension office.',
    'organic farming': 'Avoid synthetic chemicals, use organic fertilizers, practice crop rotation, and maintain biodiversity.',
    'default': 'That\'s a great question! For specific agricultural advice, I recommend consulting with your local agricultural extension officer or a farming expert.'
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    // Generate bot response
    const lowerInput = inputMessage.toLowerCase();
    let botResponse = farmingQnA.default;
    
    for (const [key, response] of Object.entries(farmingQnA)) {
      if (lowerInput.includes(key)) {
        botResponse = response;
        break;
      }
    }

    const botMessage: Message = {
      id: messages.length + 2,
      text: botResponse,
      isBot: true,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage, botMessage]);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="h-[600px] flex flex-col border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Farming Assistant</CardTitle>
              <p className="text-green-100 text-sm">Ask me anything about farming!</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-green-600 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isBot ? 'text-gray-500' : 'text-green-100'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about crops, diseases, farming techniques..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;
