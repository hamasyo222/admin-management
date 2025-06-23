import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CategoryCompletionChartProps {
  data?: { category: string; rate: number }[];
}

export const CategoryCompletionChart: React.FC<CategoryCompletionChartProps> = ({ data }) => {
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
        text: 'カテゴリ別完了率',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw as number;
            return `${label}: ${Math.round(value * 100)}%`;
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
      const defaultCategories = ['介護', '日本語', '文化', 'IT', 'ビジネス'];
      const defaultRates = [0.75, 0.65, 0.80, 0.72, 0.68];
      
      setChartData({
        labels: defaultCategories,
        datasets: [
          {
            data: defaultRates,
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)', // blue-500
              'rgba(16, 185, 129, 0.8)', // emerald-500
              'rgba(245, 158, 11, 0.8)', // amber-500
              'rgba(139, 92, 246, 0.8)', // violet-500
              'rgba(236, 72, 153, 0.8)', // pink-500
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(139, 92, 246, 1)',
              'rgba(236, 72, 153, 1)',
            ],
            borderWidth: 1,
          }
        ]
      });
      
      // Update options for bar chart
      setOptions({
        ...options,
        plugins: {
          ...options.plugins,
          legend: {
            ...options.plugins?.legend,
            position: 'top' as const
          }
        }
      });
      
      return;
    }

    // Prepare chart data
    setChartData({
      labels: data.map(item => item.category),
      datasets: [
        {
          data: data.map(item => item.rate),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)', // blue-500
            'rgba(16, 185, 129, 0.8)', // emerald-500
            'rgba(245, 158, 11, 0.8)', // amber-500
            'rgba(139, 92, 246, 0.8)', // violet-500
            'rgba(236, 72, 153, 0.8)', // pink-500
            'rgba(99, 102, 241, 0.8)', // indigo-500
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(99, 102, 241, 1)',
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