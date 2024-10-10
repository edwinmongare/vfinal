import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Order } from "@/app/view-orders/columns";
import QRCode from "qrcode";

interface CertificateDetails {
  name: string;
  state: string;
  issuingOfficer: string;
  id: string;
}
const useCertificateGenerator = () => {
  const generateCertificate = async (
    details: CertificateDetails,
    orderDetails: Order
  ): Promise<Blob | null> => {
    try {
      const { firstName, surname } = orderDetails;
      const fullName = `${firstName} ${surname}`;

      // Fetch the PDF template

      const templatePath = `${process.env.NEXT_PUBLIC_SERVER_URL}/certificate/certificate.pdf`;
      console.log(templatePath, "template path");
      const templateBytes = await fetch(templatePath).then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF. Status: ${response.status}`);
        }
        return response.arrayBuffer();
      });

      const templatePdf = await PDFDocument.load(templateBytes);
      const page = templatePdf.getPages()[0];
      const customFont = await templatePdf.embedFont(
        StandardFonts.CourierOblique
      );

      const { width, height } = page.getSize();
      const fontSize = 20;

      page.setFont(customFont);

      page.drawText(fullName, {
        x: 300,
        y: 240,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      page.drawText(`${details.state}`, {
        x: 300,
        y: 180,
        size: fontSize,
        color: rgb(0, 0, 0),
      });

      const currentDate = new Date();
      const day = (currentDate.getDate() % 100).toString();
      const month = currentDate.toLocaleString("en-US", { month: "long" });
      const year = String(currentDate.getFullYear()).slice(-2);

      page.drawText(`${day}`, {
        x: 190,
        y: 132,
        size: 15,
        color: rgb(0, 0, 0),
      });

      page.drawText(`${month}`, {
        x: 293,
        y: 132,
        size: 15,
        color: rgb(0, 0, 0),
      });

      page.drawText(`${year}`, {
        x: 413,
        y: 132,
        size: 15,
        color: rgb(0, 0, 0),
      });

      page.drawText(`${details.issuingOfficer}`, {
        x: 100,
        y: 85,
        size: 15,
        color: rgb(0, 0, 0),
      });

      // Fetch the image from URL and embed into PDF
      const imageUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/stamp/signature.png`;
      const imageBytes = await fetch(imageUrl).then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch image. Status: ${response.status}`);
        }
        return response.arrayBuffer();
      });

      const image = await templatePdf.embedPng(imageBytes);
      const imageSize = image.scale(0.2); // Scale the image (adjust as needed)

      page.drawImage(image, {
        x: 560,
        y: 85,
        width: imageSize.width,
        height: imageSize.height,
      });

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(details.id); // Use the certificate ID for the QR code
      const qrImageBytes = await fetch(qrCodeDataUrl).then((res) =>
        res.arrayBuffer()
      );
      const qrImage = await templatePdf.embedPng(qrImageBytes);
      const qrSize = qrImage.scale(0.7); // Adjust the size as needed

      page.drawImage(qrImage, {
        x: width - qrSize.width - 10, // Adjust position as needed
        y: height - qrSize.height - 10, // Adjust position as needed
        width: qrSize.width,
        height: qrSize.height,
      });

      const modifiedPdfBytes = await templatePdf.save();
      const modifiedPdfBlob = new Blob([modifiedPdfBytes], {
        type: "application/pdf",
      });

      // Save the modified PDF using the Blob API
      const link = document.createElement("a");
      link.href = URL.createObjectURL(modifiedPdfBlob);
      link.download = `${fullName} Certificate of Indigeneship.pdf`;
      link.click();

      console.log("Modified PDF saved successfully");

      return modifiedPdfBlob; // Add this line to return the Blob
    } catch (error) {
      console.error("Error modifying PDF:", error);
      return null; // Return null in case of an error
    } finally {
    }
  };

  return { generateCertificate };
};

export default useCertificateGenerator;
