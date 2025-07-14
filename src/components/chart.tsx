"use client";
import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, } from "chart.js";
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

    ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement, Filler);

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
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 4,
                fill: false,
            },
            {
                label: 'Losses',
                data: losses,
                borderColor: '#fb2c36',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 4,
                fill: false,
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
                        return `${getDateFromString(item.label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
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
                display: false,
                grid: {
                    display: false
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
        <Line data={data} options={options} />
    )
}