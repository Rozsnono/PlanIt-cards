'use client'; // if you're using Next.js App Router

import Chart from '@/components/chart';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from 'chart.js';
import { color } from 'chart.js/helpers';
import { useEffect } from 'react';
import { Bar, Doughnut, Line, PolarArea } from 'react-chartjs-2';

ChartJS.defaults.color = '#fff'; // Set default text color for all charts
// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend
);

export default function LineChart({ labels, data, datasets }: { labels: string[]; data: number[], datasets?: { label: string, borderColor: string, backgroundColor: string } }) {
    const chartData = {
        labels,
        datasets: [
            {
                label: datasets?.label || 'Sample Data',
                data,
                borderColor: datasets?.borderColor || 'rgb(75, 192, 192)',
                backgroundColor: datasets?.backgroundColor || 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                type: 'category' as const,
                title: {
                    display: false,
                },
                grid: {
                    display: true,
                    color: '#ffffff50'
                }
            },
            y: {
                title: {
                    display: false,
                    text: datasets?.label || 'Values',
                },
                beginAtZero: true,
                grid: {
                    display: true,
                    color: '#ffffff50'
                }
            },
        }
    };

    return <Line data={chartData} options={options} />;
}

export function DoughnutChart({ labels, data, datasets }: { labels: string[]; data: number[], datasets?: { label?: string, colors?: string[] } }) {
    const chartData = {
        labels,
        datasets: [
            {
                label: datasets?.label || 'Data',
                data,
                backgroundColor: datasets?.colors || [
                    '#36A2EB',
                    '#FF6384',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                ],
                borderColor: '#1c1c1c',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
    };

    return <Doughnut data={chartData} options={options} />;
}

export function BarChart({ labels, data, datasets }: { labels: string[]; data: number[], datasets?: { label: string, borderColor: string | string[], backgroundColor: string | string[] } }) {
    const chartData = {
        labels,
        datasets: [
            {
                label: datasets?.label || labels,
                data,
                backgroundColor: datasets?.backgroundColor || 'rgba(75, 192, 192, 0.2)',
                borderColor: datasets?.borderColor || 'rgb(75, 192, 192)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                type: 'category' as const,
                title: {
                    display: false,
                },
                grid: {
                    display: false,
                    color: '#ffffff50'
                },
            },
            y: {
                title: {
                    display: false,
                },
                beginAtZero: true,
                grid: {
                    display: false,
                    color: '#ffffff50'
                },
                display: false,
            },
        }
    };

    return <Bar data={chartData as any} options={options} />;
}

export function PolarChart({ labels, data, datasets }: { labels: string[]; data: number[], datasets?: { label: string, borderColor: string | string[], backgroundColor: string | string[] } }) {
    const chartData = {
        labels,
        datasets: [
            {
                label: datasets?.label || 'Sample Data',
                data,
                borderColor: datasets?.borderColor || 'rgb(75, 192, 192)',
                backgroundColor: datasets?.backgroundColor || 'rgba(75, 192, 192, 0.2)',
                pointBackgroundColor: '#ffffff00',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: false,
            },
        },
        scales: {
            r: {
                min: 0,
                ticks: {
                    display: true,
                    stepSize: 1,
                    color: '#ffffff',
                    backdropColor: 'transparent',
                    zindex: 100,
                }
            }
        }
    };

    return <PolarArea data={chartData} options={options} />;
}

export function ChartCards({ title, labels, data, datasets, type }: { title: string, type: 'line' | 'doughnut' | 'bar' | 'polar', labels: string[]; data: number[], datasets?: { label: string, borderColor: string, backgroundColor: string } }) {

    function GetChart() {
        switch (type) {
            case 'line':
                return <LineChart labels={labels} data={data} datasets={datasets} />;
            case 'doughnut':
                return <DoughnutChart labels={labels} data={data} datasets={datasets} />;
            case 'bar':
                return <BarChart labels={labels} data={data} datasets={datasets} />;
            case 'polar':
                return <PolarChart labels={labels} data={data} datasets={datasets} />;
            default:
                return null;
        }
    }

    return (
        <div className="flex justify-center items-center gap-4">
            <div className="bg-zinc-800 p-4 rounded-lg chart-card-shadow w-[32rem] h-[32rem] flex flex-col ">
                <h2 className="text-lg font-semibold mb-2">{title}</h2>
                <div className="h-[24rem] w-full flex justify-center items-center">
                    <GetChart />
                </div>
                <div className="text-sm text-zinc-400 mt-2">
                    {datasets?.label && <span>{datasets.label}</span>}
                    <span className="text-zinc-500"> - {labels.length} data points</span>
                </div>
            </div>
        </div>
    );
}