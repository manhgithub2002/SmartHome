"use client"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export interface DataEntry {
    temp: number;
    hum: number;
    light: number;
    time: string;
}

interface DashboardProps {
    dataSensors: DataEntry[]
}

const LineChart = ({ dataSensors }: DashboardProps) => {
    // console.log(dataSensors);
    
    const options = {
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                min: 0,
                max: 100
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                min: 0,
                max: 5000,
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    const data = {
        labels: dataSensors.map(item => item.time),
        datasets: [
            {
                label: 'Temperature',
                data: dataSensors.map(it => it.temp),
                borderColor: 'rgba(234, 43, 43, 1)',
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                yAxisID: 'y',
            },
            {
                label: 'Humidity',
                data: dataSensors.map(it => it.hum),
                borderColor: 'rgba(45, 236, 148, 1)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                yAxisID: 'y',
            },
            {
                label: 'Brightness',
                data: dataSensors.map(it => it.light),
                borderColor: 'rgba(218, 246, 45, 1)',
                backgroundColor: 'rgba(255, 255, 0, 0.3)',
                yAxisID: 'y1',
            },
        ],
    };

    return (
        <Line className='max-h-[400px]' options={options} data={data} />
    )
};

export default LineChart;
