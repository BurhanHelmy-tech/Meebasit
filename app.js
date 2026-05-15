const { useState, useEffect, useMemo } = React;

// SVG Icons
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

const ResetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const SmileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>
);

const FrownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>
);

const App = () => {
    const [a, setA] = useState(1);
    const [b, setB] = useState(0);
    const [c, setC] = useState(0);

    const [showAxis, setShowAxis] = useState(true);
    const [showVertex, setShowVertex] = useState(true);
    const [showIntercepts, setShowIntercepts] = useState(true);

    const [mode, setMode] = useState('sandbox'); // 'sandbox' | 'challenges'
    const [challengeIndex, setChallengeIndex] = useState(0);

    // Derived Math Properties
    const axisX = a !== 0 ? -b / (2 * a) : 0;
    const vertexY = a * axisX * axisX + b * axisX + c;
    const discriminant = b * b - 4 * a * c;

    let roots = [];
    if (a !== 0) {
        if (discriminant > 0) {
            roots = [
                (-b - Math.sqrt(discriminant)) / (2 * a),
                (-b + Math.sqrt(discriminant)) / (2 * a)
            ];
        } else if (discriminant === 0) {
            roots = [-b / (2 * a)];
        }
    } else if (b !== 0) {
        // Linear
        roots = [-c / b];
    }

    const challenges = [
        {
            id: 1,
            title: "Challenge 1: The Frowning Y-Intercept",
            desc: "Create a graph with a maximum point (frowning) that crosses the y-axis exactly at (0, 4).",
            check: (a, b, c) => a < 0 && c === 4
        },
        {
            id: 2,
            title: "Challenge 2: Shifting the Axis",
            desc: "Using the parent shape (a=1), shift the graph so its axis of symmetry is exactly at x = 2.",
            check: (a, b, c) => a === 1 && (-b / (2 * a)) === 2
        },
        {
            id: 3,
            title: "Challenge 3: Floating Parabola",
            desc: "Find any values for a, b, and c that produce a graph with NO real roots (does not touch the x-axis).",
            check: (a, b, c) => (b * b - 4 * a * c) < 0
        }
    ];

    const currentChallenge = challenges[challengeIndex];
    const challengeSuccess = mode === 'challenges' && currentChallenge.check(a, b, c);

    // SVG Coordinate Mapping
    // x from -10 to 10
    // y from -15 to 15
    const xMin = -10, xMax = 10;
    const yMin = -15, yMax = 15;
    const width = 600, height = 600;

    const mapX = (x) => ((x - xMin) / (xMax - xMin)) * width;
    const mapY = (y) => height - ((y - yMin) / (yMax - yMin)) * height;

    // Generate Path for Parabola
    const generatePath = () => {
        let d = "";
        const step = 0.2;
        for (let x = xMin; x <= xMax; x += step) {
            const y = a * x * x + b * x + c;
            const px = mapX(x);
            const py = mapY(y);
            if (x === xMin) d += `M ${px} ${py} `;
            else d += `L ${px} ${py} `;
        }
        return d;
    };

    const resetParent = () => {
        setA(1);
        setB(0);
        setC(0);
    };

    return (
        <div className="min-h-screen p-4 md:p-8 flex flex-col max-w-7xl mx-auto font-sans">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">
                    The Coefficient Playground
                </h1>
                <p className="text-slate-400 mt-2 text-lg">
                    Chapter 1: Quadratic Functions in One Variable (SPM Modern Math & Add Math)
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Controls & Inspector */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    
                    {/* Controls Panel */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                Function Controls
                            </h2>
                            <button 
                                onClick={resetParent}
                                className="text-sm flex items-center gap-1.5 text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <ResetIcon /> Reset to f(x)=x²
                            </button>
                        </div>

                        <div className="text-center py-4 bg-slate-900/50 rounded-xl mb-6 border border-slate-800">
                            <span className="text-2xl font-mono text-brand-400">
                                f(x) = {a !== 1 && a !== -1 ? a : (a === -1 ? '-' : '')}x² 
                                {b !== 0 ? (b > 0 ? ` + ${b}x` : ` - ${Math.abs(b)}x`) : ''} 
                                {c !== 0 ? (c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`) : ''}
                            </span>
                        </div>

                        {/* Slider A */}
                        <div className="mb-6">
                            <div className="flex justify-between mb-2">
                                <label className="font-semibold text-brand-400 flex items-center gap-2 group relative">
                                    Coefficient 'a' 
                                    <div className="text-slate-400 hover:text-slate-200 cursor-help relative">
                                        <InfoIcon />
                                        <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-64 bg-slate-700 text-xs text-white p-2 rounded shadow-lg z-10 border border-slate-600">
                                            Determines the shape (smiling/frowning) and width of the parabola. If a=0, it becomes a straight line!
                                        </div>
                                    </div>
                                </label>
                                <span className="font-mono bg-slate-900 px-2 rounded">{a}</span>
                            </div>
                            <input 
                                type="range" 
                                min="-5" max="5" step="0.1" 
                                value={a} 
                                onChange={(e) => setA(parseFloat(e.target.value))}
                            />
                            {a === 0 && <p className="text-amber-400 text-xs mt-1">Warning: a=0 creates a linear function, not quadratic.</p>}
                        </div>

                        {/* Slider B */}
                        <div className="mb-6">
                            <div className="flex justify-between mb-2">
                                <label className="font-semibold text-emerald-400 flex items-center gap-2 group relative">
                                    Coefficient 'b'
                                    <div className="text-slate-400 hover:text-slate-200 cursor-help relative">
                                        <InfoIcon />
                                        <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-64 bg-slate-700 text-xs text-white p-2 rounded shadow-lg z-10 border border-slate-600">
                                            Shifts the position of the axis of symmetry. Interacts with 'a' to determine the vertex position.
                                        </div>
                                    </div>
                                </label>
                                <span className="font-mono bg-slate-900 px-2 rounded">{b}</span>
                            </div>
                            <input 
                                type="range" 
                                min="-10" max="10" step="0.5" 
                                value={b} 
                                onChange={(e) => setB(parseFloat(e.target.value))}
                            />
                        </div>

                        {/* Slider C */}
                        <div className="mb-2">
                            <div className="flex justify-between mb-2">
                                <label className="font-semibold text-rose-400 flex items-center gap-2 group relative">
                                    Coefficient 'c'
                                    <div className="text-slate-400 hover:text-slate-200 cursor-help relative">
                                        <InfoIcon />
                                        <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-64 bg-slate-700 text-xs text-white p-2 rounded shadow-lg z-10 border border-slate-600">
                                            Determines the y-intercept. The point where the graph crosses the vertical y-axis.
                                        </div>
                                    </div>
                                </label>
                                <span className="font-mono bg-slate-900 px-2 rounded">{c}</span>
                            </div>
                            <input 
                                type="range" 
                                min="-10" max="10" step="0.5" 
                                value={c} 
                                onChange={(e) => setC(parseFloat(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Math Inspector Panel */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm flex-grow">
                        <h2 className="text-xl font-semibold text-white mb-4">Live Analysis</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-start justify-between pb-3 border-b border-slate-700/50">
                                <div>
                                    <span className="text-slate-400 text-sm block">Shape</span>
                                    {a > 0 ? (
                                        <span className="font-medium text-white flex items-center gap-2 mt-1"><SmileIcon /> Minimum Point (Smiling)</span>
                                    ) : a < 0 ? (
                                        <span className="font-medium text-white flex items-center gap-2 mt-1"><FrownIcon /> Maximum Point (Frowning)</span>
                                    ) : (
                                        <span className="font-medium text-slate-500 mt-1">Linear (Straight Line)</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start justify-between pb-3 border-b border-slate-700/50">
                                <div>
                                    <span className="text-slate-400 text-sm block flex items-center gap-1 group relative">
                                        Y-Intercept 
                                    </span>
                                    <span className="font-medium text-rose-400 font-mono mt-1 block">(0, {c})</span>
                                </div>
                            </div>

                            {a !== 0 && (
                                <div className="flex items-start justify-between pb-3 border-b border-slate-700/50">
                                    <div>
                                        <span className="text-slate-400 text-sm block">Axis of Symmetry (x = -b/2a)</span>
                                        <span className="font-medium text-emerald-400 font-mono mt-1 block">x = {axisX.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            {a !== 0 && (
                                <div className="flex items-start justify-between pb-3 border-b border-slate-700/50">
                                    <div>
                                        <span className="text-slate-400 text-sm block">Vertex (Turning Point)</span>
                                        <span className="font-medium text-brand-400 font-mono mt-1 block">({axisX.toFixed(2)}, {vertexY.toFixed(2)})</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start justify-between">
                                <div className="w-full">
                                    <span className="text-slate-400 text-sm block flex justify-between w-full">
                                        <span>Roots (x-intercepts)</span>
                                        <span className="text-xs text-slate-500 font-mono">b² - 4ac = {discriminant.toFixed(2)}</span>
                                    </span>
                                    {a !== 0 ? (
                                        discriminant > 0 ? (
                                            <span className="font-medium text-indigo-300 font-mono mt-1 block">x = {roots[0].toFixed(2)}, x = {roots[1].toFixed(2)}</span>
                                        ) : discriminant === 0 ? (
                                            <span className="font-medium text-indigo-300 font-mono mt-1 block">x = {roots[0].toFixed(2)} (Repeated Root)</span>
                                        ) : (
                                            <span className="font-medium text-rose-300 mt-1 block">No Real Roots</span>
                                        )
                                    ) : (
                                        <span className="font-medium text-indigo-300 font-mono mt-1 block">x = {roots.length ? roots[0].toFixed(2) : 'none'}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Graph & Modes */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    
                    {/* Mode Switcher & Challenge Info */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-2 backdrop-blur-sm flex p-1 border border-slate-700">
                        <button 
                            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${mode === 'sandbox' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            onClick={() => setMode('sandbox')}
                        >
                            Sandbox Mode
                        </button>
                        <button 
                            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${mode === 'challenges' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            onClick={() => setMode('challenges')}
                        >
                            Guided Challenges
                        </button>
                    </div>

                    {mode === 'challenges' && (
                        <div className={`p-4 rounded-xl border transition-colors ${challengeSuccess ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    {currentChallenge.title}
                                    {challengeSuccess && <CheckIcon />}
                                </h3>
                                <div className="text-xs text-slate-400">
                                    {challengeIndex + 1} / {challenges.length}
                                </div>
                            </div>
                            <p className="text-slate-300 text-sm mb-4">{currentChallenge.desc}</p>
                            
                            <div className="flex justify-between items-center">
                                <div className="text-sm">
                                    {challengeSuccess ? (
                                        <span className="text-emerald-400 font-medium animate-pulse">🎉 Target Achieved!</span>
                                    ) : (
                                        <span className="text-amber-400 font-medium">Adjust sliders to meet goal...</span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        disabled={challengeIndex === 0}
                                        onClick={() => setChallengeIndex(c => Math.max(0, c - 1))}
                                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs text-white"
                                    >Prev</button>
                                    <button 
                                        disabled={challengeIndex === challenges.length - 1}
                                        onClick={() => setChallengeIndex(c => Math.min(challenges.length - 1, c + 1))}
                                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs text-white"
                                    >Next</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Graph Container */}
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden relative shadow-2xl flex-grow flex flex-col">
                        
                        {/* Overlay Toggles */}
                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-slate-800/80 backdrop-blur border border-slate-600 p-3 rounded-xl shadow-lg">
                            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                                <input type="checkbox" checked={showAxis} onChange={(e) => setShowAxis(e.target.checked)} className="accent-brand-500 rounded" />
                                Axis of Symmetry
                            </label>
                            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                                <input type="checkbox" checked={showVertex} onChange={(e) => setShowVertex(e.target.checked)} className="accent-brand-500 rounded" />
                                Turning Point
                            </label>
                            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                                <input type="checkbox" checked={showIntercepts} onChange={(e) => setShowIntercepts(e.target.checked)} className="accent-brand-500 rounded" />
                                Intercepts
                            </label>
                        </div>

                        {/* SVG Render */}
                        <div className="w-full aspect-square md:aspect-auto md:flex-grow relative">
                            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full block">
                                
                                {/* Grid Lines */}
                                {Array.from({length: xMax - xMin + 1}).map((_, i) => {
                                    const x = xMin + i;
                                    return (
                                        <line key={`vx-${i}`} x1={mapX(x)} y1="0" x2={mapX(x)} y2={height} stroke={x === 0 ? "#475569" : "#1e293b"} strokeWidth={x === 0 ? 2 : 1} />
                                    )
                                })}
                                {Array.from({length: yMax - yMin + 1}).map((_, i) => {
                                    const y = yMin + i;
                                    return (
                                        <line key={`hy-${i}`} x1="0" y1={mapY(y)} x2={width} y2={mapY(y)} stroke={y === 0 ? "#475569" : "#1e293b"} strokeWidth={y === 0 ? 2 : 1} />
                                    )
                                })}

                                {/* Axes Labels */}
                                <text x={mapX(xMax - 0.5)} y={mapY(-0.8)} fill="#94a3b8" fontSize="12" fontFamily="sans-serif">x</text>
                                <text x={mapX(0.5)} y={mapY(yMax - 0.5)} fill="#94a3b8" fontSize="12" fontFamily="sans-serif">f(x)</text>

                                {/* Axis of Symmetry */}
                                {showAxis && a !== 0 && (
                                    <line 
                                        x1={mapX(axisX)} y1="0" 
                                        x2={mapX(axisX)} y2={height} 
                                        stroke="#10b981" 
                                        strokeWidth="2" 
                                        strokeDasharray="8 4" 
                                        opacity="0.7"
                                    />
                                )}

                                {/* Parabola Curve */}
                                {a !== 0 && (
                                    <path 
                                        d={generatePath()} 
                                        fill="none" 
                                        stroke="#818cf8" 
                                        strokeWidth="3" 
                                        strokeLinecap="round"
                                    />
                                )}

                                {/* Turning Point (Vertex) */}
                                {showVertex && a !== 0 && (
                                    <g>
                                        <circle cx={mapX(axisX)} cy={mapY(vertexY)} r="5" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
                                        <text 
                                            x={mapX(axisX) + 10} 
                                            y={mapY(vertexY) - 10} 
                                            fill="#facc15" 
                                            fontSize="14" 
                                            fontFamily="sans-serif"
                                            fontWeight="bold"
                                            style={{textShadow: '0px 0px 4px #000'}}
                                        >
                                            ({axisX.toFixed(1)}, {vertexY.toFixed(1)})
                                        </text>
                                    </g>
                                )}

                                {/* Intercepts */}
                                {showIntercepts && (
                                    <g>
                                        {/* Y-intercept */}
                                        <circle cx={mapX(0)} cy={mapY(c)} r="5" fill="#fb7185" stroke="#0f172a" strokeWidth="2" />
                                        <text 
                                            x={mapX(0) + 10} 
                                            y={mapY(c) + 15} 
                                            fill="#fb7185" 
                                            fontSize="12" 
                                            fontFamily="sans-serif"
                                            style={{textShadow: '0px 0px 4px #000'}}
                                        >
                                            (0, {c})
                                        </text>

                                        {/* X-intercepts */}
                                        {roots.map((r, i) => (
                                            <g key={`root-${i}`}>
                                                <circle cx={mapX(r)} cy={mapY(0)} r="5" fill="#a5b4fc" stroke="#0f172a" strokeWidth="2" />
                                                <text 
                                                    x={mapX(r) - 20} 
                                                    y={mapY(0) - 10} 
                                                    fill="#a5b4fc" 
                                                    fontSize="12" 
                                                    fontFamily="sans-serif"
                                                    style={{textShadow: '0px 0px 4px #000'}}
                                                >
                                                    {r.toFixed(1)}
                                                </text>
                                            </g>
                                        ))}
                                    </g>
                                )}
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
