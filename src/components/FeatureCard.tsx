
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  gradient?: string;
}

const FeatureCard = ({ icon: Icon, title, description, onClick, gradient = "from-green-400 to-green-600" }: FeatureCardProps) => {
  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 overflow-hidden"
      onClick={onClick}
    >
      <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`bg-gradient-to-r ${gradient} p-4 rounded-full text-white group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
