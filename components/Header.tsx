import React from 'react';
import { Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Dogger Instruments Logo */}
          <img 
            src="https://dgs.com.tw/img/header/logo.svg" 
            alt="Dogger Instruments" 
            className="h-10 w-auto" // Adjusted height for better visibility
          />
          <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
          <div>
            <h1 className="text-lg font-bold text-[#005787] tracking-tight flex items-center">
              工程師客服回覆禮貌化工具
              <span className="ml-2 text-[10px] font-medium text-[#26B7BC] bg-[#26B7BC]/10 px-2 py-0.5 rounded-full border border-[#26B7BC]/20">MVP</span>
            </h1>
            <p className="text-xs text-[#898989] hidden sm:block">
              保留專業術語，自動潤飾語氣
            </p>
          </div>
        </div>
        <div className="flex items-center text-sm text-[#898989]">
          <Zap className="h-4 w-4 mr-1 text-[#F7EDA2] fill-[#F7EDA2] stroke-gray-400" />
          <span className="hidden sm:inline">Powered by Gemini 3 Flash</span>
        </div>
      </div>
    </header>
  );
};

export default Header;