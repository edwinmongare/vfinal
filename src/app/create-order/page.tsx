"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { OYO_STATES } from "../../config/states";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowBigRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

// Define the Page component
const Page: React.FC = () => {
  // State variables for file and form input values
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [createdID, setCreatedID] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [localGovernments, setLocalGovernments] = useState<string[]>([]); // NEW STATE

  // Declare config outside of useEffect
  const config: any = {
    // Use 'any' as the type for the configuration object
    public_key: "FLWPUBK_TEST-00b01b55e9c9f1b803f17e394069273f-X",
    tx_ref: Date.now(),
    amount: 200,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: "user@pacesetter.com",
      name: "pacesetter",
    },
    customizations: {
      title: "Pacesetter",
      description: "Payment for certifcate generation",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);
  const router = useRouter();
  useEffect(() => {
    // This useEffect will be triggered whenever createdID is updated
    if (createdID !== null) {
      handleFlutterPayment({
        callback: async (response: any) => {
          console.log(response, "response here");

          if (response.status === "successful") {
            try {
              const req = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${createdID}`,
                {
                  method: "PATCH",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    _isPaid: true,
                    _flutterwaveID: `${response.transaction_id}`,
                  }),
                }
              );
              router.push("/view-orders");
              toast.success(
                "We have received payment for your order. Once we approve your request, we shall notify you via email so that you can download your certificate."
              );
              console.log(response, "response here");
            } catch (err) {
              // console.error(err, "Failed to update payment status");
            }
          }

          closePaymentModal();
        },
        onClose: () => {},
      });
    }
  }, [createdID, handleFlutterPayment, router]);

  const [formValues, setFormValues] = useState<Record<string, string>>({
    surname: "",
    firstName: "",
    otherName: "",
    homeTown: "",
    compoundOrVillage: "",
  });

  // Event handler for file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    setFormValues({
      ...formValues,
      [fieldName]: event.target.value,
    });
  };

  // Event handler for local government selection
  const handleLocalGovernmentChange = (selectedLocalGovernment: string) => {
    // Check if the selectedLocalGovernment is already in the array
    if (!localGovernments.includes(selectedLocalGovernment)) {
      // If not, add it to the array
      setLocalGovernments((prevLocalGovernments) => [
        ...prevLocalGovernments,
        selectedLocalGovernment,
      ]);
    }
  };

  const handleLocalGovernmentRemove = (selectedLocalGovernment: string) => {
    // Remove the selectedLocalGovernment from the array
    setLocalGovernments((prevLocalGovernments) =>
      prevLocalGovernments.filter((lg) => lg !== selectedLocalGovernment)
    );
  };

  // Event handler for form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if a file is selected
    if (file) {
      setLoading(true);
      // Create FormData object
      const formData = new FormData();

      // Append file and additional form data
      formData.append("file", file);
      formData.append("_isPaid", String(false));
      formData.append("approvedForSale", String("pending"));
      formData.append("price", String(1000));
      formData.append("localGovernment", localGovernments.join(",")); // UPDATE HERE

      // Append user details
      Object.entries(formValues).forEach(([key, value]) => {
        formData.append(key, value);
      });

      try {
        // Send POST request to the server
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Check if the submission was successful
        if (response.status === 201) {
          toast.success("Form submitted successfully!");
          setCreatedID(response.data?.doc?.id);
          router.refresh();
        } else {
          // toast.error("Form submission failed. Please try again.");
        }
      } catch (error) {
        // Handle errors
        // console.log(error);
      }
    }
  };

  // Return the JSX for the component
  // Return the JSX for the component
  return (
    <>
      {loading ? (
        <div className="container relative flex pt-10 flex-col items-center justify-center lg:px-0">
          {/* Loading spinner */}
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin h-8 w-8 text-zinc-300" />
            <h3 className="font-semibold text-xl">Submitting Data...</h3>
            <p className="text-muted-foreground text-sm">
              This won&apos;t take long.
            </p>
          </div>
        </div>
      ) : (
        // Show page content
        <div className="container relative flex pt-10 flex-col items-center justify-center lg:px-0">
          <div className="mx-auto flex w-full flex-col justify-center space-y-5 sm:w-[1050px]">
            {/* Card component for styling */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>
                  Lets get you started with your state of identification
                  certificate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Form for file upload */}
                <form onSubmit={handleSubmit}>
                  <div className="grid w-full items-center gap-7">
                    {/* Individual input fields for user details */}
                    {[
                      { name: "surname", label: "Surname" },
                      { name: "firstName", label: "First Name" },
                      { name: "otherName", label: "Other Name" },
                      { name: "homeTown", label: "Home Town" },
                      {
                        name: "compoundOrVillage",
                        label: "Compound or Village",
                      },
                      { name: "localGovernment", label: "Local Government" }, // Move Local Government here
                    ].map((field) => (
                      <div
                        key={field.name}
                        className="flex flex-col space-y-1.5"
                      >
                        <Label htmlFor={field.name}>{field.label}</Label>
                        {field.name === "localGovernment" ? (
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between"
                              >
                                {localGovernments.length > 0
                                  ? localGovernments
                                      .map(
                                        (lg) =>
                                          OYO_STATES.find(
                                            (oyo_state) =>
                                              oyo_state.value === lg
                                          )?.label
                                      )
                                      .join(", ")
                                  : "Select local state..."}
                                <CaretSortIcon className="ml-2 h-4 max-h-7 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] max-h-[300px] overflow-y-auto p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search state..."
                                  className="h-9"
                                />
                                <CommandEmpty>No state found.</CommandEmpty>
                                <CommandGroup>
                                  {OYO_STATES.map((oyo_state) => (
                                    <CommandItem
                                      key={oyo_state.value}
                                      value={oyo_state.value}
                                      onSelect={(currentValue: any) => {
                                        handleLocalGovernmentChange(
                                          currentValue
                                        );
                                        setOpen(false);
                                      }}
                                    >
                                      {oyo_state.label}
                                      <CheckIcon
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          localGovernments.includes(
                                            oyo_state.value
                                          )
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <Input
                            type="text"
                            value={formValues[field.name]}
                            onChange={(e) => handleInputChange(e, field.name)}
                            placeholder={`Please enter your ${field.label}`}
                          />
                        )}
                      </div>
                    ))}

                    {/* Label for file input */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="passport">Passport Image</Label>
                      <Input type="file" onChange={handleFileChange} />
                    </div>

                    <Button type="submit" className="w-full py-4">
                      <>
                        {/* Icon and text */}
                        <ArrowBigRight className="mr-2" /> Proceed with payment
                      </>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

// Export the Page component
export default Page;
