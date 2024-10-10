import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Order } from "@/payload-types";
import { DateRange } from "react-day-picker";

interface OverviewProps {
  selectedDateRange: DateRange | undefined;
}

interface OrderByDay {
  name: string;
  total: number;
}

export function Overview({ selectedDateRange }: OverviewProps) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`
        );
        const data = await response.json();
        setOrders(data.docs);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const transformData = () => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const ordersByDay: Record<string, OrderByDay> = {};

    // Initialize each day with a total of 0
    daysOfWeek.forEach((day) => {
      ordersByDay[day] = {
        name: day,
        total: 0,
      };
    });

    // Update totals based on actual orders
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);

      // Check if the order is within the selected date range
      if (
        (!selectedDateRange?.from || orderDate >= selectedDateRange.from) &&
        (!selectedDateRange?.to || orderDate <= selectedDateRange.to)
      ) {
        const day = orderDate.toLocaleDateString("en-US", {
          weekday: "short",
        });

        // Check if the property exists before updating
        if (ordersByDay[day]) {
          ordersByDay[day].total += parseInt(order.price, 10);
        }
      }
    });

    return Object.values(ordersByDay);
  };

  const chartData = transformData();

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₦${value}`}
        />
        <Bar dataKey="total" fill="#A40002" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
