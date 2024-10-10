"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import { toast } from "sonner";
import { BackgroundGradient } from "../../components/ui/background-gradient";
import { IconAppWindow } from "@tabler/icons-react";
import Image from "next/image";

interface CertificateDetails {
  surname: string;
  firstName: string;
  localGovernment: string;
  issuingOfficer: string;
  createdAt: string;
}

const Page: React.FC = () => {
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [certificateDetails, setCertificateDetails] =
    useState<CertificateDetails | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [invalidCertificate, setInvalidCertificate] = useState<boolean>(false);

  const handleScan = async (data: any) => {
    if (data && data.text) {
      const id = data.text;
      setScannedId(id);
      setCameraActive(false); // Close the camera after a successful scan
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          if (responseData) {
            setCertificateDetails({
              surname: responseData.surname,
              firstName: responseData.firstName,
              localGovernment: responseData.localGovernment,
              issuingOfficer: responseData.issuingOfficer[0].issuingOfficer,
              createdAt: responseData.createdAt,
            });
            setInvalidCertificate(false);
            toast.success("Certificate is valid.");
          } else {
            setCertificateDetails(null);
            setInvalidCertificate(true);
            toast.error("Certificate is not valid.");
          }
        } else {
          setCertificateDetails(null);
          setInvalidCertificate(true);
          toast.error("Certificate is not valid.");
        }
      } catch (error) {
        console.error("Error verifying certificate:", error);
        setCertificateDetails(null);
        setInvalidCertificate(true);
        toast.error("Verification failed. Please try again.");
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  const startScan = () => {
    setCameraActive(true);
    setScannedId(null);
    setCertificateDetails(null);
    setInvalidCertificate(false);
  };

  const cancelScan = () => {
    setCameraActive(false);
  };

  return (
    <MaxWidthWrapper>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Verify Certificate</h1>
        <div className="mb-4">
          <button
            onClick={startScan}
            className="px-4 py-2 rounded-sm border  border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
          >
            Start Scan
          </button>

          {cameraActive && (
            <button
              onClick={cancelScan}
              className="px-4 py-2 rounded-sm border  border-black bg-red-500 ml-5 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            >
              Cancel Scan
            </button>
          )}
        </div>
        {cameraActive && (
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%" }}
          />
        )}
        {scannedId && certificateDetails && (
          <div className="mt-4">
            <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
              <p className="text-sm text-neutral-600 mt-4 mb-0 dark:text-neutral-200">
                <strong>Surname:</strong> {certificateDetails.surname}
              </p>

              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong>First Name:</strong> {certificateDetails.firstName}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong>Local Government:</strong>{" "}
                {certificateDetails.localGovernment}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong>Issuing Officer:</strong>{" "}
                {certificateDetails.issuingOfficer}
              </p>
              <button className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
                <span>Created At</span>
                <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                  {new Date(certificateDetails.createdAt).toLocaleString()}
                </span>
              </button>
            </BackgroundGradient>
          </div>
        )}
        {invalidCertificate && (
          <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
            <p className="text-sm text-red-600 mt-4 mb-0 dark:text-neutral-200">
              Certificate Not Valid
            </p>
          </BackgroundGradient>
        )}
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
