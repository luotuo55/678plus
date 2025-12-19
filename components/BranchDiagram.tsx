
import React, { useState, useEffect } from 'react';

interface BranchDiagramProps {
  num1: number;
  num2: number;
  split1: number;
  split2: number;
  total: number;
  onCorrect: () => void;
  onIncorrect: (msg: string) => void;
}

export const BranchDiagram: React.FC<BranchDiagramProps> = ({ num1, num2, split1, split2, total, onCorrect, onIncorrect }) => {
  const [valS1, setValS1] = useState<string>('');
  const [valS2, setValS2] = useState<string>('');
  const [valTotal, setValTotal] = useState<string>('');

  const check = () => {
    if (parseInt(valS1) === split1 && parseInt(valS2) === split2 && parseInt(valTotal) === total) {
      onCorrect();
    } else if (valS1 && valS2 && (parseInt(valS1) !== split1)) {
        onIncorrect(`${num1}需要几才能凑成10？再想一想哦！`);
    }
  };

  useEffect(() => {
    if (valS1 && valS2 && valTotal) check();
  }, [valS1, valS2, valTotal]);

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-100 relative max-w-sm w-full">
      <div className="flex items-center gap-4 text-3xl font-bold mb-8">
        <span>{num1}</span>
        <span>+</span>
        <div className="flex flex-col items-center">
            <span>{num2}</span>
        </div>
        <span>=</span>
        <input 
          type="number" 
          value={valTotal}
          onChange={(e) => setValTotal(e.target.value)}
          className="w-16 h-12 text-center border-b-4 border-orange-400 focus:outline-none focus:border-orange-600 bg-orange-50 rounded"
        />
      </div>

      <svg className="absolute top-20 left-1/2 -translate-x-[25px]" width="100" height="100">
        <line x1="20" y1="0" x2="0" y2="40" className="branch-line" />
        <line x1="20" y1="0" x2="40" y2="40" className="branch-line" />
        <line x1="-15" y1="40" x2="-45" y2="80" className="branch-line" />
        <line x1="-50" y1="40" x2="-50" y2="80" className="branch-line" />
      </svg>

      <div className="flex gap-12 mt-4 ml-12">
        <input 
          type="number" 
          placeholder="?"
          value={valS1}
          onChange={(e) => setValS1(e.target.value)}
          className="w-12 h-12 text-center border-2 border-dashed border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input 
          type="number" 
          placeholder="?"
          value={valS2}
          onChange={(e) => setValS2(e.target.value)}
          className="w-12 h-12 text-center border-2 border-dashed border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mt-8 ml-[-60px]">
          <div className="w-12 h-12 flex items-center justify-center border-2 border-red-400 rounded-full text-red-500 font-bold bg-red-50">10</div>
      </div>
      
      {valTotal && parseInt(valTotal) === total && (
          <div className="mt-6 text-green-600 font-bold animate-bounce">
              想：{num1}加{split1}得10，10加{split2}得{total}。
          </div>
      )}
    </div>
  );
};
