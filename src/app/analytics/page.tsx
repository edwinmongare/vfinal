"use client";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import {
  Users2,
  PackagePlusIcon,
  BadgeCheck,
  RefreshCcw,
  BanIcon,
  Loader2,
} from "lucide-react";
import { DateRange } from "react-day-picker";

// Define the Order interface
interface Order {
  id: string;
  approvedForSale: string;
  createdAt: string;
  // Add other properties as needed based on your actual API response
}
const initialDateRange = {
  from: new Date(2024, 1, 1), // February 1, 2024
  to: new Date(2030, 0, 31), // January 31, 2030
};

// Define the Page component
export default function Page() {
  // State variables to manage data
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [approvedOrders, setApprovedOrders] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [rejectedOrders, setRejectedOrders] = useState<number>(0);
  const [todaysSales, setTodaysSales] = useState<number>(0);
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(initialDateRange);
  const [isLoading, setIsLoading] = useState(false);

  // Function to check if a date is today
  const isToday = (date: string) => {
    const today = new Date();
    const orderDate = new Date(date);
    return (
      today.getDate() === orderDate.getDate() &&
      today.getMonth() === orderDate.getMonth() &&
      today.getFullYear() === orderDate.getFullYear()
    );
  };
  // Skeleton component for loading state
  // Skeleton component for loading state
  function PageSkeleton() {
    return (
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="animate-spin h-8 w-8 text-zinc-300" />
        <h3 className="font-semibold text-xl">Fetching Data...</h3>
        <p className="text-muted-foreground text-sm">
          This won&apos;t take long.
        </p>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true when starting to fetch data

        // Fetch users data
        const usersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`
        );
        const usersData = await usersResponse.json();
        setTotalUsers(usersData.totalDocs);

        // Fetch orders data without date range parameters
        const ordersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`
        );

        const ordersData = await ordersResponse.json();

        // Filter orders based on the selected date range
        const filteredOrders = ordersData.docs.filter((order: Order) => {
          const orderDate = new Date(order.createdAt);
          return (
            (!selectedDateRange?.from || orderDate >= selectedDateRange.from) &&
            (!selectedDateRange?.to || orderDate <= selectedDateRange.to)
          );
        });

        setTotalOrders(filteredOrders.length);

        // Set various order-related states based on the filtered data
        setApprovedOrders(
          filteredOrders.filter(
            (order: Order) => order.approvedForSale === "approved"
          ).length
        );
        setPendingOrders(
          filteredOrders.filter(
            (order: Order) => order.approvedForSale === "pending"
          ).length
        );
        setRejectedOrders(
          filteredOrders.filter(
            (order: Order) => order.approvedForSale === "denied"
          ).length
        );

        // Filter orders for today and set todaysSales state
        const todaySales = filteredOrders.filter((order: Order) =>
          isToday(order.createdAt)
        ).length;
        setTodaysSales(todaySales);
        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch data only if selectedDateRange is defined
    if (selectedDateRange) {
      fetchData();
    }
  }, [selectedDateRange]);

  // Empty dependency array to run the effect only once on component mount
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-0">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
          <div className="hidden md:flex items-center space-x-2">
            <CalendarDateRangePicker
              onChange={(dateRange) => setSelectedDateRange(dateRange)}
              initialDateRange={initialDateRange}
            />
          </div>
        </div>

        {/* Display loading message when data is being fetched */}
        {isLoading && <PageSkeleton />}

        {!isLoading && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <Users2 className="h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalUsers}</div>
                    {/* <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Orders
                    </CardTitle>
                    <PackagePlusIcon className="h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold ">{totalOrders}</div>
                    {/* <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Approved
                    </CardTitle>
                    <BadgeCheck className="h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                      {approvedOrders}
                    </div>
                    {/* <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium ">
                      Pending
                    </CardTitle>
                    <RefreshCcw className="h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-300">
                      {pendingOrders}
                    </div>
                    {/* <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Rejected
                    </CardTitle>
                    <BanIcon className="h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-700">
                      {rejectedOrders}
                    </div>
                    {/* <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p> */}
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-8">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Earnings</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview selectedDateRange={selectedDateRange} />
                  </CardContent>
                </Card>
                <Card className="col-span-4 md:col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                      You made {todaysSales} sales today.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales selectedDateRange={selectedDateRange} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </ScrollArea>
  );
}
