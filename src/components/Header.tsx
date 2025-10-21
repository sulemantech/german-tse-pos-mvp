import React from 'react';

const Header: React.FC = () => {
  const stats = [
    { label: 'ACTIVE ORDERS', value: '12' },
    { label: 'TODAY\'S REVENUE', value: '€2,847' },
    { label: 'TSE SIGNATURES', value: '1,247' },
    { label: 'AI RECOMMENDATIONS', value: '86%' }
  ];

  return (
    <header className="col-span-3 glass-panel border-b flex justify-between items-center px-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-glow-move"></div>
      
      <div className="flex items-center gap-3 z-10">
        <div className="w-7 h-7 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-sm">
          ⚡
        </div>
        <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          NEXUS POS
        </div>
      </div>

      <div className="flex gap-6 text-sm z-10">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-gray-400 text-xs">{stat.label}</div>
            <div className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header;