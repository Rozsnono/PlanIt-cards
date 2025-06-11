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
import { useEffect, useRef, useState } from 'react';
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
            legend: { position: 'top' as const },
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
            },
            y: {
                title: {
                    display: true,
                    text: datasets?.label || 'Values',
                },
                beginAtZero: true,
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
            legend: {
                position: 'top' as const,
            },
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
            legend: { position: 'top' as const },
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
            },
            y: {
                title: {
                    display: false,
                },
                beginAtZero: true,
            },
        }
    };

    return <Bar data={chartData} options={options} />;
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
            legend: { position: 'top' as const },
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


export function TestChart() {
    const chartRef = useRef<any>(null);
    const [gradientFills, setGradientFills] = useState<string[]>([]);

    const labels = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];

    const rawDatasets = [
        {
            label: 'Adatsor 1',
            data: [120, 190, 300, 250, 220],
            borderColor: 'rgba(255, 99, 132, 1)',
            pointRadius: 4,
            tension: 0.4,
            fill: true
        },
        {
            label: 'Adatsor 2',
            data: [100, 180, 280, 210, 190],
            borderColor: 'rgba(54, 162, 235, 1)',
            pointRadius: 4,
            tension: 0.4,
            fill: true
        }
    ];

    // Gradient létrehozás (1x a chart mount után)
    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) return;

        const ctx = chart.ctx;
        const areaHeight = chart.chartArea.bottom;

        const gradients = rawDatasets.map((ds) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, areaHeight);
            gradient.addColorStop(0, ds.borderColor.replace('1)', '0.4)'));
            gradient.addColorStop(1, ds.borderColor.replace('1)', '0)'));
            return gradient;
        });

        setGradientFills(gradients);
    }, []);

    const data = {
        labels,
        datasets: rawDatasets.map((ds, i) => ({
            ...ds,
            backgroundColor: gradientFills[i] || 'transparent'
        }))
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false // ❌ Legend teljesen ki van kapcsolva
            },
            tooltip: {
                enabled: true,
                position: 'nearest',
                yAlign: 'top',
                xAlign: 'left'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <Line ref={chartRef} data={data} options={options} />
        </div>
    );
}
