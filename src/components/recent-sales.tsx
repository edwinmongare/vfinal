import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Order } from "@/payload-types";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

interface RecentSalesProps {
  selectedDateRange: DateRange | undefined;
}

export function RecentSales({ selectedDateRange }: RecentSalesProps) {
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

  // Filter orders based on the selected date range
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return (
      (!selectedDateRange?.from || orderDate >= selectedDateRange.from) &&
      (!selectedDateRange?.to || orderDate <= selectedDateRange.to)
    );
  });

  return (
    <div className="space-y-8">
      {filteredOrders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {order.firstName[0]}
              {order.surname[0]}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {order.firstName} {order.surname}
            </p>
          </div>
          <div className="ml-auto font-medium">+&#8358;{order.price}.00</div>
        </div>
      ))}
    </div>
  );
}
