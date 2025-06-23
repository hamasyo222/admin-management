import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface RegionalMatchingChartProps {
  data?: { region: string; count: number }[];
}

export const RegionalMatchingChart: React.FC<RegionalMatchingChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: []
  });
  
  const [options, setOptions] = useState<ChartOptions<'bar'>>({
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '地域別マッチング',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `マッチング数: ${context.parsed.x}`;
          }
        }
      }
    },
    scales: {
      x: {
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
      y: {
        title: {
          display: true,
          text: '地域'
        },
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 1000
    }
  });

  useEffect(() => {
    prepareChartData();
  }, [data]);

  const prepareChartData = () => {
    if (!data || data.length === 0) {
      // Default data if no data is provided
      const defaultRegions = ['静岡県', '愛知県', '東京都', '大阪府', '神奈川県'];
      const defaultCounts = [45, 30, 25, 15, 5];
      
      setChartData({
        labels: defaultRegions,
        datasets: [
          {
            data: defaultCounts,
            backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue-500
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 4,
          }
        ]
      });
      return;
    }

    // Sort data by count in descending order
    const sortedData = [...data].sort((a, b) => b.count - a.count);
    
    // Prepare chart data
    setChartData({
      labels: sortedData.map(item => item.region),
      datasets: [
        {
          data: sortedData.map(item => item.count),
          backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue-500
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          borderRadius: 4,
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