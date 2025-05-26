// Chart Components Library - Untuk Webflow
// Hanya akan jalan jika ada element dengan class 'chart-page'

(function() {
  'use strict';
  
  // Check jika halaman ini memiliki charts
  function hasChartsOnPage() {
    return document.querySelector('.chart-page') !== null;
  }
  
  // Jika tidak ada charts, keluar dari script
  if (!hasChartsOnPage()) {
    console.log('No charts found on this page, skipping chart initialization');
    return;
  }
  
  console.log('Charts detected, initializing...');
  
  // Tunggu sampai semua library ready
  function waitForLibraries(callback) {
    if (window.React && window.ReactDOM && window.Recharts && window.LucideReact) {
      callback();
    } else {
      setTimeout(() => waitForLibraries(callback), 100);
    }
  }
  
  // Initialize charts ketika DOM dan libraries ready
  function initializeCharts() {
    const { useState, useEffect, useCallback, useRef, useMemo } = React;
    const { 
      LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
      ReferenceLine, ReferenceArea, Label, AreaChart, Area, PieChart, Pie, Sector, Cell, ComposedChart
    } = Recharts;
    const { Play, Pause, Download, Eye, EyeOff, ChevronDown, ChevronUp, Search, ChevronRight, ChevronLeft, Maximize2 } = LucideReact;

   // ==============================================
// 1. COST EQUILIBRIUM CHART COMPONENT
// ==============================================
const CostEquilibriumChart = () => {
  // Data dan state sama seperti original
  const initialData = {
    scenario1: {
      name: "Base Case Scenario",
      description: "Standard market conditions with moderate growth",
      data: [
        { time: 0, cost: 100, revenue: 50, profit: -50 },
        { time: 1, cost: 105, revenue: 80, profit: -25 },
        { time: 2, cost: 110, revenue: 100, profit: -10 },
        { time: 3, cost: 115, revenue: 120, profit: 5 },
        { time: 4, cost: 120, revenue: 135, profit: 15 },
        { time: 5, cost: 125, revenue: 150, profit: 25 }
      ],
      color: "#3B82F6"
    },
    scenario2: {
      name: "High Demand Scenario",
      description: "Increased market demand with accelerated adoption",
      data: [
        { time: 0, cost: 110, revenue: 60, profit: -50 },
        { time: 1, cost: 115, revenue: 100, profit: -15 },
        { time: 2, cost: 120, revenue: 140, profit: 20 },
        { time: 3, cost: 125, revenue: 170, profit: 45 },
        { time: 4, cost: 130, revenue: 190, profit: 60 },
        { time: 5, cost: 135, revenue: 210, profit: 75 }
      ],
      color: "#10B981"
    },
    scenario3: {
      name: "Cost Reduction Scenario",
      description: "Implementation of efficiency measures reducing minting costs",
      data: [
        { time: 0, cost: 90, revenue: 50, profit: -40 },
        { time: 1, cost: 85, revenue: 75, profit: -10 },
        { time: 2, cost: 80, revenue: 95, profit: 15 },
        { time: 3, cost: 75, revenue: 110, profit: 35 },
        { time: 4, cost: 70, revenue: 125, profit: 55 },
        { time: 5, cost: 65, revenue: 140, profit: 75 }
      ],
      color: "#b15bcf"
    }
  };

  const [data] = useState(initialData);
  const [selectedScenarios, setSelectedScenarios] = useState(['scenario1']);
  const [isAnimating, setIsAnimating] = useState(false);
  const [timeIndex, setTimeIndex] = useState(5);
  const intervalRef = useRef(null);
  const [isDataPanelOpen, setIsDataPanelOpen] = useState(false);

  const toggleAnimation = () => {
    if (isAnimating) {
      clearInterval(intervalRef.current);
      setIsAnimating(false);
    } else {
      setTimeIndex(0);
      intervalRef.current = setInterval(() => {
        setTimeIndex(prev => {
          const maxTime = Math.max(...Object.values(data).map(scenario => 
            scenario.data.length - 1
          ));
          
          if (prev >= maxTime) {
            clearInterval(intervalRef.current);
            setIsAnimating(false);
            return maxTime;
          }
          return prev + 1;
        });
      }, 1000);
      setIsAnimating(true);
    }
  };

  const toggleScenario = (scenarioId) => {
    setSelectedScenarios(prev => {
      if (prev.includes(scenarioId)) {
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== scenarioId);
      } else {
        return [...prev, scenarioId];
      }
    });
  };

  const getFilteredData = useCallback((scenarioId) => {
    const scenarioData = data[scenarioId].data;
    if (isAnimating || timeIndex < scenarioData.length) {
      return scenarioData.slice(0, timeIndex + 1);
    }
    return scenarioData;
  }, [data, timeIndex, isAnimating]);

  const findEquilibriumPoint = (scenarioId) => {
    const scenarioData = data[scenarioId].data;
    for (let i = 1; i < scenarioData.length; i++) {
      if ((scenarioData[i-1].profit <= 0 && scenarioData[i].profit > 0) ||
          (scenarioData[i-1].profit >= 0 && scenarioData[i].profit < 0)) {
        
        const x1 = scenarioData[i-1].time;
        const y1 = scenarioData[i-1].profit;
        const x2 = scenarioData[i].time;
        const y2 = scenarioData[i].profit;
        
        const crossX = x1 + (-y1) * (x2 - x1) / (y2 - y1);
        
        return { time: crossX, visible: timeIndex >= i };
      }
    }
    return null;
  };

  const getChartDomain = () => {
    let minCost = Infinity;
    let maxCost = -Infinity;
    let minRevenue = Infinity;
    let maxRevenue = -Infinity;
    let minProfit = Infinity;
    let maxProfit = -Infinity;
    let maxTime = 0;

    selectedScenarios.forEach(scenarioId => {
      const scenarioData = getFilteredData(scenarioId);
      scenarioData.forEach(point => {
        minCost = Math.min(minCost, point.cost);
        maxCost = Math.max(maxCost, point.cost);
        minRevenue = Math.min(minRevenue, point.revenue);
        maxRevenue = Math.max(maxRevenue, point.revenue);
        minProfit = Math.min(minProfit, point.profit);
        maxProfit = Math.max(maxProfit, point.profit);
        maxTime = Math.max(maxTime, point.time);
      });
    });

    const yPadding = Math.max(
      Math.abs(maxCost - minCost), 
      Math.abs(maxRevenue - minRevenue),
      Math.abs(maxProfit - minProfit)
    ) * 0.1;

    return {
      xMin: 0,
      xMax: maxTime,
      yMin: Math.min(minCost, minRevenue, minProfit) - yPadding,
      yMax: Math.max(maxCost, maxRevenue, maxProfit) + yPadding
    };
  };

  const domain = getChartDomain();

  return React.createElement('div', { className: 'w-full' },
    React.createElement('div', { className: 'chart-container' },
      React.createElement('h1', { className: 'chart-title' }, 'Cost to Mint Economic Equilibrium'),
      React.createElement('h2', { className: 'chart-subtitle' }, 'Visualizing break-even dynamics with multiple scenario options'),
      
      React.createElement('div', { style: { display: 'flex', gap: '0.5rem', marginBottom: '1rem' } },
        React.createElement('button', {
          onClick: toggleAnimation,
          className: isAnimating ? 'btn-secondary' : 'btn-primary',
          style: { display: 'flex', alignItems: 'center', gap: '0.25rem' }
        },
          React.createElement(isAnimating ? Pause : Play, { size: 16 }),
          isAnimating ? 'Pause' : 'Play'
        ),
        React.createElement('button', {
          onClick: () => setIsDataPanelOpen(!isDataPanelOpen),
          className: 'btn-secondary',
          style: { display: 'flex', alignItems: 'center', gap: '0.25rem' }
        },
          React.createElement(isDataPanelOpen ? ChevronUp : ChevronDown, { size: 16 }),
          'Data'
        )
      ),
      
      React.createElement('div', { style: { height: '400px', width: '100%' } },
        React.createElement(ResponsiveContainer, { width: '100%', height: '100%' },
          React.createElement(LineChart, {
            margin: { top: 20, right: 20, bottom: 20, left: 20 }
          },
            React.createElement(CartesianGrid, { strokeDasharray: '3 3', stroke: '#e5e7eb' }),
            React.createElement(XAxis, {
              dataKey: 'time',
              type: 'number',
              domain: [domain.xMin, domain.xMax],
              label: { value: 'Time', position: 'insideBottom', offset: -10 }
            }),
            React.createElement(YAxis, {
              domain: [domain.yMin, domain.yMax],
              label: { value: 'Value', angle: -90, position: 'insideLeft' }
            }),
            React.createElement(Tooltip),
            React.createElement(Legend),
            React.createElement(ReferenceLine, {
              y: 0,
              stroke: '#64748b',
              strokeWidth: 1.5,
              strokeDasharray: '5 5'
            }),
            
            selectedScenarios.map(scenarioId => {
              const scenario = data[scenarioId];
              const filteredData = getFilteredData(scenarioId);
              const equilibrium = findEquilibriumPoint(scenarioId);
              
              return React.createElement(React.Fragment, { key: scenarioId },
                React.createElement(Line, {
                  type: 'monotone',
                  dataKey: 'cost',
                  data: filteredData,
                  name: `${scenario.name} - Cost`,
                  stroke: `${scenario.color}AA`,
                  strokeWidth: 2,
                  dot: true
                }),
                React.createElement(Line, {
                  type: 'monotone',
                  dataKey: 'revenue',
                  data: filteredData,
                  name: `${scenario.name} - Revenue`,
                  stroke: scenario.color,
                  strokeWidth: 2,
                  dot: true
                }),
                React.createElement(Line, {
                  type: 'monotone',
                  dataKey: 'profit',
                  data: filteredData,
                  name: `${scenario.name} - Profit`,
                  stroke: `${scenario.color}77`,
                  strokeDasharray: '5 5',
                  strokeWidth: 2,
                  dot: true
                })
              );
            })
          )
        )
      )
    )
  );
};

// ==============================================
// 2. ECONOMIC LAYERING CHART COMPONENT
// ==============================================
const EconomicLayeringChart = () => {
  const initialData = [
    { name: 'Jan', trading: 4000, staking: 2400, lending: 1800, txFees: 1200, total: 9400, market: 100 },
    { name: 'Feb', trading: 3500, staking: 2500, lending: 2000, txFees: 1300, total: 9300, market: 95 },
    { name: 'Mar', trading: 3000, staking: 2600, lending: 2200, txFees: 1400, total: 9200, market: 90 },
    { name: 'Apr', trading: 2000, staking: 2700, lending: 2300, txFees: 1500, total: 8500, market: 70 },
    { name: 'May', trading: 1800, staking: 2800, lending: 2500, txFees: 1600, total: 8700, market: 65 },
    { name: 'Jun', trading: 1600, staking: 2900, lending: 2700, txFees: 1700, total: 8900, market: 68 },
    { name: 'Jul', trading: 1400, staking: 3000, lending: 2900, txFees: 1800, total: 9100, market: 75 },
    { name: 'Aug', trading: 1700, staking: 3100, lending: 3100, txFees: 1900, total: 9800, market: 85 },
    { name: 'Sep', trading: 2000, staking: 3200, lending: 3300, txFees: 2000, total: 10500, market: 90 },
    { name: 'Oct', trading: 2300, staking: 3300, lending: 3400, txFees: 2100, total: 11100, market: 95 },
    { name: 'Nov', trading: 2600, staking: 3400, lending: 3300, txFees: 2200, total: 11500, market: 98 },
    { name: 'Dec', trading: 3000, staking: 3500, lending: 3200, txFees: 2300, total: 12000, market: 100 }
  ];

  const colors = {
    trading: '#b15bcf',
    staking: '#00528a',
    lending: '#20b2aa',
    txFees: '#25d0c7',
    market: '#FF6347'
  };

  const [viewType, setViewType] = useState('stacked');
  const [data, setData] = useState(initialData);

  return React.createElement('div', { className: 'w-full' },
    React.createElement('div', { className: 'chart-container' },
      React.createElement('h1', { className: 'chart-title' }, 'Economic Layering with Fee Revenue'),
      React.createElement('h2', { className: 'chart-subtitle' }, 'Shows how different revenue layers create resilience against market volatility'),
      
      React.createElement('div', { style: { display: 'flex', gap: '1rem', marginBottom: '1rem' } },
        React.createElement('button', {
          onClick: () => setViewType('stacked'),
          className: viewType === 'stacked' ? 'btn-primary' : 'btn-secondary'
        }, 'Stacked Area'),
        React.createElement('button', {
          onClick: () => setViewType('line'),
          className: viewType === 'line' ? 'btn-primary' : 'btn-secondary'
        }, 'Line Chart')
      ),
      
      React.createElement('div', { style: { height: '400px', width: '100%' } },
        React.createElement(ResponsiveContainer, { width: '100%', height: '100%' },
          viewType === 'stacked' ?
            React.createElement(AreaChart, { data: data },
              React.createElement(CartesianGrid, { strokeDasharray: '3 3' }),
              React.createElement(XAxis, { dataKey: 'name' }),
              React.createElement(YAxis),
              React.createElement(Tooltip),
              React.createElement(Legend),
              React.createElement(Area, {
                type: 'monotone',
                dataKey: 'txFees',
                stackId: '1',
                stroke: colors.txFees,
                fill: colors.txFees,
                name: 'Transaction Fees'
              }),
              React.createElement(Area, {
                type: 'monotone',
                dataKey: 'lending',
                stackId: '1',
                stroke: colors.lending,
                fill: colors.lending,
                name: 'Lending Revenue'
              }),
              React.createElement(Area, {
                type: 'monotone',
                dataKey: 'staking',
                stackId: '1',
                stroke: colors.staking,
                fill: colors.staking,
                name: 'Staking Revenue'
              }),
              React.createElement(Area, {
                type: 'monotone',
                dataKey: 'trading',
                stackId: '1',
                stroke: colors.trading,
                fill: colors.trading,
                name: 'Trading Revenue'
              }),
              React.createElement(Line, {
                type: 'monotone',
                dataKey: 'market',
                stroke: colors.market,
                strokeWidth: 2,
                dot: false,
                name: 'Market Performance'
              })
            ) :
            React.createElement(LineChart, { data: data },
              React.createElement(CartesianGrid, { strokeDasharray: '3 3' }),
              React.createElement(XAxis, { dataKey: 'name' }),
              React.createElement(YAxis),
              React.createElement(Tooltip),
              React.createElement(Legend),
              React.createElement(Line, {
                type: 'monotone',
                dataKey: 'txFees',
                stroke: colors.txFees,
                strokeWidth: 2,
                name: 'Transaction Fees'
              }),
              React.createElement(Line, {
                type: 'monotone',
                dataKey: 'lending',
                stroke: colors.lending,
                strokeWidth: 2,
                name: 'Lending Revenue'
              }),
              React.createElement(Line, {
                type: 'monotone',
                dataKey: 'staking',
                stroke: colors.staking,
                strokeWidth: 2,
                name: 'Staking Revenue'
              }),
              React.createElement(Line, {
                type: 'monotone',
                dataKey: 'trading',
                stroke: colors.trading,
                strokeWidth: 2,
                name: 'Trading Revenue'
              }),
              React.createElement(Line, {
                type: 'monotone',
                dataKey: 'total',
                stroke: '#8884d8',
                strokeWidth: 3,
                name: 'Total Revenue'
              }),
              React.createElement(Line, {
                type: 'monotone',
                dataKey: 'market',
                stroke: colors.market,
                strokeWidth: 2,
                strokeDasharray: '5 5',
                name: 'Market Performance'
              })
            )
        )
      )
    )
  );
};

// ==============================================
// 3. INFRASTRUCTURE DIVIDEND CHART COMPONENT  
// ==============================================
const InfrastructureDividendChart = () => {
  const initialData = [
    {
      phase: 1,
      name: "Initial Infrastructure Investment",
      progress: 20,
      timeline: "2023-2024",
      description: "Establishing core infrastructure and initial capital investment",
      color: "#20b2aa"
    },
    {
      phase: 2,
      name: "Protocol Optimization",
      progress: 40,
      timeline: "2024-2025",
      description: "Refining protocols and expanding network capacity",
      color: "#00528a"
    },
    {
      phase: 3,
      name: "Fee Reduction Implementation",
      progress: 60,
      timeline: "2025-2026",
      description: "Systematic reduction of fees through optimization and scale",
      color: "#b15bcf"
    },
    {
      phase: 4,
      name: "Ecosystem Expansion",
      progress: 80,
      timeline: "2026-2027",
      description: "Growing the ecosystem of services built on the infrastructure",
      color: "#25d0c7"
    },
    {
      phase: 5,
      name: "Zero-Fee Achievement",
      progress: 100,
      timeline: "2027-2028",
      description: "Reaching the goal of effectively zero-fee computing",
      color: "#30c9c1"
    }
  ];

  const [phaseData] = useState(initialData);
  const [selectedPhase, setSelectedPhase] = useState(initialData[2]);
  const [timelinePosition, setTimelinePosition] = useState(50);

  const overallProgress = 60;

  const prepareChartData = (phaseData) => {
    const chartData = [];
    
    phaseData.forEach((phase, index) => {
      const previousPhaseProgress = index > 0 ? phaseData[index-1].progress : 0;
      
      chartData.push({
        x: index,
        y: previousPhaseProgress,
        phase: phase.phase,
        name: phase.name,
        color: phase.color,
        isPhaseStart: true
      });
      
      chartData.push({
        x: index + 1,
        y: phase.progress,
        phase: phase.phase,
        name: phase.name,
        color: phase.color,
        isPhaseEnd: true
      });
    });
    
    return chartData;
  };

  const chartData = prepareChartData(phaseData);

  const handleTimelineChange = (e) => {
    const newPosition = parseInt(e.target.value, 10);
    setTimelinePosition(newPosition);
    
    const phaseIndex = Math.min(
      Math.floor(newPosition / (100 / phaseData.length)),
      phaseData.length - 1
    );
    setSelectedPhase(phaseData[phaseIndex]);
  };

  return React.createElement('div', { className: 'w-full' },
    React.createElement('div', { className: 'chart-container' },
      React.createElement('h1', { className: 'chart-title' }, 'Infrastructure Dividend Mechanism'),
      React.createElement('h2', { className: 'chart-subtitle' }, 'Progression Toward Zero-Fee Computing'),
      
      React.createElement('div', { style: { marginBottom: '1.5rem' } },
        React.createElement('div', { 
          style: { 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '0.5rem' 
          } 
        },
          React.createElement('span', { style: { fontSize: '0.875rem', fontWeight: '500' } }, 'Overall Progress'),
          React.createElement('span', { style: { fontSize: '0.875rem', fontWeight: '700' } }, `${overallProgress.toFixed(1)}%`)
        ),
        React.createElement('div', { 
          style: { 
            width: '100%', 
            backgroundColor: '#e5e7eb', 
            borderRadius: '9999px', 
            height: '1rem',
            marginBottom: '1rem'
          } 
        },
          React.createElement('div', {
                          style: {
              height: '1rem',
              borderRadius: '9999px',
              width: `${overallProgress}%`,
              background: 'linear-gradient(90deg, #20b2aa 0%, #25d0c7 100%)',
              transition: 'width 0.5s ease-out'
            }
          })
        )
      ),
      
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' } },
        React.createElement('div', { style: { backgroundColor: 'white', borderRadius: '0.5rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } },
          React.createElement('h3', { style: { fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem' } }, 'Progress Visualization'),
          React.createElement('div', { style: { height: '16rem', width: '100%' } },
            React.createElement(ResponsiveContainer, { width: '100%', height: '100%' },
              React.createElement(AreaChart, { 
                data: chartData, 
                margin: { top: 10, right: 30, left: 0, bottom: 0 } 
              },
                React.createElement(CartesianGrid, { strokeDasharray: '3 3', stroke: '#f0f0f0' }),
                React.createElement(XAxis, {
                  dataKey: 'x',
                  tickFormatter: (value) => {
                    const phase = phaseData[value];
                    return phase ? `Phase ${phase.phase}` : '';
                  }
                }),
                React.createElement(YAxis, {
                  tickFormatter: (value) => `${value.toFixed(0)}%`,
                  domain: [0, 100]
                }),
                React.createElement(Tooltip, {
                  formatter: (value) => [`${value.toFixed(1)}%`, 'Progress'],
                  labelFormatter: (value) => {
                    const point = chartData[value];
                    return point ? point.name : '';
                  }
                }),
                React.createElement('defs', null,
                  React.createElement('linearGradient', { id: 'progressGradient', x1: '0', y1: '0', x2: '0', y2: '1' },
                    React.createElement('stop', { offset: '5%', stopColor: '#20b2aa', stopOpacity: 0.8 }),
                    React.createElement('stop', { offset: '95%', stopColor: '#20b2aa', stopOpacity: 0.2 })
                  )
                ),
                React.createElement(Area, {
                  type: 'stepAfter',
                  dataKey: 'y',
                  stroke: '#20b2aa',
                  fill: 'url(#progressGradient)',
                  isAnimationActive: true,
                  animationDuration: 1000
                })
              )
            )
          ),
          
          React.createElement('div', { style: { marginTop: '1.5rem' } },
            React.createElement('label', { 
              htmlFor: 'timeline-scrubber',
              style: { display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }
            }, 'Timeline Scrubber'),
            React.createElement('input', {
              id: 'timeline-scrubber',
              type: 'range',
              min: '0',
              max: '100',
              value: timelinePosition,
              onChange: handleTimelineChange,
              style: {
                width: '100%',
                height: '0.5rem',
                backgroundColor: '#e5e7eb',
                borderRadius: '0.5rem',
                appearance: 'none',
                cursor: 'pointer'
              }
            })
          )
        ),
        
        React.createElement('div', { style: { backgroundColor: 'white', borderRadius: '0.5rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } },
          selectedPhase && React.createElement('div', null,
            React.createElement('div', {
              style: {
                borderRadius: '0.5rem 0.5rem 0 0',
                padding: '0.5rem 1rem',
                marginBottom: '1rem',
                backgroundColor: selectedPhase.color + '20'
              }
            },
              React.createElement('h3', {
                style: {
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: selectedPhase.color
                }
              }, `Phase ${selectedPhase.phase}: ${selectedPhase.name}`),
              React.createElement('div', {
                style: { fontSize: '0.875rem', color: '#6b7280' }
              }, selectedPhase.timeline)
            ),
            
            React.createElement('div', { style: { marginBottom: '1rem' } },
              React.createElement('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.25rem'
                }
              },
                React.createElement('span', { style: { fontSize: '0.875rem', fontWeight: '500' } }, 'Phase Progress'),
                React.createElement('span', { style: { fontSize: '0.875rem', fontWeight: '700' } }, `${selectedPhase.progress}%`)
              ),
              React.createElement('div', {
                style: {
                  width: '100%',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '9999px',
                  height: '0.75rem'
                }
              },
                React.createElement('div', {
                  style: {
                    height: '0.75rem',
                    borderRadius: '9999px',
                    width: `${selectedPhase.progress}%`,
                    backgroundColor: selectedPhase.color,
                    transition: 'width 0.5s ease-out'
                  }
                })
              )
            ),
            
            React.createElement('div', { style: { marginBottom: '1rem' } },
              React.createElement('h4', {
                style: { fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }
              }, 'Description'),
              React.createElement('p', {
                style: { fontSize: '0.875rem', color: '#6b7280' }
              }, selectedPhase.description)
            )
          )
        )
      )
    )
  );
};

// ==============================================
// 4. INTERACTIVE CHART COMPONENT
// ==============================================
const InteractiveChart = () => {
  const [marketCondition, setMarketCondition] = useState('normal');
  
  const generateNormalMarketData = () => {
    return [
      { month: 0, marketPrice: 100, costToMint: 83, combinedRevenue: 117 },
      { month: 3, marketPrice: 115, costToMint: 88, combinedRevenue: 140 },
      { month: 6, marketPrice: 122, costToMint: 94, combinedRevenue: 140 },
      { month: 9, marketPrice: 100, costToMint: 96, combinedRevenue: 110 },
      { month: 12, marketPrice: 103, costToMint: 90, combinedRevenue: 120 },
      { month: 15, marketPrice: 130, costToMint: 92, combinedRevenue: 160 },
      { month: 18, marketPrice: 135, costToMint: 97, combinedRevenue: 160 },
      { month: 21, marketPrice: 100, costToMint: 103, combinedRevenue: 105 },
      { month: 24, marketPrice: 110, costToMint: 108, combinedRevenue: 145 },
      { month: 27, marketPrice: 140, costToMint: 110, combinedRevenue: 165 },
      { month: 30, marketPrice: 150, costToMint: 108, combinedRevenue: 170 },
      { month: 33, marketPrice: 140, costToMint: 106, combinedRevenue: 170 },
      { month: 36, marketPrice: 130, costToMint: 105, combinedRevenue: 170 }
    ];
  };
  
  const generateDownturnMarketData = () => {
    return [
      { month: 0, marketPrice: 100, costToMint: 83, combinedRevenue: 115 },
      { month: 3, marketPrice: 115, costToMint: 88, combinedRevenue: 140 },
      { month: 6, marketPrice: 122, costToMint: 94, combinedRevenue: 144 },
      { month: 9, marketPrice: 95, costToMint: 96, combinedRevenue: 110 },
      { month: 12, marketPrice: 103, costToMint: 90, combinedRevenue: 120 },
      { month: 15, marketPrice: 140, costToMint: 92, combinedRevenue: 165 },
      { month: 18, marketPrice: 125, costToMint: 93, combinedRevenue: 155 },
      { month: 19, marketPrice: 100, costToMint: 95, combinedRevenue: 120 },
      { month: 20, marketPrice: 80, costToMint: 97, combinedRevenue: 95 },
      { month: 21, marketPrice: 55, costToMint: 100, combinedRevenue: 75 },
      { month: 22, marketPrice: 45, costToMint: 102, combinedRevenue: 70 },
      { month: 23, marketPrice: 50, costToMint: 105, combinedRevenue: 77 },
      { month: 24, marketPrice: 100, costToMint: 107, combinedRevenue: 135 },
      { month: 27, marketPrice: 125, costToMint: 108, combinedRevenue: 145 },
      { month: 30, marketPrice: 130, costToMint: 106, combinedRevenue: 150 },
      { month: 33, marketPrice: 135, costToMint: 105, combinedRevenue: 160 },
      { month: 36, marketPrice: 130, costToMint: 104, combinedRevenue: 165 }
    ];
  };

  const getData = () => {
    return marketCondition === 'normal' ? generateNormalMarketData() : generateDownturnMarketData();
  };

  const [data, setData] = useState(generateNormalMarketData());

  useEffect(() => {
    setData(getData());
  }, [marketCondition]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const marketPrice = payload[0]?.value || 0;
      const costToMint = payload[1]?.value || 0;
      const combinedRevenue = payload[2]?.value || 0;
      const feeRevenue = combinedRevenue - marketPrice;
      const profit = marketPrice - costToMint;
      
      return React.createElement('div', {
        style: {
          backgroundColor: 'white',
          padding: '1rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          borderRadius: '0.375rem'
        }
      },
        React.createElement('p', { style: { fontWeight: 700, marginBottom: '0.5rem' } }, `Month: ${label}`),
        React.createElement('p', { style: { color: '#00528a', fontWeight: 500 } }, `Market Price: ${marketPrice.toFixed(2)}`),
        React.createElement('p', { style: { color: '#b15bcf', fontWeight: 500 } }, `Cost to Mint: ${costToMint.toFixed(2)}`),
        React.createElement('p', { style: { color: '#20b2aa', fontWeight: 500 } }, `Combined Revenue: ${combinedRevenue.toFixed(2)}`),
        React.createElement('p', { style: { color: '#b15bcf', fontWeight: 500 } }, `Fee Revenue: ${feeRevenue.toFixed(2)}`),
        React.createElement('p', { style: { color: '#20b2aa', fontWeight: 500 } }, `Profit: ${profit.toFixed(2)}`)
      );
    }
    return null;
  };

  return React.createElement('div', { className: 'w-full' },
    React.createElement('div', { className: 'chart-container' },
      React.createElement('h1', { className: 'chart-title' }, 'Economic Layering with Fee Revenue'),
      React.createElement('h2', { className: 'chart-subtitle' }, 'Visualizing how the 1:1:1:1 model creates economic resilience through layered revenue streams'),
      
      React.createElement('div', { style: { display: 'flex', gap: '1rem', marginBottom: '2rem' } },
        React.createElement('button', {
          onClick: () => setMarketCondition('normal'),
          className: marketCondition === 'normal' ? 'btn-primary' : 'btn-secondary'
        }, 'Normal Market'),
        React.createElement('button', {
          onClick: () => setMarketCondition('downturn'),
          className: marketCondition === 'downturn' ? 'btn-primary' : 'btn-secondary'
        }, 'Market Downturn')
      ),
      
      React.createElement('div', { style: { height: '400px', width: '100%' } },
        React.createElement(ResponsiveContainer, { width: '100%', height: '100%' },
          React.createElement(ComposedChart, {
            data: data,
            margin: { top: 20, right: 20, left: 0, bottom: 5 }
          },
            React.createElement(CartesianGrid, { strokeDasharray: '3 3', stroke: '#e5e7eb' }),
            React.createElement(XAxis, {
              dataKey: 'month',
              label: { value: 'Time (months)', position: 'insideBottom', offset: -5 },
              domain: [0, 36],
              type: 'number'
            }),
            React.createElement(YAxis, {
              label: { value: 'Value (tokens)', angle: -90, position: 'center' },
              domain: [0, 192]
            }),
            React.createElement(Tooltip, { content: React.createElement(CustomTooltip) }),
            React.createElement(Legend),
            
            React.createElement(Area, {
              type: 'monotone',
              dataKey: 'combinedRevenue',
              stroke: 'transparent',
              fill: 'transparent'
            }),
            React.createElement(Area, {
              type: 'monotone',
              dataKey: 'marketPrice',
              stroke: 'transparent',
              fill: '#b15bcf',
              fillOpacity: 0.6,
              name: 'Fee Revenue Layer'
            }),
            
            React.createElement(Area, {
              type: 'monotone',
              dataKey: 'marketPrice',
              stroke: 'transparent',
              fill: 'transparent'
            }),
            React.createElement(Area, {
              type: 'monotone',
              dataKey: 'costToMint',
              stroke: 'transparent',
              fill: '#20b2aa',
              fillOpacity: 0.6,
              name: 'Profit Region'
            }),
            
            React.createElement(Line, {
              type: 'monotone',
              dataKey: 'marketPrice',
              stroke: '#00528a',
              strokeWidth: 2,
              dot: { stroke: '#00528a', strokeWidth: 2, r: 2 },
              name: 'Market Price'
            }),
            React.createElement(Line, {
              type: 'monotone',
              dataKey: 'costToMint',
              stroke: '#b15bcf',
              strokeWidth: 2,
              dot: { stroke: '#b15bcf', strokeWidth: 2, r: 2 },
              strokeDasharray: '5 5',
              name: 'Cost to Mint'
            }),
            React.createElement(Line, {
              type: 'monotone',
              dataKey: 'combinedRevenue',
              stroke: '#20b2aa',
              strokeWidth: 2,
              dot: { stroke: '#20b2aa', strokeWidth: 2, r: 2 },
              name: 'Combined Revenue'
            })
          )
        )
      )
    )
  );
};

// ==============================================
// 5. TCSI COMPONENT BREAKDOWN
// ==============================================
const TCSIComponentBreakdown = () => {
  const initialData = {
    2021: [
      { name: 'Servers', value: 30, color: '#20b2aa' },
      { name: 'Network Equipment', value: 25, color: '#00528a' },
      { name: 'Storage Systems', value: 20, color: '#b15bcf' },
      { name: 'Security Hardware', value: 15, color: '#25d0c7' },
      { name: 'Power Infrastructure', value: 10, color: '#a487cf' }
    ],
    2022: [
      { name: 'Servers', value: 28, color: '#20b2aa' },
      { name: 'Network Equipment', value: 27, color: '#00528a' },
      { name: 'Storage Systems', value: 22, color: '#b15bcf' },
      { name: 'Security Hardware', value: 16, color: '#25d0c7' },
      { name: 'Power Infrastructure', value: 7, color: '#a487cf' }
    ],
    2023: [
      { name: 'Servers', value: 25, color: '#20b2aa' },
      { name: 'Network Equipment', value: 30, color: '#00528a' },
      { name: 'Storage Systems', value: 24, color: '#b15bcf' },
      { name: 'Security Hardware', value: 18, color: '#25d0c7' },
      { name: 'Power Infrastructure', value: 3, color: '#a487cf' }
    ],
    2024: [
      { name: 'Servers', value: 22, color: '#20b2aa' },
      { name: 'Network Equipment', value: 32, color: '#00528a' },
      { name: 'Storage Systems', value: 26, color: '#b15bcf' },
      { name: 'Security Hardware', value: 18, color: '#25d0c7' },
      { name: 'Power Infrastructure', value: 2, color: '#a487cf' }
    ],
    2025: [
      { name: 'Servers', value: 20, color: '#20b2aa' },
      { name: 'Network Equipment', value: 35, color: '#00528a' },
      { name: 'Storage Systems', value: 28, color: '#b15bcf' },
      { name: 'Security Hardware', value: 15, color: '#25d0c7' },
      { name: 'Power Infrastructure', value: 2, color: '#a487cf' }
    ]
  };

  const years = Object.keys(initialData);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentYear, setCurrentYear] = useState(years[years.length - 1]);
  const [searchQuery, setSearchQuery] = useState('');

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const filteredData = initialData[currentYear].filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateYear = (direction) => {
    const currentIndex = years.indexOf(currentYear);
    const newIndex = direction === 'next' 
      ? Math.min(currentIndex + 1, years.length - 1) 
      : Math.max(currentIndex - 1, 0);
    setCurrentYear(years[newIndex]);
  };

  const renderActiveShape = (props) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;

    return React.createElement('g', null,
      React.createElement('text', {
        x: cx, y: cy, dy: -20, textAnchor: 'middle', fill: '#333',
        fontWeight: '600', fontSize: 18
      }, payload.name),
      React.createElement('text', {
        x: cx, y: cy, dy: 10, textAnchor: 'middle', fill: '#333',
        fontWeight: '700', fontSize: 24
      }, `${value}%`),
      React.createElement('text', {
        x: cx, y: cy, dy: 35, textAnchor: 'middle', fill: '#666',
        fontWeight: '400', fontSize: 14
      }, `(${(percent * 100).toFixed(0)}% of total)`),
      React.createElement(Sector, {
        cx, cy, innerRadius, outerRadius: outerRadius + 15,
        startAngle, endAngle, fill
      }),
      React.createElement(Sector, {
        cx, cy, startAngle, endAngle,
        innerRadius: outerRadius + 20,
        outerRadius: outerRadius + 25,
        fill
      })
    );
  };

  return React.createElement('div', { className: 'chart-container' },
    React.createElement('h1', { className: 'chart-title' }, 'TCSI Component Breakdown'),
    React.createElement('h2', { className: 'chart-subtitle' }, 'Evolution of Infrastructure Components'),
    
    React.createElement('div', { style: { position: 'relative', marginBottom: '1rem' } },
      React.createElement('div', {
        style: {
          position: 'absolute',
          left: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }
      },
        React.createElement(Search, { size: 20, color: '#9ca3af' })
      ),
      React.createElement('input', {
        type: 'text',
        placeholder: 'Search components...',
        value: searchQuery,
        onChange: (e) => setSearchQuery(e.target.value),
        style: {
          width: '100%',
          paddingLeft: '2.5rem',
          paddingRight: '0.75rem',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          fontSize: '0.875rem'
        }
      })
    ),

    React.createElement('div', { 
      style: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem' 
      } 
    },
      React.createElement('button', {
        onClick: () => navigateYear('prev'),
        disabled: years.indexOf(currentYear) === 0,
        className: 'btn-secondary',
        style: { opacity: years.indexOf(currentYear) === 0 ? 0.3 : 1 }
      },
        React.createElement(ChevronLeft, { size: 24 })
      ),
      
      React.createElement('div', { style: { flex: 1, margin: '0 0.5rem', position: 'relative' } },
        React.createElement('input', {
          type: 'range',
          min: '0',
          max: years.length - 1,
          value: years.indexOf(currentYear),
          onChange: (e) => setCurrentYear(years[e.target.value]),
          style: {
            width: '100%',
            height: '0.75rem',
            backgroundColor: '#e5e7eb',
            borderRadius: '0.5rem',
            appearance: 'none',
            cursor: 'pointer'
          }
        }),
        React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            marginTop: '0.25rem',
            position: 'relative'
          }
        },
          years.map((year, index) => {
            const isCurrentYear = year === currentYear;
            const position = `${(index / (years.length - 1)) * 100}%`;
            
            return React.createElement('div', {
              key: year,
              style: {
                position: 'absolute',
                left: position,
                transform: 'translateX(-50%)'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: isCurrentYear ? 600 : 400,
                  fontSize: '0.875rem',
                  color: isCurrentYear ? '#00528a' : '#6b7280'
                }
              }, year)
            )
          })
        )
      ),
      
      React.createElement('button', {
        onClick: () => navigateYear('next'),
        disabled: years.indexOf(currentYear) === years.length - 1,
        className: 'btn-secondary',
        style: { opacity: years.indexOf(currentYear) === years.length - 1 ? 0.3 : 1 }
      },
        React.createElement(ChevronRight, { size: 24 })
      )
    ),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem' } },
      React.createElement('div', { style: { height: '24rem', display: 'flex', justifyContent: 'center', alignItems: 'center' } },
        React.createElement(ResponsiveContainer, { width: '100%', height: '550' },
          React.createElement(PieChart, null,
            React.createElement(Pie, {
              activeIndex: activeIndex,
              activeShape: renderActiveShape,
              data: filteredData,
              cx: '50%',
              cy: '50%',
              innerRadius: 120,
              outerRadius: 160,
              dataKey: 'value',
              onMouseEnter: onPieEnter,
              animationDuration: 300
            },
              filteredData.map((entry, index) =>
                React.createElement(Cell, { key: `cell-${index}`, fill: entry.color })
              )
            )
          )
        )
      ),

      React.createElement('div', null,
        React.createElement('h2', {
          style: {
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#6b7280',
            marginBottom: '0.75rem'
          }
        }, `Components (${currentYear})`),
        React.createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '0.75rem',
            maxHeight: '24rem',
            overflowY: 'auto',
            paddingRight: '0.5rem'
          }
        },
          filteredData.map((item, index) =>
            React.createElement('div', {
              key: index,
              onMouseEnter: () => setActiveIndex(index),
              style: {
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                borderLeftWidth: '4px',
                borderLeftColor: item.color,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s'
              }
            },
              React.createElement('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }
              },
                React.createElement('div', null,
                  React.createElement('h4', { style: { fontWeight: '500' } }, item.name),
                  React.createElement('p', {
                    style: {
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }
                  }, `${(item.value / filteredData.reduce((sum, i) => sum + i.value, 0) * 100).toFixed(1)}% of total`)
                ),
                React.createElement('div', {
                  style: {
                    fontWeight: '700',
                    fontSize: '1.25rem'
                  }
                }, `${item.value}%`)
              )
            )
          )
        )
      )
    ),

    React.createElement('div', {
      style: {
        marginTop: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'center'
      }
    },
      initialData[currentYear].map((item, index) =>
        React.createElement('div', {
          key: index,
          style: { display: 'flex', alignItems: 'center' }
        },
          React.createElement('div', {
            style: {
              width: '1rem',
              height: '1rem',
              marginRight: '0.5rem',
              borderRadius: '50%',
              backgroundColor: item.color
            }
          }),
          React.createElement('span', {
            style: {
              fontWeight: '500',
              fontSize: '0.875rem'
            }
          }, item.name)
        )
      )
    )
  );
};


    // ==============================================
    // RENDER FUNCTION
    // ==============================================
    function renderChart(containerId, Component) {
      const container = document.getElementById(containerId);
      if (container) {
        try {
          ReactDOM.render(React.createElement(Component), container);
          console.log(`Successfully rendered ${containerId}`);
        } catch (error) {
          console.error(`Error rendering ${containerId}:`, error);
          container.innerHTML = `<div style="padding: 2rem; text-align: center; color: #ef4444;">
            <p>Error loading chart. Please refresh the page.</p>
          </div>`;
        }
      } else {
        console.log(`Container ${containerId} not found on this page`);
      }
    }

    // ==============================================
    // INITIALIZE ALL CHARTS
    // ==============================================
    function initAllCharts() {
      console.log('Initializing all charts...');
      
      // Render charts yang ada di halaman
      renderChart('cost-equilibrium-chart', CostEquilibriumChart);
      renderChart('economic-layering-chart', EconomicLayeringChart);
      renderChart('infrastructure-dividend-chart', InfrastructureDividendChart);
      renderChart('interactive-chart', InteractiveChart);
      renderChart('tcsi-component-chart', TCSIComponentBreakdown);
      
      // Tambahkan chart lainnya di sini seiring kebutuhan
      
      console.log('Chart initialization complete');
    }

    // Start initialization
    initAllCharts();
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      waitForLibraries(initializeCharts);
    });
  } else {
    waitForLibraries(initializeCharts);
  }

})();
