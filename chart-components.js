// 5 Interactive Charts untuk Webflow - Menggunakan Chart.js
// Hanya aktif di halaman dengan class 'chart-page'

(function() {
  'use strict';
  
  // Check jika halaman ini memiliki charts
  function hasChartsOnPage() {
    return document.querySelector('.chart-page') !== null;
  }
  
  if (!hasChartsOnPage()) {
    console.log('No charts found on this page, skipping chart initialization');
    return;
  }
  
  console.log('Charts detected, initializing...');
  
  // Global variables
  let charts = {};
  
  // Color palette
  const colors = {
    primary: '#20b2aa',
    secondary: '#00528a', 
    tertiary: '#b15bcf',
    hover: '#25d0c7',
    accent: '#a487cf',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  };
  
  // ==============================================
  // 1. COST EQUILIBRIUM CHART
  // ==============================================
  function initCostEquilibriumChart() {
    const canvas = document.getElementById('cost-equilibrium-chart');
    if (!canvas) return;
    
    const scenarios = {
      base: {
        name: 'Base Case Scenario',
        data: [100, 105, 110, 115, 120, 125],
        revenue: [50, 80, 100, 120, 135, 150],
        profit: [-50, -25, -10, 5, 15, 25],
        color: colors.primary
      },
      high: {
        name: 'High Demand Scenario',
        data: [110, 115, 120, 125, 130, 135],
        revenue: [60, 100, 140, 170, 190, 210],
        profit: [-50, -15, 20, 45, 60, 75],
        color: colors.success
      },
      cost: {
        name: 'Cost Reduction Scenario',
        data: [90, 85, 80, 75, 70, 65],
        revenue: [50, 75, 95, 110, 125, 140],
        profit: [-40, -10, 15, 35, 55, 75],
        color: colors.tertiary
      }
    };
    
    let currentScenario = 'base';
    let isAnimating = false;
    let currentTimeIndex = 5;
    
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'],
        datasets: [
          {
            label: 'Cost to Mint',
            data: scenarios[currentScenario].data,
            borderColor: scenarios[currentScenario].color,
            backgroundColor: scenarios[currentScenario].color + '20',
            borderWidth: 3,
            fill: false,
            tension: 0.4
          },
          {
            label: 'Revenue',
            data: scenarios[currentScenario].revenue,
            borderColor: colors.secondary,
            backgroundColor: colors.secondary + '20',
            borderWidth: 3,
            fill: false,
            tension: 0.4
          },
          {
            label: 'Profit',
            data: scenarios[currentScenario].profit,
            borderColor: colors.hover,
            backgroundColor: colors.hover + '20',
            borderWidth: 3,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: scenarios[currentScenario].name,
            font: { size: 16, weight: 'bold' },
            color: scenarios[currentScenario].color
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: { color: '#f3f4f6' },
            ticks: { color: '#6b7280' }
          },
          x: {
            grid: { color: '#f3f4f6' },
            ticks: { color: '#6b7280' }
          }
        },
        elements: {
          point: { radius: 6, hoverRadius: 8 }
        }
      }
    });
    
    charts.costEquilibrium = chart;
    
    // Scenario controls
    const container = canvas.closest('.chart-container');
    if (container) {
      const controlsHTML = `
        <div class="controls-container">
          <button class="btn btn-primary active" data-scenario="base">Base Case</button>
          <button class="btn btn-secondary" data-scenario="high">High Demand</button>
          <button class="btn btn-tertiary" data-scenario="cost">Cost Reduction</button>
        </div>
        <div class="info-panel">
          <div class="info-title">Scenario Details</div>
          <div class="info-text" id="scenario-info">Standard market conditions with moderate growth trajectory and balanced cost-revenue dynamics.</div>
        </div>
      `;
      
      canvas.parentNode.insertAdjacentHTML('beforebegin', controlsHTML);
      
      // Event listeners
      container.querySelectorAll('[data-scenario]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const scenario = e.target.dataset.scenario;
          
          // Update active button
          container.querySelectorAll('[data-scenario]').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          
          // Update chart
          currentScenario = scenario;
          chart.data.datasets[0].data = scenarios[scenario].data;
          chart.data.datasets[1].data = scenarios[scenario].revenue;
          chart.data.datasets[2].data = scenarios[scenario].combinedRevenue;
          chart.options.plugins.title.text = scenarios[scenario].name;
          chart.update('active');
          
          // Update info
          const infos = {
            normal: 'This model demonstrates how layered revenue streams create resilience. The combined revenue line shows how multiple income sources stabilize total revenue even during market volatility.',
            downturn: 'During market downturns, notice how the combined revenue remains more stable than individual market price fluctuations, demonstrating the protective effect of diversified revenue streams.'
          };
          document.getElementById('interactive-info').textContent = infos[scenario];
        });
      });
    }
  }
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
  // 5. TCSI COMPONENT BREAKDOWN CHART
  // ==============================================
  function initTCSIComponentChart() {
    const canvas = document.getElementById('tcsi-component-chart');
    if (!canvas) return;
    
    const yearData = {
      2021: [
        { name: 'Servers', value: 30, color: colors.primary },
        { name: 'Network Equipment', value: 25, color: colors.secondary },
        { name: 'Storage Systems', value: 20, color: colors.tertiary },
        { name: 'Security Hardware', value: 15, color: colors.hover },
        { name: 'Power Infrastructure', value: 10, color: colors.accent }
      ],
      2022: [
        { name: 'Servers', value: 28, color: colors.primary },
        { name: 'Network Equipment', value: 27, color: colors.secondary },
        { name: 'Storage Systems', value: 22, color: colors.tertiary },
        { name: 'Security Hardware', value: 16, color: colors.hover },
        { name: 'Power Infrastructure', value: 7, color: colors.accent }
      ],
      2023: [
        { name: 'Servers', value: 25, color: colors.primary },
        { name: 'Network Equipment', value: 30, color: colors.secondary },
        { name: 'Storage Systems', value: 24, color: colors.tertiary },
        { name: 'Security Hardware', value: 18, color: colors.hover },
        { name: 'Power Infrastructure', value: 3, color: colors.accent }
      ],
      2024: [
        { name: 'Servers', value: 22, color: colors.primary },
        { name: 'Network Equipment', value: 32, color: colors.secondary },
        { name: 'Storage Systems', value: 26, color: colors.tertiary },
        { name: 'Security Hardware', value: 18, color: colors.hover },
        { name: 'Power Infrastructure', value: 2, color: colors.accent }
      ],
      2025: [
        { name: 'Servers', value: 20, color: colors.primary },
        { name: 'Network Equipment', value: 35, color: colors.secondary },
        { name: 'Storage Systems', value: 28, color: colors.tertiary },
        { name: 'Security Hardware', value: 15, color: colors.hover },
        { name: 'Power Infrastructure', value: 2, color: colors.accent }
      ]
    };
    
    let currentYear = '2025';
    
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: yearData[currentYear].map(item => item.name),
        datasets: [{
          data: yearData[currentYear].map(item => item.value),
          backgroundColor: yearData[currentYear].map(item => item.color + '80'),
          borderColor: yearData[currentYear].map(item => item.color),
          borderWidth: 2,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `TCSI Component Breakdown - ${currentYear}`,
            font: { size: 16, weight: 'bold' },
            color: colors.primary
          },
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      }
    });
    
    charts.tcsiComponent = chart;
    
    // Year controls and component details
    const container = canvas.closest('.chart-container');
    if (container) {
      const controlsHTML = `
        <div class="controls-container">
          <button class="btn btn-secondary" data-year="2021">2021</button>
          <button class="btn btn-secondary" data-year="2022">2022</button>
          <button class="btn btn-secondary" data-year="2023">2023</button>
          <button class="btn btn-secondary" data-year="2024">2024</button>
          <button class="btn btn-primary active" data-year="2025">2025</button>
        </div>
        <div class="info-panel">
          <div class="info-title">Component Evolution Analysis</div>
          <div class="info-text">Track how infrastructure component allocation has evolved over time. Notice the shift towards network equipment and storage systems as the infrastructure matures.</div>
          <div class="scenario-grid" id="component-details">
            <!-- Component details will be populated here -->
          </div>
        </div>
      `;
      
      canvas.parentNode.insertAdjacentHTML('beforebegin', controlsHTML);
      
      // Update component details
      function updateComponentDetails(year) {
        const details = document.getElementById('component-details');
        const components = yearData[year];
        
        details.innerHTML = components.map(comp => `
          <div class="scenario-card">
            <div class="scenario-title" style="color: ${comp.color}">${comp.name}</div>
            <div class="scenario-desc">${comp.value}% of total infrastructure</div>
          </div>
        `).join('');
      }
      
      updateComponentDetails(currentYear);
      
      // Year switcher
      container.querySelectorAll('[data-year]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const year = e.target.dataset.year;
          
          // Update active button
          container.querySelectorAll('[data-year]').forEach(b => {
            b.classList.remove('active', 'btn-primary');
            b.classList.add('btn-secondary');
          });
          e.target.classList.remove('btn-secondary');
          e.target.classList.add('active', 'btn-primary');
          
          // Update chart
          currentYear = year;
          chart.data.labels = yearData[year].map(item => item.name);
          chart.data.datasets[0].data = yearData[year].map(item => item.value);
          chart.data.datasets[0].backgroundColor = yearData[year].map(item => item.color + '80');
          chart.data.datasets[0].borderColor = yearData[year].map(item => item.color);
          chart.options.plugins.title.text = `TCSI Component Breakdown - ${year}`;
          chart.update('active');
          
          // Update component details
          updateComponentDetails(year);
        });
      });
    }
  }
  
  // ==============================================
  // INITIALIZATION FUNCTION
  // ==============================================
  function waitForChartJS(callback) {
    if (typeof Chart !== 'undefined') {
      callback();
    } else {
      setTimeout(() => waitForChartJS(callback), 100);
    }
  }
  
  function initializeAllCharts() {
    console.log('Initializing all charts...');
    
    try {
      initCostEquilibriumChart();
      console.log('✅ Cost Equilibrium Chart initialized');
    } catch (error) {
      console.error('❌ Error initializing Cost Equilibrium Chart:', error);
    }
    
    try {
      initEconomicLayeringChart();
      console.log('✅ Economic Layering Chart initialized');
    } catch (error) {
      console.error('❌ Error initializing Economic Layering Chart:', error);
    }
    
    try {
      initInfrastructureDividendChart();
      console.log('✅ Infrastructure Dividend Chart initialized');
    } catch (error) {
      console.error('❌ Error initializing Infrastructure Dividend Chart:', error);
    }
    
    try {
      initInteractiveChart();
      console.log('✅ Interactive Chart initialized');
    } catch (error) {
      console.error('❌ Error initializing Interactive Chart:', error);
    }
    
    try {
      initTCSIComponentChart();
      console.log('✅ TCSI Component Chart initialized');
    } catch (error) {
      console.error('❌ Error initializing TCSI Component Chart:', error);
    }
    
    console.log('All charts initialization complete');
  }
  
  // Cleanup function
  function cleanup() {
    Object.values(charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    charts = {};
  }
  
  // Window cleanup
  window.addEventListener('beforeunload', cleanup);
  
  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      waitForChartJS(initializeAllCharts);
    });
  } else {
    waitForChartJS(initializeAllCharts);
  }
  
  // Global access for debugging
  window.ChartsManager = {
    charts: charts,
    reinitialize: initializeAllCharts,
    cleanup: cleanup
  };

})();
