"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function StarBackground() {
    const [isClient, setIsClient] = useState(false);
    const pathName = usePathname();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null; // vagy valami skeleton

    if((pathName.includes("rummy")||pathName.includes("uno")||pathName.includes("solitaire")) && !pathName.includes('end')) return null; // ha a games oldalakon nem akarod megjeleníteni

    function getPlanetPos() {
        return { saturn: new Date().getMinutes() * (100 / 60), uranus: new Date().getDate() * (100 / 30), neptun: new Date().getHours() * 2.5 * (100 / 60), redgiant: new Date().getMonth() * (100 / 12), moon: new Date().getSeconds() * (200 / 60) - 50 };
    }
    return (
        <main className="absolute top-0 left-0 w-[100%] h-screen overflow-hidden z-[-1]">

            <>
                <div className="star" style={{ "left": "42%", "top": "33%", "animationDelay": "2.26s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "3%", "top": "62%", "animationDelay": "4.95s", "width": "1px", "height": "1px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "77%", "top": "89%", "animationDelay": "2.13s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "27%", "top": "73%", "animationDelay": "2.06s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "63%", "top": "97%", "animationDelay": "2.16s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "77%", "top": "55%", "animationDelay": "2.91s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "89%", "top": "47%", "animationDelay": "0.57s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "66%", "top": "63%", "animationDelay": "3.15s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "53%", "top": "16%", "animationDelay": "3.05s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "62%", "top": "85%", "animationDelay": "2.92s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "12%", "top": "56%", "animationDelay": "4.38s", "width": "4px", "height": "4px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "42%", "top": "74%", "animationDelay": "0.99s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "93%", "top": "71%", "animationDelay": "0.52s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "96%", "top": "25%", "animationDelay": "2.58s", "width": "4px", "height": "4px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "27%", "top": "59%", "animationDelay": "2.07s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "8%", "top": "53%", "animationDelay": "4.01s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "89%", "top": "15%", "animationDelay": "2.91s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "16%", "top": "52%", "animationDelay": "4.76s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "11%", "top": "64%", "animationDelay": "3.64s", "width": "1px", "height": "1px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "88%", "top": "75%", "animationDelay": "2.92s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "35%", "top": "51%", "animationDelay": "4.06s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "24%", "top": "55%", "animationDelay": "4.79s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "6%", "top": "1%", "animationDelay": "2.81s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "30%", "top": "8%", "animationDelay": "0.39s", "width": "2px", "height": "2px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "87%", "top": "52%", "animationDelay": "1.41s", "width": "3px", "height": "3px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "7%", "top": "70%", "animationDelay": "3.88s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "74%", "top": "22%", "animationDelay": "1.74s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "16%", "top": "34%", "animationDelay": "1.92s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "10%", "top": "46%", "animationDelay": "2.83s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "28%", "top": "23%", "animationDelay": "2.70s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "25%", "top": "82%", "animationDelay": "3.32s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "55%", "top": "19%", "animationDelay": "1.28s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "23%", "top": "8%", "animationDelay": "3.31s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "35%", "top": "73%", "animationDelay": "2.23s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "5%", "top": "46%", "animationDelay": "2.53s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "57%", "top": "27%", "animationDelay": "2.02s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "18%", "top": "39%", "animationDelay": "2.07s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "32%", "top": "75%", "animationDelay": "4.66s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "18%", "top": "3%", "animationDelay": "2.87s", "width": "2px", "height": "2px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "85%", "top": "33%", "animationDelay": "2.59s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "68%", "top": "40%", "animationDelay": "0.33s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "31%", "top": "35%", "animationDelay": "1.71s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "36%", "top": "26%", "animationDelay": "4.70s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "76%", "top": "21%", "animationDelay": "3.19s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "22%", "top": "6%", "animationDelay": "1.72s", "width": "1px", "height": "1px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "62%", "top": "21%", "animationDelay": "2.39s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "51%", "top": "13%", "animationDelay": "3.47s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "25%", "top": "34%", "animationDelay": "2.74s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "29%", "top": "57%", "animationDelay": "4.04s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "46%", "top": "8%", "animationDelay": "4.11s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "72%", "top": "33%", "animationDelay": "1.91s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "24%", "top": "11%", "animationDelay": "0.76s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "43%", "top": "43%", "animationDelay": "3.16s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "50%", "top": "25%", "animationDelay": "1.26s", "width": "4px", "height": "4px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "54%", "top": "55%", "animationDelay": "1.87s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "27%", "top": "86%", "animationDelay": "2.12s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "57%", "top": "66%", "animationDelay": "0.70s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "85%", "top": "45%", "animationDelay": "0.01s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "44%", "top": "95%", "animationDelay": "3.78s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "25%", "top": "62%", "animationDelay": "3.53s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "42%", "top": "40%", "animationDelay": "2.11s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "44%", "top": "6%", "animationDelay": "2.94s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "13%", "top": "20%", "animationDelay": "1.62s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "93%", "top": "42%", "animationDelay": "1.93s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "76%", "top": "27%", "animationDelay": "1.06s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "95%", "top": "96%", "animationDelay": "1.02s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "32%", "top": "25%", "animationDelay": "4.90s", "width": "3px", "height": "3px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "54%", "top": "35%", "animationDelay": "1.51s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "69%", "top": "55%", "animationDelay": "2.56s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "48%", "top": "34%", "animationDelay": "1.08s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "87%", "top": "73%", "animationDelay": "0.29s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "32%", "top": "32%", "animationDelay": "4.11s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "30%", "top": "93%", "animationDelay": "1.52s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "20%", "top": "66%", "animationDelay": "2.15s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "6%", "top": "87%", "animationDelay": "0.98s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "58%", "top": "31%", "animationDelay": "2.09s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "32%", "top": "97%", "animationDelay": "4.38s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "80%", "top": "1%", "animationDelay": "0.02s", "width": "2px", "height": "2px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "69%", "top": "32%", "animationDelay": "3.38s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "100%", "top": "20%", "animationDelay": "1.65s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "17%", "top": "18%", "animationDelay": "0.87s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "12%", "top": "74%", "animationDelay": "3.43s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "4%", "top": "9%", "animationDelay": "4.32s", "width": "2px", "height": "2px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "35%", "top": "11%", "animationDelay": "1.13s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "48%", "top": "78%", "animationDelay": "3.07s", "width": "4px", "height": "4px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "42%", "top": "57%", "animationDelay": "2.73s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "72%", "top": "0%", "animationDelay": "1.36s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "84%", "top": "22%", "animationDelay": "0.05s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "59%", "top": "84%", "animationDelay": "0.14s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "39%", "top": "34%", "animationDelay": "3.60s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "54%", "top": "30%", "animationDelay": "2.47s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "85%", "top": "36%", "animationDelay": "2.89s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "5%", "top": "53%", "animationDelay": "1.84s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "5%", "top": "40%", "animationDelay": "4.96s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "4%", "top": "85%", "animationDelay": "3.34s", "width": "2px", "height": "2px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "88%", "top": "93%", "animationDelay": "1.63s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "86%", "top": "41%", "animationDelay": "3.27s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "25%", "top": "26%", "animationDelay": "4.71s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "22%", "top": "27%", "animationDelay": "0.79s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "86%", "top": "72%", "animationDelay": "4.57s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "14%", "top": "0%", "animationDelay": "4.91s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "36%", "top": "47%", "animationDelay": "2.79s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "89%", "top": "22%", "animationDelay": "4.11s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "47%", "top": "87%", "animationDelay": "2.47s", "width": "4px", "height": "4px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "37%", "top": "55%", "animationDelay": "3.13s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "70%", "top": "93%", "animationDelay": "0.58s", "width": "1px", "height": "1px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "62%", "top": "69%", "animationDelay": "4.99s", "width": "4px", "height": "4px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "81%", "top": "33%", "animationDelay": "0.64s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "15%", "top": "69%", "animationDelay": "1.93s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "43%", "top": "24%", "animationDelay": "4.24s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "98%", "top": "91%", "animationDelay": "3.74s", "width": "2px", "height": "2px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "36%", "top": "3%", "animationDelay": "2.63s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "84%", "top": "94%", "animationDelay": "1.21s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "4%", "top": "61%", "animationDelay": "4.13s", "width": "4px", "height": "4px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "44%", "top": "32%", "animationDelay": "4.31s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "23%", "top": "55%", "animationDelay": "2.37s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "26%", "top": "91%", "animationDelay": "0.47s", "width": "1px", "height": "1px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "39%", "top": "10%", "animationDelay": "2.86s", "width": "1px", "height": "1px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "45%", "top": "41%", "animationDelay": "0.12s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "91%", "top": "63%", "animationDelay": "1.33s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "11%", "top": "76%", "animationDelay": "3.09s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "97%", "top": "46%", "animationDelay": "3.44s", "width": "3px", "height": "3px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "9%", "top": "53%", "animationDelay": "2.07s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "64%", "top": "11%", "animationDelay": "0.64s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "82%", "top": "33%", "animationDelay": "4.03s", "width": "1px", "height": "1px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "92%", "top": "8%", "animationDelay": "0.01s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "17%", "top": "10%", "animationDelay": "0.11s", "width": "2px", "height": "2px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "87%", "top": "19%", "animationDelay": "4.05s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "20%", "top": "97%", "animationDelay": "2.99s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "24%", "top": "15%", "animationDelay": "0.65s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "78%", "top": "47%", "animationDelay": "0.36s", "width": "2px", "height": "2px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "97%", "top": "83%", "animationDelay": "1.43s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "63%", "top": "35%", "animationDelay": "0.58s", "width": "2px", "height": "2px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "13%", "top": "75%", "animationDelay": "0.21s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "84%", "top": "1%", "animationDelay": "0.05s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "98%", "top": "0%", "animationDelay": "3.31s", "width": "3px", "height": "3px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "70%", "top": "71%", "animationDelay": "2.89s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "19%", "top": "54%", "animationDelay": "1.44s", "width": "2px", "height": "2px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "87%", "top": "12%", "animationDelay": "3.10s", "width": "1px", "height": "1px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "87%", "top": "61%", "animationDelay": "3.54s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "60%", "top": "81%", "animationDelay": "1.55s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "87%", "top": "51%", "animationDelay": "3.54s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "78%", "top": "89%", "animationDelay": "3.40s", "width": "4px", "height": "4px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "61%", "top": "23%", "animationDelay": "2.05s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "81%", "top": "77%", "animationDelay": "1.80s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "78%", "top": "87%", "animationDelay": "1.86s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "30%", "top": "64%", "animationDelay": "1.50s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "24%", "top": "47%", "animationDelay": "4.08s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "28%", "top": "40%", "animationDelay": "2.76s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "70%", "top": "69%", "animationDelay": "1.88s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "35%", "top": "80%", "animationDelay": "3.23s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "19%", "top": "6%", "animationDelay": "1.57s", "width": "2px", "height": "2px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "51%", "top": "43%", "animationDelay": "0.80s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "22%", "top": "77%", "animationDelay": "4.30s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "16%", "top": "95%", "animationDelay": "1.24s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "39%", "top": "29%", "animationDelay": "4.61s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "35%", "top": "96%", "animationDelay": "2.56s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "41%", "top": "35%", "animationDelay": "4.72s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "99%", "top": "39%", "animationDelay": "1.70s", "width": "1px", "height": "1px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "87%", "top": "86%", "animationDelay": "3.00s", "width": "1px", "height": "1px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "26%", "top": "89%", "animationDelay": "2.13s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "43%", "top": "2%", "animationDelay": "4.16s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "72%", "top": "63%", "animationDelay": "4.53s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "17%", "top": "75%", "animationDelay": "0.96s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "48%", "top": "25%", "animationDelay": "4.20s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "56%", "top": "74%", "animationDelay": "2.73s", "width": "4px", "height": "4px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "64%", "top": "13%", "animationDelay": "3.21s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "24%", "top": "83%", "animationDelay": "4.75s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "38%", "top": "16%", "animationDelay": "2.93s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "88%", "top": "90%", "animationDelay": "1.20s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "93%", "top": "33%", "animationDelay": "1.20s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "53%", "top": "67%", "animationDelay": "1.00s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "78%", "top": "1%", "animationDelay": "0.99s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "1%", "top": "41%", "animationDelay": "1.50s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "23%", "top": "49%", "animationDelay": "4.69s", "width": "4px", "height": "4px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "3%", "top": "56%", "animationDelay": "0.65s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "5%", "top": "10%", "animationDelay": "0.22s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "42%", "top": "79%", "animationDelay": "3.61s", "width": "1px", "height": "1px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "95%", "top": "23%", "animationDelay": "0.10s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "8%", "top": "1%", "animationDelay": "3.51s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "28%", "top": "9%", "animationDelay": "4.48s", "width": "3px", "height": "3px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "78%", "top": "80%", "animationDelay": "2.55s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "67%", "top": "85%", "animationDelay": "2.44s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "91%", "top": "18%", "animationDelay": "2.10s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "9%", "top": "74%", "animationDelay": "2.59s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "100%", "top": "76%", "animationDelay": "4.19s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "25%", "top": "77%", "animationDelay": "3.15s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "71%", "top": "14%", "animationDelay": "3.99s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "60%", "top": "48%", "animationDelay": "3.33s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "11%", "top": "65%", "animationDelay": "2.48s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "96%", "top": "30%", "animationDelay": "3.49s", "width": "3px", "height": "3px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "1%", "top": "90%", "animationDelay": "3.60s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "82%", "top": "17%", "animationDelay": "0.32s", "width": "3px", "height": "3px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "62%", "top": "95%", "animationDelay": "3.52s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "71%", "top": "65%", "animationDelay": "3.25s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "3%", "top": "69%", "animationDelay": "2.93s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "60%", "top": "74%", "animationDelay": "4.49s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "75%", "top": "12%", "animationDelay": "1.28s", "width": "2px", "height": "2px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "66%", "top": "18%", "animationDelay": "3.23s", "width": "1px", "height": "1px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "25%", "top": "47%", "animationDelay": "4.87s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "73%", "top": "26%", "animationDelay": "3.56s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "93%", "top": "67%", "animationDelay": "2.46s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "36%", "top": "88%", "animationDelay": "1.96s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "47%", "top": "9%", "animationDelay": "0.66s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "51%", "top": "2%", "animationDelay": "0.56s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "97%", "top": "28%", "animationDelay": "3.16s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "29%", "top": "3%", "animationDelay": "1.26s", "width": "1px", "height": "1px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "84%", "top": "18%", "animationDelay": "1.03s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "57%", "top": "23%", "animationDelay": "1.39s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "5%", "top": "71%", "animationDelay": "4.72s", "width": "2px", "height": "2px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "39%", "top": "82%", "animationDelay": "0.49s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "7%", "top": "37%", "animationDelay": "0.32s", "width": "2px", "height": "2px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "30%", "top": "26%", "animationDelay": "3.90s", "width": "4px", "height": "4px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "22%", "top": "97%", "animationDelay": "1.17s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "7%", "top": "63%", "animationDelay": "2.60s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "98%", "top": "55%", "animationDelay": "4.84s", "width": "2px", "height": "2px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "65%", "top": "88%", "animationDelay": "4.55s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "3%", "top": "92%", "animationDelay": "0.67s", "width": "2px", "height": "2px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "71%", "top": "46%", "animationDelay": "2.79s", "width": "3px", "height": "3px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "25%", "top": "94%", "animationDelay": "3.14s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "68%", "top": "61%", "animationDelay": "1.90s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "83%", "top": "31%", "animationDelay": "3.25s", "width": "1px", "height": "1px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "93%", "top": "64%", "animationDelay": "0.37s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "30%", "top": "12%", "animationDelay": "2.13s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "21%", "top": "82%", "animationDelay": "0.82s", "width": "1px", "height": "1px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "66%", "top": "13%", "animationDelay": "2.74s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "11%", "top": "86%", "animationDelay": "2.66s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "53%", "top": "40%", "animationDelay": "4.49s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "58%", "top": "48%", "animationDelay": "2.50s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "82%", "top": "96%", "animationDelay": "1.66s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "19%", "top": "22%", "animationDelay": "3.81s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "67%", "top": "53%", "animationDelay": "3.99s", "width": "2px", "height": "2px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "23%", "top": "37%", "animationDelay": "0.63s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "67%", "top": "82%", "animationDelay": "3.32s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "12%", "top": "29%", "animationDelay": "2.42s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "82%", "top": "31%", "animationDelay": "3.59s", "width": "4px", "height": "4px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "29%", "top": "61%", "animationDelay": "1.46s", "width": "1px", "height": "1px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "20%", "top": "98%", "animationDelay": "2.57s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "13%", "top": "95%", "animationDelay": "3.63s", "width": "2px", "height": "2px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "87%", "top": "96%", "animationDelay": "3.31s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "35%", "top": "77%", "animationDelay": "0.82s", "width": "4px", "height": "4px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "56%", "top": "33%", "animationDelay": "1.46s", "width": "4px", "height": "4px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "19%", "top": "74%", "animationDelay": "1.77s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "98%", "top": "3%", "animationDelay": "4.02s", "width": "4px", "height": "4px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "87%", "top": "14%", "animationDelay": "4.73s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "23%", "top": "90%", "animationDelay": "2.93s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "74%", "top": "80%", "animationDelay": "3.45s", "width": "2px", "height": "2px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "59%", "top": "44%", "animationDelay": "4.82s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "31%", "top": "76%", "animationDelay": "0.90s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "45%", "top": "19%", "animationDelay": "1.87s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "38%", "top": "74%", "animationDelay": "1.41s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "57%", "top": "71%", "animationDelay": "2.54s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "72%", "top": "32%", "animationDelay": "4.93s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "21%", "top": "33%", "animationDelay": "1.23s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "28%", "top": "56%", "animationDelay": "0.77s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "69%", "top": "42%", "animationDelay": "4.77s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "72%", "top": "96%", "animationDelay": "1.26s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "84%", "top": "33%", "animationDelay": "3.57s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "44%", "top": "89%", "animationDelay": "3.33s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "83%", "top": "80%", "animationDelay": "1.03s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "27%", "top": "92%", "animationDelay": "0.32s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "25%", "top": "25%", "animationDelay": "2.32s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "2%", "top": "58%", "animationDelay": "0.68s", "width": "2px", "height": "2px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "90%", "top": "81%", "animationDelay": "0.18s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "5%", "top": "88%", "animationDelay": "4.68s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "100%", "top": "54%", "animationDelay": "2.25s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "67%", "top": "65%", "animationDelay": "4.18s", "width": "3px", "height": "3px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "60%", "top": "29%", "animationDelay": "2.95s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "9%", "top": "27%", "animationDelay": "0.61s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "13%", "top": "15%", "animationDelay": "4.81s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "29%", "top": "71%", "animationDelay": "4.28s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "32%", "top": "91%", "animationDelay": "4.06s", "width": "4px", "height": "4px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "71%", "top": "6%", "animationDelay": "0.87s", "width": "2px", "height": "2px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "96%", "top": "54%", "animationDelay": "0.48s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "38%", "top": "18%", "animationDelay": "2.39s", "width": "1px", "height": "1px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "23%", "top": "50%", "animationDelay": "0.28s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "47%", "top": "65%", "animationDelay": "4.10s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "10%", "top": "41%", "animationDelay": "0.46s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "50%", "top": "83%", "animationDelay": "2.17s", "width": "2px", "height": "2px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "38%", "top": "28%", "animationDelay": "1.31s", "width": "2px", "height": "2px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "0%", "top": "32%", "animationDelay": "3.15s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "54%", "top": "98%", "animationDelay": "4.53s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "36%", "top": "57%", "animationDelay": "4.71s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "51%", "top": "26%", "animationDelay": "2.20s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "67%", "top": "99%", "animationDelay": "2.33s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "74%", "top": "91%", "animationDelay": "0.86s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "73%", "top": "10%", "animationDelay": "3.65s", "width": "2px", "height": "2px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "30%", "top": "96%", "animationDelay": "0.05s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "8%", "top": "7%", "animationDelay": "2.69s", "width": "1px", "height": "1px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "4%", "top": "59%", "animationDelay": "4.37s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "52%", "top": "62%", "animationDelay": "0.17s", "width": "2px", "height": "2px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "64%", "top": "65%", "animationDelay": "0.83s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "41%", "top": "32%", "animationDelay": "3.20s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "83%", "top": "40%", "animationDelay": "4.49s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "22%", "top": "20%", "animationDelay": "3.65s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "99%", "top": "81%", "animationDelay": "2.17s", "width": "4px", "height": "4px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "63%", "top": "4%", "animationDelay": "1.40s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "27%", "top": "7%", "animationDelay": "2.45s", "width": "4px", "height": "4px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "93%", "top": "55%", "animationDelay": "0.66s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "4%", "top": "70%", "animationDelay": "2.87s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "13%", "top": "46%", "animationDelay": "2.90s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "12%", "top": "25%", "animationDelay": "4.28s", "width": "1px", "height": "1px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "85%", "top": "39%", "animationDelay": "0.74s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "20%", "top": "27%", "animationDelay": "0.26s", "width": "1px", "height": "1px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "93%", "top": "98%", "animationDelay": "1.86s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "99%", "top": "76%", "animationDelay": "1.92s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "49%", "top": "58%", "animationDelay": "3.34s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "29%", "top": "38%", "animationDelay": "2.92s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "25%", "top": "83%", "animationDelay": "2.85s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "24%", "top": "85%", "animationDelay": "0.30s", "width": "1px", "height": "1px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "72%", "top": "69%", "animationDelay": "3.26s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "89%", "top": "40%", "animationDelay": "2.73s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "75%", "top": "12%", "animationDelay": "4.39s", "width": "3px", "height": "3px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "15%", "top": "80%", "animationDelay": "2.07s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "16%", "top": "80%", "animationDelay": "1.86s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "35%", "top": "75%", "animationDelay": "1.14s", "width": "4px", "height": "4px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "26%", "top": "79%", "animationDelay": "3.80s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "93%", "top": "89%", "animationDelay": "2.11s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "33%", "top": "12%", "animationDelay": "2.07s", "width": "2px", "height": "2px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "98%", "top": "96%", "animationDelay": "2.52s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "98%", "top": "5%", "animationDelay": "3.19s", "width": "1px", "height": "1px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "86%", "top": "73%", "animationDelay": "4.02s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "77%", "top": "78%", "animationDelay": "0.75s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "5%", "top": "49%", "animationDelay": "2.44s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "86%", "top": "71%", "animationDelay": "3.71s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "81%", "top": "63%", "animationDelay": "3.40s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "43%", "top": "78%", "animationDelay": "4.93s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "29%", "top": "22%", "animationDelay": "3.92s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "50%", "top": "83%", "animationDelay": "2.34s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "12%", "top": "79%", "animationDelay": "4.62s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "63%", "top": "54%", "animationDelay": "3.23s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "76%", "top": "38%", "animationDelay": "4.45s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "67%", "top": "63%", "animationDelay": "0.51s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "38%", "top": "77%", "animationDelay": "4.74s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "96%", "top": "13%", "animationDelay": "4.37s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "80%", "top": "10%", "animationDelay": "1.60s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "11%", "top": "43%", "animationDelay": "0.10s", "width": "2px", "height": "2px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "32%", "top": "41%", "animationDelay": "2.14s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "47%", "top": "75%", "animationDelay": "1.94s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "53%", "top": "55%", "animationDelay": "4.12s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "40%", "top": "13%", "animationDelay": "1.15s", "width": "4px", "height": "4px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "73%", "top": "84%", "animationDelay": "2.71s", "width": "2px", "height": "2px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "67%", "top": "70%", "animationDelay": "3.72s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "58%", "top": "33%", "animationDelay": "3.66s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "6%", "top": "66%", "animationDelay": "0.08s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "84%", "top": "89%", "animationDelay": "0.46s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "80%", "top": "74%", "animationDelay": "1.43s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "18%", "top": "3%", "animationDelay": "3.48s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "90%", "top": "9%", "animationDelay": "4.41s", "width": "2px", "height": "2px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "4%", "top": "28%", "animationDelay": "1.41s", "width": "4px", "height": "4px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "69%", "top": "95%", "animationDelay": "2.55s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "8%", "top": "2%", "animationDelay": "0.08s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "29%", "top": "52%", "animationDelay": "0.56s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "81%", "top": "35%", "animationDelay": "3.91s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "83%", "top": "85%", "animationDelay": "4.14s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "74%", "top": "31%", "animationDelay": "2.32s", "width": "4px", "height": "4px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "100%", "top": "5%", "animationDelay": "1.65s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "68%", "top": "48%", "animationDelay": "2.98s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "47%", "top": "36%", "animationDelay": "2.81s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "45%", "top": "0%", "animationDelay": "0.53s", "width": "4px", "height": "4px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "97%", "top": "46%", "animationDelay": "0.87s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "36%", "top": "84%", "animationDelay": "3.22s", "width": "1px", "height": "1px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "44%", "top": "9%", "animationDelay": "0.44s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "90%", "top": "45%", "animationDelay": "4.52s", "width": "2px", "height": "2px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "57%", "top": "84%", "animationDelay": "3.86s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "78%", "top": "92%", "animationDelay": "3.86s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "21%", "top": "30%", "animationDelay": "3.55s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "1%", "top": "15%", "animationDelay": "1.33s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "89%", "top": "30%", "animationDelay": "1.56s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "49%", "top": "0%", "animationDelay": "3.66s", "width": "1px", "height": "1px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "6%", "top": "28%", "animationDelay": "0.74s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "94%", "top": "51%", "animationDelay": "2.95s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "20%", "top": "6%", "animationDelay": "3.94s", "width": "2px", "height": "2px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "73%", "top": "49%", "animationDelay": "3.55s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "12%", "top": "77%", "animationDelay": "3.43s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "29%", "top": "75%", "animationDelay": "1.35s", "width": "3px", "height": "3px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "64%", "top": "52%", "animationDelay": "1.36s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "11%", "top": "71%", "animationDelay": "1.44s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "72%", "top": "70%", "animationDelay": "1.53s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "79%", "top": "51%", "animationDelay": "4.94s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "67%", "top": "63%", "animationDelay": "3.13s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "81%", "top": "73%", "animationDelay": "2.44s", "width": "1px", "height": "1px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "24%", "top": "41%", "animationDelay": "3.58s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "86%", "top": "54%", "animationDelay": "1.37s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "19%", "top": "93%", "animationDelay": "4.22s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "65%", "top": "31%", "animationDelay": "0.29s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "18%", "top": "81%", "animationDelay": "1.82s", "width": "1px", "height": "1px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "61%", "top": "40%", "animationDelay": "0.74s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "68%", "top": "37%", "animationDelay": "4.42s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "90%", "top": "37%", "animationDelay": "2.17s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "46%", "top": "4%", "animationDelay": "1.52s", "width": "2px", "height": "2px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "10%", "top": "41%", "animationDelay": "1.02s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "92%", "top": "22%", "animationDelay": "2.54s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "24%", "top": "11%", "animationDelay": "4.45s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "41%", "top": "26%", "animationDelay": "4.18s", "width": "3px", "height": "3px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "16%", "top": "88%", "animationDelay": "0.88s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "32%", "top": "99%", "animationDelay": "1.78s", "width": "2px", "height": "2px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "24%", "top": "65%", "animationDelay": "0.05s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "28%", "top": "25%", "animationDelay": "1.54s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "23%", "top": "24%", "animationDelay": "0.82s", "width": "2px", "height": "2px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "13%", "top": "41%", "animationDelay": "1.98s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "28%", "top": "86%", "animationDelay": "1.29s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "33%", "top": "65%", "animationDelay": "4.75s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "19%", "top": "14%", "animationDelay": "1.51s", "width": "2px", "height": "2px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "27%", "top": "34%", "animationDelay": "1.95s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "31%", "top": "68%", "animationDelay": "4.00s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "88%", "top": "97%", "animationDelay": "1.86s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "0%", "top": "79%", "animationDelay": "1.30s", "width": "3px", "height": "3px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "44%", "top": "88%", "animationDelay": "0.84s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "63%", "top": "83%", "animationDelay": "4.55s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "31%", "top": "79%", "animationDelay": "0.56s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "18%", "top": "24%", "animationDelay": "4.71s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "9%", "top": "22%", "animationDelay": "1.31s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "84%", "top": "34%", "animationDelay": "0.71s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "15%", "top": "28%", "animationDelay": "0.00s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "26%", "top": "3%", "animationDelay": "2.20s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "68%", "top": "93%", "animationDelay": "1.99s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "57%", "top": "30%", "animationDelay": "0.14s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "90%", "top": "90%", "animationDelay": "0.52s", "width": "2px", "height": "2px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "64%", "top": "46%", "animationDelay": "1.21s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "77%", "top": "26%", "animationDelay": "1.15s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "18%", "top": "81%", "animationDelay": "2.18s", "width": "1px", "height": "1px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "67%", "top": "54%", "animationDelay": "0.54s", "width": "2px", "height": "2px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "74%", "top": "52%", "animationDelay": "2.83s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "7%", "top": "26%", "animationDelay": "4.76s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "22%", "top": "92%", "animationDelay": "0.06s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "18%", "top": "16%", "animationDelay": "0.67s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "84%", "top": "30%", "animationDelay": "2.79s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "76%", "top": "48%", "animationDelay": "1.10s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "64%", "top": "17%", "animationDelay": "4.94s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "36%", "top": "61%", "animationDelay": "3.83s", "width": "2px", "height": "2px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "43%", "top": "77%", "animationDelay": "4.57s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "36%", "top": "45%", "animationDelay": "4.35s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "79%", "top": "58%", "animationDelay": "0.72s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "80%", "top": "59%", "animationDelay": "1.19s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "72%", "top": "1%", "animationDelay": "4.64s", "width": "1px", "height": "1px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "99%", "top": "67%", "animationDelay": "4.17s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "50%", "top": "39%", "animationDelay": "3.19s", "width": "2px", "height": "2px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "2%", "top": "90%", "animationDelay": "0.32s", "width": "2px", "height": "2px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "78%", "top": "61%", "animationDelay": "0.46s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "34%", "top": "38%", "animationDelay": "4.87s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "60%", "top": "14%", "animationDelay": "1.67s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "57%", "top": "75%", "animationDelay": "0.26s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "55%", "top": "75%", "animationDelay": "2.78s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "40%", "top": "92%", "animationDelay": "1.57s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "90%", "top": "24%", "animationDelay": "4.40s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "96%", "top": "80%", "animationDelay": "4.24s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "83%", "top": "73%", "animationDelay": "3.11s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "75%", "top": "16%", "animationDelay": "1.80s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "10%", "top": "57%", "animationDelay": "4.08s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "75%", "top": "13%", "animationDelay": "1.41s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "94%", "top": "7%", "animationDelay": "3.95s", "width": "4px", "height": "4px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "86%", "top": "26%", "animationDelay": "0.43s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "74%", "top": "67%", "animationDelay": "2.07s", "width": "2px", "height": "2px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "14%", "top": "22%", "animationDelay": "4.80s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "22%", "top": "42%", "animationDelay": "2.61s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "51%", "top": "16%", "animationDelay": "2.44s", "width": "1px", "height": "1px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "3%", "top": "24%", "animationDelay": "4.47s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "61%", "top": "28%", "animationDelay": "2.49s", "width": "4px", "height": "4px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "46%", "top": "52%", "animationDelay": "3.31s", "width": "2px", "height": "2px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "18%", "top": "30%", "animationDelay": "4.94s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "38%", "top": "82%", "animationDelay": "1.51s", "width": "1px", "height": "1px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "34%", "top": "19%", "animationDelay": "0.04s", "width": "1px", "height": "1px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "43%", "top": "1%", "animationDelay": "0.38s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "82%", "top": "44%", "animationDelay": "2.64s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "66%", "top": "56%", "animationDelay": "4.65s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "68%", "top": "94%", "animationDelay": "0.13s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "98%", "top": "13%", "animationDelay": "3.85s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "56%", "top": "9%", "animationDelay": "1.47s", "width": "2px", "height": "2px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "44%", "top": "75%", "animationDelay": "4.25s", "width": "2px", "height": "2px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "25%", "top": "45%", "animationDelay": "1.88s", "width": "2px", "height": "2px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "47%", "top": "99%", "animationDelay": "3.26s", "width": "4px", "height": "4px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "24%", "top": "48%", "animationDelay": "3.23s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "21%", "top": "44%", "animationDelay": "0.76s", "width": "1px", "height": "1px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "7%", "top": "17%", "animationDelay": "3.57s", "width": "1px", "height": "1px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "79%", "top": "3%", "animationDelay": "3.10s", "width": "2px", "height": "2px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "32%", "top": "51%", "animationDelay": "4.46s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "3%", "top": "4%", "animationDelay": "1.62s", "width": "3px", "height": "3px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "51%", "top": "43%", "animationDelay": "2.11s", "width": "1px", "height": "1px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "68%", "top": "15%", "animationDelay": "1.84s", "width": "3px", "height": "3px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "58%", "top": "41%", "animationDelay": "4.27s", "width": "4px", "height": "4px", "background": "#d3dae9" }}></div>
                <div className="star" style={{ "left": "56%", "top": "36%", "animationDelay": "4.68s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "44%", "top": "51%", "animationDelay": "0.74s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "13%", "top": "24%", "animationDelay": "0.27s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "87%", "top": "87%", "animationDelay": "1.49s", "width": "1px", "height": "1px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "56%", "top": "61%", "animationDelay": "0.97s", "width": "3px", "height": "3px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "91%", "top": "49%", "animationDelay": "2.05s", "width": "3px", "height": "3px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "30%", "top": "92%", "animationDelay": "4.52s", "width": "3px", "height": "3px", "background": "#f5ba9e" }}></div>
                <div className="star" style={{ "left": "44%", "top": "16%", "animationDelay": "0.86s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "90%", "top": "79%", "animationDelay": "2.61s", "width": "4px", "height": "4px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "51%", "top": "10%", "animationDelay": "3.18s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "89%", "top": "54%", "animationDelay": "4.25s", "width": "4px", "height": "4px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "34%", "top": "28%", "animationDelay": "0.22s", "width": "3px", "height": "3px", "background": "#f7dbb4" }}></div>
                <div className="star" style={{ "left": "45%", "top": "2%", "animationDelay": "3.03s", "width": "2px", "height": "2px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "69%", "top": "76%", "animationDelay": "0.06s", "width": "3px", "height": "3px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "35%", "top": "42%", "animationDelay": "0.76s", "width": "4px", "height": "4px", "background": "#f7eed3" }}></div>
                <div className="star" style={{ "left": "17%", "top": "46%", "animationDelay": "3.07s", "width": "2px", "height": "2px", "background": "#eaecf0" }}></div>
                <div className="star" style={{ "left": "78%", "top": "88%", "animationDelay": "3.43s", "width": "1px", "height": "1px", "background": "#96aad4" }}></div>
                <div className="star" style={{ "left": "37%", "top": "62%", "animationDelay": "1.73s", "width": "4px", "height": "4px", "background": "#dadfe8" }}></div>
                <div className="star" style={{ "left": "18%", "top": "99%", "animationDelay": "1.63s", "width": "3px", "height": "3px", "background": "#eaecf0" }}></div>

            </>


            <>
                <div className="shooting-star sh-star-anim2" style={{ left: '100%', top: '49%', animationDelay: '5.49s' }}></div>
                <div className="shooting-star sh-star-anim4" style={{ right: '100%', top: '40%', animationDelay: '4.56s' }}></div>
                <div className="shooting-star sh-star-anim1" style={{ left: '100%', top: '72%', animationDelay: '17.20s' }}></div>
                <div className="shooting-star sh-star-anim4" style={{ right: '100%', top: '60%', animationDelay: '11.39s' }}></div>
                <div className="shooting-star sh-star-anim1" style={{ left: '100%', top: '20%', animationDelay: '9.80s' }}></div>
                <div className="shooting-star sh-star-anim3" style={{ right: '100%', top: '26%', animationDelay: '14.76s' }}></div>
                <div className="shooting-star sh-star-anim2" style={{ left: '100%', top: '5%', animationDelay: '9.26s' }}></div>
                <div className="shooting-star sh-star-anim3" style={{ right: '100%', top: '98%', animationDelay: '15.32s' }}></div>
                <div className="shooting-star sh-star-anim1" style={{ left: '100%', top: '55%', animationDelay: '12.62s' }}></div>
                <div className="shooting-star sh-star-anim3" style={{ right: '100%', top: '65%', animationDelay: '5.30s' }}></div>
                <div className="shooting-star sh-star-anim2" style={{ left: '100%', top: '36%', animationDelay: '14.04s' }}></div>
                <div className="shooting-star sh-star-anim4" style={{ right: '100%', top: '79%', animationDelay: '15.95s' }}></div>
                <div className="shooting-star sh-star-anim1" style={{ left: '100%', top: '65%', animationDelay: '3.19s' }}></div>
                <div className="shooting-star sh-star-anim3" style={{ right: '100%', top: '6%', animationDelay: '11.94s' }}></div>
                <div className="shooting-star sh-star-anim1" style={{ left: '100%', top: '51%', animationDelay: '12.01s' }}></div>
                <div className="shooting-star sh-star-anim3" style={{ right: '100%', top: '24%', animationDelay: '10.54s' }}></div>
                <div className="shooting-star sh-star-anim1" style={{ left: '100%', top: '38%', animationDelay: '6.82s' }}></div>
                <div className="shooting-star sh-star-anim4" style={{ right: '100%', top: '6%', animationDelay: '1.30s' }}></div>
                <div className="shooting-star sh-star-anim2" style={{ left: '100%', top: '29%', animationDelay: '11.75s' }}></div>
                <div className="shooting-star sh-star-anim3" style={{ right: '100%', top: '7%', animationDelay: '0.32s' }}></div>
            </>

            <div className="dipper">
                <div className="star1"></div>
                <div className="star2"></div>
                <div className="star3"></div>
                <div className="star4"></div>
                <div className="star5"></div>
                <div className="star6"></div>
                <div className="star7"></div>
            </div>

            <div className="swan">
                <div className="star1"></div>
                <div className="star2"></div>
                <div className="star3"></div>
                <div className="star4"></div>
                <div className="star5"></div>
                <div className="star6"></div>
                <div className="star7"></div>
                <div className="star8"></div>
                <div className="star9"></div>
                <div className="star10"></div>
            </div>

            <div className="fish">
                <div className="star1"></div>
                <div className="star2"></div>
                <div className="star3"></div>
                <div className="star4"></div>
                <div className="star5"></div>
                <div className="star6"></div>
                <div className="star7"></div>
                <div className="star8"></div>
                <div className="star9"></div>
                <div className="star10"></div>
                <div className="star11"></div>
                <div className="star12"></div>
                <div className="star13"></div>
                <div className="star14"></div>
                <div className="star15"></div>
                <div className="star16"></div>
                <div className="star17"></div>
            </div>

            <div className="neptun" style={{ left: getPlanetPos().neptun + "%" }}></div>
            <div className="mars" style={{ left: getPlanetPos().redgiant + "%" }}>
                <div className="moon" style={{ left: getPlanetPos().moon + "%", top: ((getPlanetPos().moon) / 10 + 45) + "%" }}></div>
            </div>
            <div className="uranus" style={{ left: getPlanetPos().uranus + "%" }}>
                <div className="ring1"></div>
                <div className="ring2"></div>
                <div className="hover-ring"></div>
            </div>

            <div className="saturn" style={{ left: getPlanetPos().saturn + "%" }}>
                <div className="ring1"></div>
                <div className="ring2"></div>
                <div className="ring3"></div>
                <div className="ring4"></div>
                <div className="hover-ring"></div>
            </div>







            {/* <div className="planet" style={{ width: "150px", height: "150px", right: "10%", bottom: "10%", background: "radial-gradient(circle at 30% 30%, #59b667, #000000)" }}></div>
            <div className="planet" style={{ width: "350px", height: "350px", left: "4%", bottom: "4%", background: "radial-gradient(circle at 50% 30%, #9c0f00, #000000)" }}></div> */}
        </main>
    )
}