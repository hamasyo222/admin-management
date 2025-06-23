import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PredictionChartProps {
  predictions?: { date: string; value: number }[];
  confidenceIntervals?: { date: string; lowerBound: number; upperBound: number }[];
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ 
  predictions,
  confidenceIntervals
}) => {
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
        text: 'ユーザー成長予測',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.dataset.label === '予測値') {
              return `予測値: ${Math.round(context.parsed.y)}`;
            } else if (context.dataset.label === '信頼区間上限') {
              return `上限: ${Math.round(context.parsed.y)}`;
            } else if (context.dataset.label === '信頼区間下限') {
              return `下限: ${Math.round(context.parsed.y)}`;
            }
            return `${context.dataset.label}: ${context.parsed.y}`;
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
  }, [predictions, confidenceIntervals]);

  const prepareChartData = () => {
    if (!predictions || predictions.length === 0) {
      // Default data if no data is provided
      const defaultMonths = ['1月', '2月', '3月', '4月', '5月', '6月'];
      const defaultValues = [1200, 1300, 1450, 1600, 1750, 1900];
      const defaultLower = [1150, 1220, 1350, 1480, 1600, 1720];
      const defaultUpper = [1250, 1380, 1550, 1720, 1900, 2080];
      
      setChartData({
        labels: defaultMonths,
        datasets: [
          {
            label: '予測値',
            data: defaultValues,
            borderColor: 'rgba(59, 130, 246, 1)', // blue-500
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            fill: false,
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          },
          {
            label: '信頼区間上限',
            data: defaultUpper,
            borderColor: 'rgba(209, 213, 219, 1)', // gray-300
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderDash: [5, 5],
            pointRadius: 0,
            fill: '+1',
          },
          {
            label: '信頼区間下限',
            data: defaultLower,
            borderColor: 'rgba(209, 213, 219, 1)', // gray-300
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
          }
        ]
      });
      return;
    }

    // Format dates for labels
    const labels = predictions.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('ja-JP', { month: 'numeric' }) + '月';
    });

    // Prepare datasets
    const datasets = [
      {
        label: '予測値',
        data: predictions.map(item => item.value),
        borderColor: 'rgba(59, 130, 246, 1)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        fill: false,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      }
    ];

    // Add confidence intervals if available
    if (confidenceIntervals && confidenceIntervals.length > 0) {
      datasets.push(
        {
          label: '信頼区間上限',
          data: confidenceIntervals.map(item => item.upperBound),
          borderColor: 'rgba(209, 213, 219, 1)', // gray-300
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderDash: [5, 5],
          pointRadius: 0,
          fill: '+1',
        },
        {
          label: '信頼区間下限',
          data: confidenceIntervals.map(item => item.lowerBound),
          borderColor: 'rgba(209, 213, 219, 1)', // gray-300
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        }
      );
    }

    // Set chart data
    setChartData({
      labels,
      datasets
    });
  };

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={options} />
    </div>
  );
};