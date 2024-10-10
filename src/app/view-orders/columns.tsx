// Import necessary components and libraries
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import useCertificateGenerator from "../../hooks/generate-cert";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";
// Update the path accordingly

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Order = {
  id: string;
  createdAt: string;
  surname: string;
  firstName: string;
  localGovernment: string;
  approvedForSale: string; // Assuming this is a string field for approval status
  _isPaid: boolean;
  issuingOfficer: string;
  stamp: string;
  qrcode: string;
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order Number",
  },
  {
    accessorKey: "createdAt",
    header: "Purchase Date",
    cell: ({ row }) => (
      <span>{formatPurchaseDate(row.original.createdAt)}</span>
    ),
  },
  {
    accessorKey: "approvedForSale",
    header: "Approval Status",
    cell: ({ row }) => (
      <Badge
        className={getApprovalBadgeColor(row.original.approvedForSale)}
        variant="outline"
      >
        {row.original.approvedForSale}
      </Badge>
    ),
  },
  {
    accessorKey: "_isPaid",
    header: "Paid Status",
    cell: ({ row }) => (
      <Badge
        className={row.original._isPaid ? "bg-green-400 h-6" : "bg-red-400 h-6"}
        variant="outline"
      >
        {row.original._isPaid ? "Paid" : "Not Paid"}
      </Badge>
    ),
  },
  {
    accessorKey: "tabletImageDownload",
    header: "Download Certificate",
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleDownload(row)}
        disabled={
          !row.original._isPaid || row.original.approvedForSale !== "approved"
        }
      >
        <DownloadIcon className="h-4 w-4" />
      </Button>
    ),
  },
];

const formatPurchaseDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const getApprovalBadgeColor = (approvalStatus: string) => {
  switch (approvalStatus) {
    case "approved":
      return "bg-green-400 h-6";
    case "pending":
      return "bg-yellow-400 h-6";
    case "denied":
      return "bg-red-400 h-6";
    default:
      return "bg-gray-400 h-6"; // Default color for unknown status
  }
};

// eslint-disable-next-line react-hooks/rules-of-hooks
const { generateCertificate } = useCertificateGenerator();
interface CertificateDetails {
  name: string;
  state: string;
  issuingOfficer: string;
  stamp: string;
  id: string;
}

const handleDownload = async (row: Row<Order>) => {
  const { original } = row;

  if (original.approvedForSale === "approved" && original._isPaid === true) {
    const certificateDetails: CertificateDetails = {
      name: `${original.firstName} ${original.surname}`,
      state: original.localGovernment,
      issuingOfficer: original.issuingOfficer,
      stamp: original.stamp,
      id: original.id,
    };

    await generateCertificate(certificateDetails, original);
    toast.success("Downloaded");
  } else {
    toast.error("cant download");
    console.log("Item is not eligible for download.");
    // Optionally, you can provide user feedback that the item is not eligible for download.
  }
};
