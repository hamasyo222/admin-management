import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RegionalDistributionChartProps {
  data?: { prefecture: string; count: number; percentage?: number }[];
}

export const RegionalDistributionChart: React.FC<RegionalDistributionChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: []
  });
  
  const [options, setOptions] = useState<ChartOptions<'pie'>>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15
        }
      },
      title: {
        display: true,
        text: '地域分布',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw as number;
            const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value}人 (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  });

  useEffect(() => {
    prepareChartData();
  }, [data]);

  const prepareChartData = () => {
    if (!data || data.length === 0) {
      // Default data if no data is provided
      const defaultLabels = ['静岡県', '愛知県', '東京都', '大阪府', 'その他'];
      const defaultData = [50, 30, 20, 15, 10];
      
      setChartData({
        labels: defaultLabels,
        datasets: [
          {
            data: defaultData,
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)', // blue-500
              'rgba(16, 185, 129, 0.8)', // emerald-500
              'rgba(245, 158, 11, 0.8)', // amber-500
              'rgba(139, 92, 246, 0.8)', // violet-500
              'rgba(229, 231, 235, 0.8)', // gray-200
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(139, 92, 246, 1)',
              'rgba(229, 231, 235, 1)',
            ],
            borderWidth: 1,
          }
        ]
      });
      return;
    }

    // Sort data by count in descending order
    const sortedData = [...data].sort((a, b) => b.count - a.count);
    
    // Take top 5 regions and group the rest as "その他"
    let chartLabels: string[] = [];
    let chartValues: number[] = [];
    
    if (sortedData.length <= 5) {
      chartLabels = sortedData.map(item => item.prefecture);
      chartValues = sortedData.map(item => item.count);
    } else {
      const top5 = sortedData.slice(0, 5);
      const others = sortedData.slice(5);
      
      chartLabels = [...top5.map(item => item.prefecture), 'その他'];
      chartValues = [
        ...top5.map(item => item.count),
        others.reduce((sum, item) => sum + item.count, 0)
      ];
    }

    // Prepare chart data
    setChartData({
      labels: chartLabels,
      datasets: [
        {
          data: chartValues,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)', // blue-500
            'rgba(16, 185, 129, 0.8)', // emerald-500
            'rgba(245, 158, 11, 0.8)', // amber-500
            'rgba(139, 92, 246, 0.8)', // violet-500
            'rgba(236, 72, 153, 0.8)', // pink-500
            'rgba(229, 231, 235, 0.8)', // gray-200
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(229, 231, 235, 1)',
          ],
          borderWidth: 1,
        }
      ]
    });
  };

  return (
    <div className="w-full h-full">
      <Pie data={chartData} options={options} />
    </div>
  );
};