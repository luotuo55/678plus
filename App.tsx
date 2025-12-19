
import React, { useState } from 'react';
import { Scene } from './types';
import { speak } from './services/ttsService';
import { StickItem } from './components/StickItem';
import { BranchDiagram } from './components/BranchDiagram';

const App: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<Scene>(Scene.Intro);
  const [introStep, setIntroStep] = useState(0);
  const [stickMoveStep, setStickMoveStep] = useState(0);
  const [circleSelection, setCircleSelection] = useState<number[]>([]);
  const [finishedLessons, setFinishedLessons] = useState<string[]>([]);

  const scenes = Object.values(Scene);
  const sceneLabels: Record<Scene, string> = {
    [Scene.Intro]: '情境导入',
    [Scene.Sticks]: '虚拟搬运',
    [Scene.Branch]: '分解填充',
    [Scene.Circle]: '圈一圈',
    [Scene.Compare]: '发现规律'
  };

  // Navigation handlers
  const goToNextScene = () => {
    const currentIndex = scenes.indexOf(currentScene);
    if (currentIndex < scenes.length - 1) {
      setCurrentScene(scenes[currentIndex + 1]);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevScene = () => {
    const currentIndex = scenes.indexOf(currentScene);
    if (currentIndex > 0) {
      setCurrentScene(scenes[currentIndex - 1]);
      window.scrollTo(0, 0);
    }
  };

  const handleSpeech = (text: string) => {
    speak(text);
  };

  // Helper component for 16:9 responsive container
  const AspectContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-full lg:w-[80%] aspect-[16/9] mx-auto bg-white rounded-3xl shadow-xl border-4 border-white flex flex-col items-center justify-center overflow-hidden relative mb-6">
      {children}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pb-32 max-w-4xl mx-auto relative bg-[#f8fafc]">
      {/* Header Navigation */}
      <div className="w-full flex justify-between items-center mb-6 z-10 sticky top-0 bg-[#f8fafc]/90 backdrop-blur-sm py-2">
        <button 
            onClick={goToPrevScene}
            disabled={currentScene === Scene.Intro}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 ${currentScene === Scene.Intro ? 'bg-gray-100 text-gray-300' : 'bg-white text-blue-600 border border-blue-100'}`}
        >
            <span>←</span>
            <span className="hidden sm:inline">上一步</span>
        </button>

        <h1 className="text-lg sm:text-2xl font-black text-blue-600 bg-white px-6 py-1 rounded-full shadow-sm border-2 border-blue-100">
           {sceneLabels[currentScene]}
        </h1>

        <button 
            onClick={goToNextScene}
            disabled={currentScene === Scene.Compare}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 ${currentScene === Scene.Compare ? 'bg-gray-100 text-gray-300' : 'bg-white text-blue-600 border border-blue-100'}`}
        >
            <span className="hidden sm:inline">下一步</span>
            <span>→</span>
        </button>
      </div>

      {/* Intro Scene */}
      {currentScene === Scene.Intro && (
        <div className="w-full flex flex-col items-center animate-fadeIn">
          <div className="w-full lg:w-[80%] bg-white rounded-2xl p-4 shadow-sm border border-blue-50 mb-6 text-center">
            <p className="text-lg sm:text-xl text-gray-700 font-bold">
              {introStep === 0 ? "🏃 一共有多少个学生？点击人物试试！" : "前面有8人，后面有5人。"}
            </p>
          </div>
          
          <AspectContainer>
            <div className="flex flex-col items-center justify-center gap-6 p-4 w-full h-full">
              <div className="flex flex-wrap justify-center gap-3 w-full p-4 bg-blue-50/50 rounded-2xl">
                  {Array.from({ length: 8 }).map((_, i) => (
                      <div 
                          key={`f-${i}`} 
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 transform ${introStep > 0 ? 'bg-blue-500 scale-110 shadow-lg' : 'bg-gray-200'}`}
                          onClick={() => { if (introStep === 0) setIntroStep(1); }}
                      >
                          🏃
                      </div>
                  ))}
              </div>
              <div className="flex flex-wrap justify-center gap-3 w-full p-4 bg-green-50/50 rounded-2xl">
                  {Array.from({ length: 5 }).map((_, i) => (
                      <div 
                          key={`b-${i}`} 
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 transform ${introStep > 0 ? 'bg-green-500 scale-110 shadow-lg' : 'bg-gray-200'}`}
                          onClick={() => { if (introStep === 0) setIntroStep(1); }}
                      >
                          🏃
                      </div>
                  ))}
              </div>
            </div>
          </AspectContainer>

          {introStep > 0 && (
            <div className="mt-4 flex flex-col items-center gap-6 w-full lg:w-[80%]">
                <div className="flex items-center gap-4 text-3xl sm:text-4xl font-black text-gray-800">
                    <span>8 + 5 =</span>
                    <input 
                        type="number"
                        placeholder="?"
                        className="w-24 sm:w-32 p-2 text-center border-b-4 border-blue-500 bg-white shadow-sm rounded-t-lg focus:outline-none focus:bg-blue-50 transition-colors"
                        onChange={(e) => {
                            if (e.target.value === '13') {
                                handleSpeech("太棒了！8加5等于13，我们去探究一下怎么算的吧！");
                                setIntroStep(2);
                            }
                        }}
                    />
                </div>
                <button 
                    onClick={goToNextScene}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
                >
                    进入下一环节：虚拟搬运 ➔
                </button>
            </div>
          )}
        </div>
      )}

      {/* Sticks Scene */}
      {currentScene === Scene.Sticks && (
        <div className="w-full flex flex-col items-center">
          <div className="w-full lg:w-[80%] bg-green-50 p-4 rounded-2xl mb-6 border border-green-100 text-center">
            <h2 className="text-lg font-bold text-green-800">🤏 互动搬运：凑出一捆(10根)</h2>
            <p className="text-sm text-green-600 mt-1">点击右侧的按钮将小棒搬过去吧！</p>
          </div>
          
          <AspectContainer>
            <div className="w-full h-full flex items-center justify-around p-8 relative">
              {/* Left Group */}
              <div className={`p-6 border-4 ${stickMoveStep === 1 ? 'border-orange-400 bg-orange-50' : 'border-dashed border-gray-300'} rounded-3xl flex flex-wrap max-w-[160px] min-h-[160px] transition-all content-start relative`}>
                  {Array.from({ length: 8 + (stickMoveStep === 1 ? 2 : 0) }).map((_, i) => (
                      <StickItem key={`l-${i}`} color={i >= 8 ? 'bg-orange-400' : 'bg-green-400'} isBundled={stickMoveStep === 1 && i < 10} />
                  ))}
                  {stickMoveStep === 1 && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md whitespace-nowrap">凑成10根啦！</div>
                  )}
              </div>

              <div className="text-4xl font-black text-gray-200">+</div>

              {/* Right Group */}
              <div className="p-6 border-4 border-dashed border-gray-300 rounded-3xl flex flex-wrap max-w-[160px] min-h-[160px] content-start relative">
                  {Array.from({ length: 5 - (stickMoveStep === 1 ? 2 : 0) }).map((_, i) => (
                      <StickItem key={`r-${i}`} color="bg-green-400" />
                  ))}
                  {stickMoveStep === 0 && (
                      <button 
                          onClick={() => {
                              setStickMoveStep(1);
                              handleSpeech("想：8加2得10，10加3得13。");
                          }}
                          className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce font-bold whitespace-nowrap text-sm sm:text-base z-20"
                      >
                          搬走2根 ➔
                      </button>
                  )}
              </div>
            </div>
          </AspectContainer>

          <div className="mt-8 text-center p-6 bg-white rounded-3xl border-2 border-green-100 w-full lg:w-[80%] shadow-sm">
             <p className="text-gray-700 font-bold mb-6 text-lg">
                {stickMoveStep === 0 ? "先借2根给8凑成10吧！" : "现在左边是10，右边还剩3，一共是13。"}
             </p>
             {stickMoveStep === 1 && (
                <button 
                    onClick={goToNextScene}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-black py-4 rounded-2xl shadow-lg text-lg"
                >
                    下一步：枝形图分解 ➔
                </button>
             )}
          </div>
        </div>
      )}

      {/* Branch Diagram Scene */}
      {currentScene === Scene.Branch && (
        <div className="w-full flex flex-col items-center">
            <div className="w-full lg:w-[80%] bg-orange-50 p-4 rounded-2xl mb-8 border border-orange-100 text-center">
                <h2 className="text-lg font-bold text-orange-800">📝 分解填充：想一想</h2>
                <p className="text-sm text-orange-600">把5分成2和几？</p>
            </div>

            <AspectContainer>
              <div className="scale-110 sm:scale-125">
                <BranchDiagram 
                    num1={8} 
                    num2={5} 
                    split1={2} 
                    split2={3} 
                    total={13} 
                    onCorrect={() => {
                        handleSpeech("真棒！你已经掌握了8加几的口诀：见8想2。");
                        if (!finishedLessons.includes('8')) setFinishedLessons([...finishedLessons, '8']);
                    }}
                    onIncorrect={(msg) => handleSpeech(msg)}
                />
              </div>
            </AspectContainer>
            
            <button 
                onClick={goToNextScene}
                className="w-full lg:w-[80%] mt-6 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-black py-4 rounded-2xl shadow-lg text-lg"
            >
                去挑战7和6加几 ➔
            </button>
        </div>
      )}

      {/* Circle Scene */}
      {currentScene === Scene.Circle && (
        <div className="w-full flex flex-col items-center overflow-y-auto max-h-[85vh] pb-10">
            <h2 className="text-xl font-black text-gray-800 mb-6 w-full text-center">🎯 圈一圈，算一算</h2>
            
            <AspectContainer>
              <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-6">
                <p className="text-lg font-bold text-gray-700">7 + 4 = ? (点选3个圆凑成10)</p>
                <div className="flex justify-center items-center gap-10 bg-gray-50/50 p-6 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="flex flex-wrap w-28 gap-2 justify-center">
                        {Array.from({ length: 7 }).map((_, i) => <div key={i} className="w-6 h-6 rounded-full bg-amber-800 shadow-sm"></div>)}
                    </div>
                    <div className="text-4xl font-black text-gray-200">+</div>
                    <div className="flex flex-wrap w-28 gap-2 justify-center">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div 
                                key={i} 
                                onClick={() => {
                                    if (circleSelection.includes(i)) {
                                        setCircleSelection(prev => prev.filter(x => x !== i));
                                    } else if (circleSelection.length < 3) {
                                        setCircleSelection(prev => [...prev, i]);
                                    }
                                }}
                                className={`w-8 h-8 rounded-full cursor-pointer transition-all transform active:scale-90 ${circleSelection.includes(i) ? 'bg-orange-500 ring-4 ring-orange-200 scale-125' : 'bg-amber-600 shadow-inner'}`}
                            ></div>
                        ))}
                    </div>
                </div>
              </div>
            </AspectContainer>

            {circleSelection.length === 3 && (
                <div className="w-full lg:w-[80%] mt-2 flex flex-col items-center gap-4 animate-fadeIn bg-white p-6 rounded-3xl border-2 border-orange-100 mb-8 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-2xl">结果是：</span>
                        <input 
                            type="number" 
                            className="w-24 p-2 text-center text-2xl font-black border-b-4 border-orange-500 focus:outline-none" 
                            placeholder="?"
                            onChange={(e) => {
                                if (e.target.value === '11') {
                                    handleSpeech("7加3得10，10加1等于11。好棒！");
                                    if (!finishedLessons.includes('7')) setFinishedLessons([...finishedLessons, '7']);
                                }
                            }}
                        />
                    </div>
                </div>
            )}

            <div className={`w-full lg:w-[80%] bg-white p-6 rounded-3xl shadow-sm border-2 border-blue-100 transition-all ${!finishedLessons.includes('7') ? 'opacity-50 grayscale' : ''}`}>
                <p className="text-lg font-bold text-gray-700 mb-6 text-center">6 + 5 = ? (见6想几?)</p>
                <div className="flex justify-center gap-12 mb-8 bg-blue-50/30 p-6 rounded-3xl">
                    <div className="flex flex-wrap w-28 gap-2 justify-center">
                        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="w-5 h-8 bg-blue-500 rounded-sm border-b-4 border-blue-700"></div>)}
                    </div>
                    <div className="flex flex-wrap w-28 gap-2 justify-center">
                        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="w-5 h-8 bg-blue-300 rounded-sm border-b-4 border-blue-400"></div>)}
                    </div>
                </div>
                <div className="flex justify-center">
                    <BranchDiagram 
                        num1={6} 
                        num2={5} 
                        split1={4} 
                        split2={1} 
                        total={11} 
                        onCorrect={() => {
                            handleSpeech("恭喜你！6加5也挑战成功啦！");
                            if (!finishedLessons.includes('6')) setFinishedLessons([...finishedLessons, '6']);
                        }}
                        onIncorrect={(m) => handleSpeech(m)}
                    />
                </div>
            </div>

            <button 
                onClick={goToNextScene}
                className="w-full lg:w-[80%] mt-10 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all mb-20 text-lg"
            >
                最后冲刺：发现规律 ➔
            </button>
        </div>
      )}

      {/* Compare Scene */}
      {currentScene === Scene.Compare && (
        <div className="w-full flex flex-col items-center">
            <div className="w-full lg:w-[80%] bg-yellow-50 p-4 rounded-2xl mb-8 border border-yellow-100 text-center">
                <h2 className="text-lg font-bold text-yellow-800">💡 发现联系：两两对比</h2>
                <p className="text-sm text-yellow-600">填完算式，你会发现什么秘密？</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full lg:w-[90%]">
                {[
                    { q1: "7 + 3 + 3", q2: "7 + 6", ans: 13 },
                    { q1: "6 + 4 + 2", q2: "6 + 6", ans: 12 },
                    { q1: "8 + 2 + 2", q2: "8 + 4", ans: 12 }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-yellow-400 flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-2xl font-black text-gray-700">{item.q1} =</span>
                            <input type="number" className="w-24 p-2 border-b-4 border-gray-200 text-center text-xl font-black focus:border-yellow-500 outline-none" placeholder="?" />
                        </div>
                        <div className="flex justify-between items-center text-blue-600 font-black">
                            <span className="font-mono text-2xl">{item.q2} =</span>
                            <input type="number" className="w-24 p-2 border-b-4 border-blue-200 text-center text-xl font-black focus:border-blue-500 outline-none" placeholder="?" />
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => handleSpeech("上面的加法算式其实就是下面凑十的过程。你真是个数学小天才！")}
                className="mt-12 bg-yellow-400 text-yellow-900 font-black px-12 py-5 rounded-full shadow-lg active:scale-95 transition-transform flex items-center gap-3 text-xl"
            >
                <span>揭晓小秘密</span>
                <span>💡</span>
            </button>

            <div className="mt-16 text-center p-10 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-[3rem] w-full lg:w-[80%] shadow-2xl animate-fadeIn">
                <h3 className="text-4xl font-black mb-4">🎉 大功告成！</h3>
                <p className="font-bold opacity-90 text-xl mb-8">你已经精通了凑十法，真是太棒了！</p>
                <button 
                    onClick={() => {
                        setCurrentScene(Scene.Intro);
                        setIntroStep(0);
                        setStickMoveStep(0);
                        setCircleSelection([]);
                        setFinishedLessons([]);
                    }}
                    className="bg-white text-green-600 font-black px-10 py-4 rounded-2xl shadow-xl active:scale-95 text-lg"
                >
                    再次挑战 🔄
                </button>
            </div>
        </div>
      )}

      {/* Responsive Sticky Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-4 flex flex-col gap-3 items-center z-50 shadow-[0_-4px_30px_-5px_rgba(0,0,0,0.1)]">
          <div className="flex gap-2 w-full justify-between max-w-2xl px-2">
              {scenes.map((s, i) => (
                  <button 
                    key={s} 
                    onClick={() => {
                        setCurrentScene(s);
                        window.scrollTo(0, 0);
                    }}
                    className={`group relative flex flex-col items-center gap-2 flex-1`}
                    aria-label={`Go to scene ${i + 1}`}
                  >
                      <div className={`h-2.5 rounded-full transition-all duration-300 w-full ${currentScene === s ? 'bg-blue-600 scale-y-125' : 'bg-gray-200 group-hover:bg-gray-300'}`}></div>
                      <span className={`text-[10px] sm:text-xs font-black transition-colors truncate w-full text-center ${currentScene === s ? 'text-blue-600' : 'text-gray-400'}`}>
                          {sceneLabels[s]}
                      </span>
                  </button>
              ))}
          </div>
          <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
              小学数学 · 凑十法互动课堂
          </div>
      </div>
    </div>
  );
};

export default App;
