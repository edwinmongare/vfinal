"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Order, columns } from "./columns";
import { DataTable } from "./data-table";
import { Skeleton } from "@/components/ui/skeleton";

async function getData(): Promise<Order[]> {
  try {
    const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`);
    const data = await req.json();
    // console.log("data", data);

    // Extract only the required fields (id, surname, firstName)
    const extractedData = data.docs.map((doc: any) => {
      return {
        id: doc.id,
        createdAt: doc.createdAt,
        _isPaid: doc._isPaid,
        approvedForSale: doc.approvedForSale,
        firstName: doc.firstName,
        localGovernment: doc.localGovernment,
        surname: doc.surname,
        issuingOfficer: doc.issuingOfficer?.[0]?.issuingOfficer || "",
      };
    });

    return extractedData as Order[];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default function Page() {
  const [data, setData] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await getData();
        setData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures that the effect runs only once on mount

  const numberOfSkeletons = data?.length || 10;

  return (
    <>
      <div className="container relative flex pt-10 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex  flex-col justify-center space-y-5 sm:w-[1050px] max-w-6xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>
                Download your certificate from here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center space-x-4">
                  <div className="space-y-2">
                    {[...Array(numberOfSkeletons)].map((_, index) => (
                      <Skeleton
                        key={index}
                        className="mx-auto justify-center space-y-5 w-[1000px] h-8"
                      />
                    ))}
                  </div>
                </div>
              )}
              {data && !loading && <DataTable columns={columns} data={data} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
