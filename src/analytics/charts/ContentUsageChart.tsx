import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ContentUsageChartProps {
  data?: { type: string; views: number; completions: number; completionRate: number }[];
}

export const ContentUsageChart: React.FC<ContentUsageChartProps> = ({ data }) => {
  const [distributionData, setDistributionData] = useState<any>({
    labels: [],
    datasets: []
  });
  
  const [completionData, setCompletionData] = useState<any>({
    labels: [],
    datasets: []
  });
  
  const [distributionOptions, setDistributionOptions] = useState<ChartOptions<'pie'>>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'コンテンツタイプ分布',
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
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  });
  
  const [completionOptions, setCompletionOptions] = useState<ChartOptions<'bar'>>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'コンテンツタイプ別完了率',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `完了率: ${Math.round(context.parsed.y * 100)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'コンテンツタイプ'
        }
      },
      y: {
        title: {
          display: true,
          text: '完了率'
        },
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: function(value) {
            return `${value * 100}%`;
          }
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
      const defaultTypes = ['動画', 'テキスト', 'クイズ', 'インタラクティブ'];
      const defaultViews = [300, 200, 150, 100];
      const defaultCompletionRates = [0.7, 0.6, 0.8, 0.5];
      
      setDistributionData({
        labels: defaultTypes,
        datasets: [
          {
            data: defaultViews,
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)', // blue-500
              'rgba(16, 185, 129, 0.8)', // emerald-500
              'rgba(245, 158, 11, 0.8)', // amber-500
              'rgba(139, 92, 246, 0.8)', // violet-500
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(139, 92, 246, 1)',
            ],
            borderWidth: 1,
          }
        ]
      });
      
      setCompletionData({
        labels: defaultTypes,
        datasets: [
          {
            data: defaultCompletionRates,
            backgroundColor: 'rgba(16, 185, 129, 0.8)', // emerald-500
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
          }
        ]
      });
      return;
    }

    // Prepare data for content type distribution chart
    setDistributionData({
      labels: data.map(item => getContentTypeLabel(item.type)),
      datasets: [
        {
          data: data.map(item => item.views),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)', // blue-500
            'rgba(16, 185, 129, 0.8)', // emerald-500
            'rgba(245, 158, 11, 0.8)', // amber-500
            'rgba(139, 92, 246, 0.8)', // violet-500
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(139, 92, 246, 1)',
          ],
          borderWidth: 1,
        }
      ]
    });
    
    // Prepare data for completion rate chart
    setCompletionData({
      labels: data.map(item => getContentTypeLabel(item.type)),
      datasets: [
        {
          data: data.map(item => item.completionRate),
          backgroundColor: 'rgba(16, 185, 129, 0.8)', // emerald-500
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
        }
      ]
    });
  };

  const getContentTypeLabel = (type: string): string => {
    switch (type) {
      case 'video': return '動画';
      case 'text': return 'テキスト';
      case 'quiz': return 'クイズ';
      case 'interactive': return 'インタラクティブ';
      default: return type;
    }
  };

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-center justify-center">
        <Pie data={distributionData} options={distributionOptions} />
      </div>
      <div className="flex items-center justify-center">
        <Bar data={completionData} options={completionOptions} />
      </div>
    </div>
  );
};