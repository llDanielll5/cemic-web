//@ts-nocheck
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

interface DatasetProps {
  label: string;
  data: number[];
  backgroundColor: string;
}

interface DataChart {
  labels: string[];
  datasets: DatasetProps[];
}

interface VerticalChartProps {
  data: DataChart;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Agendamentos",
    },
  },
};

const VerticalChart = (props: VerticalChartProps) => {
  return (
    <Bar
      style={{
        backgroundColor: "white",
        padding: "4px",
        boxShadow: "0 1px 0 rgba(0, 0, 0, 0.06)",
      }}
      options={options}
      data={props.data}
    />
  );
};

export default VerticalChart;
