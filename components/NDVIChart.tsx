'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface NDVIChartProps {
    data: {
        date: string;
        value: number;
    }[];
    label?: string;
}

export default function NDVIChart({ data, label = 'NDVI Value' }: NDVIChartProps) {
    const chartData = {
        labels: data.map((d) => d.date),
        datasets: [
            {
                label: label,
                data: data.map((d) => d.value),
                fill: true,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4,
                pointBackgroundColor: 'rgb(34, 197, 94)',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#1e293b',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                boxPadding: 4,
            },
        },
        scales: {
            y: {
                min: 0,
                max: 1,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    stepSize: 0.2,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="h-[350px] w-full bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Vegetation Index (NDVI)</h3>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                    Precision Mode
                </span>
            </div>
            <div className="h-[250px]">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}
