"use client";
import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale, } from "chart.js";
import { Line } from "react-chartjs-2";

export default function Chart({ data }: { data: any }) {

    const allGames = data.wins + data.loses;

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col items-center w-full gap-3 text-zinc-200 ">
                Wins
                <div className="w-full flex justify-end">
                    <div style={{ width: (((data.wins) * 1.0 / (allGames) * 1.0) * 100) + "%" }} className="bg-green-400 h-12 text-zinc-900 flex items-center justify-start px-2 rounded-l-xl font-bold border-r min-w-fit">
                        {data.wins}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center w-full gap-3 text-zinc-200 ">
                Loses
                <div className="w-full flex justify-start">
                    <div style={{ width: (((data.loses) * 1.0 / (allGames) * 1.0) * 100) + "%" }} className="bg-red-400 h-12 text-zinc-900 flex items-center justify-end px-2 rounded-r-xl font-bold border-l min-w-fit">
                        {data.loses}
                    </div>
                </div>
            </div>
        </div>
    )
}


export function LineChart({ labels, wins, losses }: { labels: string[], wins: number[], losses: number[] }) {

    const ref = React.useRef<any>(null);

    const [gradient, setGradient] = React.useState<{ wins: CanvasGradient | null, losses: CanvasGradient | null }>({ wins: null, losses: null });

    React.useEffect(() => {
        if (ref.current) {
            const chartInstance = ref.current;
            const ctx = chartInstance.ctx;

            const gradient = ctx.createLinearGradient(0, 0, 0, chartInstance.height);
            gradient.addColorStop(0, 'rgba(0, 201, 81, 0.2)'); // Light green
            gradient.addColorStop(1, 'rgba(0, 201, 81, 0)'); // Transparent green

            const gradientLoss = ctx.createLinearGradient(0, 0, 0, chartInstance.height);
            gradientLoss.addColorStop(0, 'rgba(251, 44, 54, 0.7)'); // Light red
            gradientLoss.addColorStop(1, 'rgba(251, 44, 54, 0)'); // Transparent red

            setGradient({ wins: gradient, losses: gradientLoss });
        }
    }, [labels, wins, losses]);

    ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement, Filler, TimeScale);

    function getDateFromString(dateString: string): Date {
        const [month, day] = dateString.split('-').map(Number);
        const year = new Date().getFullYear(); // Use current year
        return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript
    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Wins',
                data: wins,
                borderColor: '#00c951',
                backgroundColor: gradient.wins,
                borderWidth: 2,
                pointRadius: 1,
                pointHoverRadius: 2,
                fill: true,
                tension: 0.4, // Smooth line
                cubicInterpolationMode: 'monotone', // Smooth interpolation
            },
            {
                label: 'Losses',
                data: losses,
                borderColor: '#fb2c36',
                backgroundColor: gradient.losses,
                borderWidth: 2,
                pointRadius: 1,
                pointHoverRadius: 2,
                fill: true,
                tension: 0.4, // Smooth line
                cubicInterpolationMode: 'monotone', // Smooth interpolation
            }
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
                enabled: true,
                backgroundColor: '#09090b80',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#6e11b0',
                borderWidth: 1,
                cornerRadius: 4,
                usePointStyle: false,
                displayColors: false,
                callbacks: {
                    title: (tooltipItems: any) => {
                        const item = tooltipItems[0];
                        return `${item.label}`;
                    },
                    label: function (context: any) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${label}: ${value}`;
                    },
                },
            }
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false
                },
                ticks: {
                    color: '#ffffff90',
                    font: {
                        size: 10,
                    },
                    autoSkip: true,
                    maxTicksLimit: 10,
                    maxRotation: 0,
                },
            },
            y: {
                display: false,
                grid: {
                    display: true,
                    color: '#6e11b030',
                    lineWidth: 1,
                },
                ticks: {
                    display: false
                },
            },
        },
    };

    return (
        <Line ref={ref} data={data} options={options} />
    )
}