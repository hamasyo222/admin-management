import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

interface UserGrowthChartProps {
  data?: {
    totalUsers: number;
    growthRate: number;
    userTypeDistribution: Record<string, number>;
    projectedGrowth: { date: string; value: number }[];
  };
}

export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: []
  });
  
  const [options, setOptions] = useState<ChartOptions<'line'>>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'ユーザー成長推移',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `ユーザー数: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '期間'
        },
        grid: {
          display: true,
          color: 'rgba(243, 244, 246, 0.8)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'ユーザー数'
        },
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(243, 244, 246, 0.8)'
        }
      }
    },
    animation: {
      duration: 1000
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 3,
        hoverRadius: 5
      }
    }
  });

  useEffect(() => {
    prepareChartData();
  }, [data]);

  const prepareChartData = () => {
    if (!data || !data.projectedGrowth || data.projectedGrowth.length === 0) {
      // Default data if no data is provided
      const defaultLabels = ['1月', '2月', '3月', '4月', '5月', '6月'];
      const defaultData = [100, 120, 140, 160, 180, 200];
      
      setChartData({
        labels: defaultLabels,
        datasets: [
          {
            label: 'ユーザー数',
            data: defaultData,
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            fill: true,
          }
        ]
      });
      return;
    }

    // Format dates for labels
    const labels = data.projectedGrowth.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('ja-JP', { month: 'short' });
    });

    // Prepare chart data
    setChartData({
      labels,
      datasets: [
        {
          label: 'ユーザー数',
          data: data.projectedGrowth.map(item => item.value),
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
        }
      ]
    });
  };

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={options} />
    </div>
  );
};