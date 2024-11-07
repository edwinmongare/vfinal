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
import {
  useFlutterwave,
  closePaymentModal,
  FlutterWaveTypes,
} from "flutterwave-react-v3";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { MultiStepLoaderDemo } from "@/components/multi-step-loader";

// Define the Page component
const Page: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [createdID, setCreatedID] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [localGovernments, setLocalGovernments] = useState<string[]>([]);
  const router = useRouter();

  const config: FlutterWaveTypes.FlutterwaveConfig = {
    public_key: "FLWPUBK_TEST-00b01b55e9c9f1b803f17e394069273f-X",
    tx_ref: Date.now().toString(),
    amount: 8000,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: "user@stateoforigin.oyostate.gov.ng",
      name: "pacesetter",
      phone_number: "000",
    },
    customizations: {
      title: "Pacesetter",
      description: "Payment for certificate generation",
      logo: "",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  useEffect(() => {
    if (createdID) {
      handleFlutterPayment({
        callback: async (response) => {
          // Log the full payment response for debugging
          console.log("Payment response:", response);

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
                    _flutterwaveID: response.flw_ref, // Update the payment reference
                  }),
                }
              );

              if (req.ok) {
                // Log successful payment update
                console.log("Payment update successful for order:", createdID);
                router.push("/view-orders");
                toast.success(
                  "Payment received! We’ll notify you once your certificate is ready for download."
                );
              } else {
                // Log server error response
                console.error("Error updating order:", await req.text());
                closePaymentModal();
                toast.error("Server error updating your order.");
              }
            } catch (error) {
              // Log unexpected errors
              console.error("Error during order update:", error);
              toast.error(
                "Payment successful, but there was an error updating your order. Contact support."
              );
            }
          } else {
            // Log payment failure or cancellation
            console.error("Payment failed or was canceled:", response);
            toast.error("Payment was cancelled. Please try again.");
          }

          // Close the payment modal regardless of the outcome
          closePaymentModal();
          setLoading(false);
        },
        onClose: () => {
          // Log when payment modal is closed before completion
          console.log("Payment modal closed by user.");
          closePaymentModal();
          toast.error("Payment process was closed. Please try again.");
          setLoading(false);
        },
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

  const handleLocalGovernmentChange = (selectedLocalGovernment: string) => {
    if (!localGovernments.includes(selectedLocalGovernment)) {
      setLocalGovernments((prevLocalGovernments) => [
        ...prevLocalGovernments,
        selectedLocalGovernment,
      ]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("_isPaid", String(false));
      formData.append("approvedForSale", "pending");
      formData.append("price", "1000");
      formData.append("localGovernment", localGovernments.join(","));
      Object.entries(formValues).forEach(([key, value]) => {
        formData.append(key, value);
      });

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          toast.success("Form submitted successfully!");
          setCreatedID(response.data?.doc?.id); // Setting the createdID
          console.log(response.data?.doc?.id, "respomse from server");
          // Trigger the Flutterwave payment process once the createdID is set
          handleFlutterPayment({
            callback: async (response) => {
              console.log("Payment response:", response);

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
                        _flutterwaveID: response.transaction_id,
                      }),
                    }
                  );

                  if (req.ok) {
                    router.push("/view-orders");
                    toast.success(
                      "Payment received! We’ll notify you once your certificate is ready for download."
                    );
                  } else {
                    closePaymentModal();
                    toast.error("Server error updating your order.");
                  }
                } catch (error) {
                  console.error(error);
                  toast.error(
                    "Payment successful, but there was an error updating your order. Contact support."
                  );
                }
              } else {
                toast.error("Payment was cancelled. Please try again.");
              }
              closePaymentModal();
              setLoading(false);
            },
            onClose: () => {
              closePaymentModal();
              toast.error("Payment process was closed. Please try again.");
              setLoading(false);
            },
          });
        }
      } catch {
        toast.error("Form submission failed. Please try again.");
      }
    }
  };

  return (
    <>
      {loading ? (
        <div className="container relative flex pt-10 flex-col items-center justify-center lg:px-0">
          <div className="flex flex-col items-center gap-2">
            <MultiStepLoaderDemo />
          </div>
        </div>
      ) : (
        <div className="container relative flex pt-10 flex-col items-center justify-center lg:px-0">
          <div className="mx-auto flex w-full flex-col justify-center space-y-5 sm:w-[1050px]">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>
                  Lets get you started with your state of identification
                  certificate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid w-full items-center gap-7">
                    {[
                      { name: "surname", label: "Surname" },
                      { name: "firstName", label: "First Name" },
                      { name: "otherName", label: "Other Name" },
                      { name: "homeTown", label: "Home Town" },
                      {
                        name: "compoundOrVillage",
                        label: "Compound or Village",
                      },
                      { name: "localGovernment", label: "Local Government" },
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
                            placeholder={`Please enter your ${field.label.toLowerCase()}`}
                            id={field.name}
                          />
                        )}
                      </div>
                    ))}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="passport">
                        Select a file to upload (JPEG, PNG, PDF)
                      </Label>
                      <Input
                        type="file"
                        id="passport"
                        accept=".pdf, .jpg, .jpeg, .png"
                        onChange={handleFileChange}
                      />
                    </div>
                    <Button
                      disabled={!file}
                      className="flex w-full  gap-1 items-center text-center justify-center text-lg"
                      type="submit"
                    >
                      <ArrowBigRight className="h-6" />
                      Proceed with Payment
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

export default Page;
