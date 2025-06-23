import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface MatchingTrendChartProps {
  data?: { month: string; success: number; total: number }[];
}

export const MatchingTrendChart: React.FC<MatchingTrendChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: []
  });
  
  const [options, setOptions] = useState<ChartOptions<'bar'>>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'マッチングトレンド',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.dataset.label === '成功マッチング') {
              return `成功マッチング: ${context.parsed.y}`;
            } else if (context.dataset.label === '総マッチング') {
              return `総マッチング: ${context.parsed.y}`;
            } else {
              return `成功率: ${Math.round(context.parsed.y * 100)}%`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '月'
        },
        grid: {
          display: false
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'マッチング数'
        },
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(243, 244, 246, 0.8)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: '成功率'
        },
        min: 0,
        max: 1,
        ticks: {
          callback: function(value) {
            return `${value * 100}%`;
          }
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    animation: {
      duration: 1000
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    }
  });

  useEffect(() => {
    prepareChartData();
  }, [data]);

  const prepareChartData = () => {
    if (!data || data.length === 0) {
      // Default data if no data is provided
      const defaultMonths = ['1月', '2月', '3月', '4月', '5月', '6月'];
      const defaultSuccess = [10, 12, 15, 18, 20, 22];
      const defaultTotal = [15, 16, 20, 25, 26, 28];
      const defaultRate = defaultSuccess.map((s, i) => s / defaultTotal[i]);
      
      setChartData({
        labels: defaultMonths,
        datasets: [
          {
            type: 'bar' as const,
            label: '総マッチング',
            data: defaultTotal,
            backgroundColor: 'rgba(107, 114, 128, 0.8)', // gray-500
            borderColor: 'rgba(107, 114, 128, 1)',
            borderWidth: 1,
            order: 2
          },
          {
            type: 'bar' as const,
            label: '成功マッチング',
            data: defaultSuccess,
            backgroundColor: 'rgba(16, 185, 129, 0.8)', // emerald-500
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
            order: 1
          },
          {
            type: 'line' as const,
            label: '成功率',
            data: defaultRate,
            borderColor: 'rgba(59, 130, 246, 1)', // blue-500
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
            yAxisID: 'y1',
            order: 0
          }
        ]
      });
      return;
    }

    // Prepare chart data
    const successRates = data.map(item => item.success / item.total);
    
    setChartData({
      labels: data.map(item => item.month),
      datasets: [
        {
          type: 'bar' as const,
          label: '総マッチング',
          data: data.map(item => item.total),
          backgroundColor: 'rgba(107, 114, 128, 0.8)', // gray-500
          borderColor: 'rgba(107, 114, 128, 1)',
          borderWidth: 1,
          order: 2
        },
        {
          type: 'bar' as const,
          label: '成功マッチング',
          data: data.map(item => item.success),
          backgroundColor: 'rgba(16, 185, 129, 0.8)', // emerald-500
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
          order: 1
        },
        {
          type: 'line' as const,
          label: '成功率',
          data: successRates,
          borderColor: 'rgba(59, 130, 246, 1)', // blue-500
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 4,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          yAxisID: 'y1',
          order: 0
        }
      ]
    });
  };

  return (
    <div className="w-full h-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};