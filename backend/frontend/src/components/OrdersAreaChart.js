import React from 'react';
import {Line} from 'react-chartjs-2';
import {Chart, Legend, LinearScale, LineElement, PointElement, TimeScale} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import the adapter

function OrdersAreaChart({orders = [], startDate, endDate}) {
    // Prepare the data for the chart


    const groupAndSumOrdersByDay = (orders) => {
        const filteredOrders = orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return (
                (!startDate || new Date(startDate).setHours(0, 0, 0, 0) <= orderDate) &&
                (!endDate || orderDate <= new Date(endDate).setHours(23, 59, 59, 999))
            );
        });

        console.log("Filtered Orders: ", filteredOrders)

        const groupedOrders = filteredOrders.reduce((acc, order) => {
            const date = new Date(order.createdAt).setHours(0, 0, 0, 0);
            acc[date] = (acc[date] || 0) + Number(order.totalPrice);
            return acc;
        }, {});

        const sortedDates = Object.keys(groupedOrders).sort((a, b) => new Date(a) - new Date(b));
        return sortedDates.map((date) => ({date: new Date(Number(date)), totalPrice: groupedOrders[date]}));
    };

    const groupedOrders = groupAndSumOrdersByDay(orders);
    Chart.register(TimeScale, LinearScale, Legend, PointElement, LineElement); // Register the adapter
    console.log("Orders: ", groupedOrders)
    const data = {
        labels: groupedOrders.map(order => order.date),
        datasets: [
            {
                label: 'Revenue',
                data: groupedOrders.map(order => order.totalPrice),
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.4,
            },
        ],
    };

    // Chart options
    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'MMM dd', // Display format for day
                    },
                },
                ticks: {
                    minUnit: 'day',
                },
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Revenue ($)',
                },
            },
        },
    };

    return (
        <Line data={data} options={options}/>
    );
}

export default OrdersAreaChart;