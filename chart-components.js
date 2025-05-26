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

      return React.createElement('div', { className: 'w-full' },
        React.createElement('div', { className: 'chart-container' },
          React.createElement('h1', { className: 'chart-title' }, 'Cost to Mint Economic Equilibrium'),
          React.createElement('h2', { className: 'chart-subtitle' }, 'Visualizing break-even dynamics with multiple scenario options'),
          
          React.createElement('div', { 
            style: { display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' } 
          },
            React.createElement('button', {
              onClick: toggleAnimation,
              className: isAnimating ? 'btn-secondary' : 'btn-primary'
            },
              React.createElement(isAnimating ? Pause : Play, { size: 16 }),
              React.createElement('span', null, isAnimating ? 'Pause' : 'Play')
            ),
            React.createElement('button', {
              onClick: () => setIsDataPanelOpen(!isDataPanelOpen),
              className: 'btn-secondary'
            },
              React.createElement(isDataPanelOpen ? ChevronUp : ChevronDown, { size: 16 }),
              React.createElement('span', null, 'Data')
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
                  domain: [0, 5],
                  label: { value: 'Time', position: 'insideBottom', offset: -10 }
                }),
                React.createElement(YAxis, {
                  domain: [-60, 220],
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
                  const filteredData = scenario.data.slice(0, timeIndex + 1);
                  
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
          ),
          
          // Scenario selection
          React.createElement('div', { style: { marginTop: '2rem' } },
            React.createElement('h3', { 
              style: { 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                color: '#374151'
              } 
            }, 'Scenarios'),
            React.createElement('div', { 
              style: { 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1rem' 
              } 
            },
              Object.keys(data).map(scenarioId => {
                const scenario = data[scenarioId];
                const isSelected = selectedScenarios.includes(scenarioId);
                
                return React.createElement('div', {
                  key: scenarioId,
                  onClick: () => toggleScenario(scenarioId),
                  style: {
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `2px solid ${isSelected ? scenario.color : '#e5e7eb'}`,
                    backgroundColor: isSelected ? `${scenario.color}15` : '#f9fafb',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }
                },
                  React.createElement('div', {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem'
                    }
                  },
                    React.createElement('h4', {
                      style: {
                        fontWeight: '500',
                        color: scenario.color
                      }
                    }, scenario.name),
                    React.createElement(isSelected ? Eye : EyeOff, {
                      size: 16,
                      color: isSelected ? scenario.color : '#9ca3af'
                    })
                  ),
                  React.createElement('p', {
                    style: {
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      fontWeight: '300'
                    }
                  }, scenario.description)
                )
              })
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

      return React.createElement('div', { className: 'w-full' },
        React.createElement('div', { className: 'chart-container' },
          React.createElement('h1', { className: 'chart-title' }, 'Economic Layering with Fee Revenue'),
          React.createElement('h2', { className: 'chart-subtitle' }, 'Shows how different revenue layers create resilience against market volatility'),
          
          React.createElement('div', { 
            style: { display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' } 
          },
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
                React.createElement(AreaChart, { data: initialData },
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
                  })
                ) :
                React.createElement(LineChart, { data: initialData },
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
                  })
                )
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