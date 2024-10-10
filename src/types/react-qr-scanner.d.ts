declare module "react-qr-scanner" {
  import { ComponentType } from "react";

  interface QrScannerProps {
    delay?: number;
    onError?: (error: any) => void;
    onScan?: (data: any) => void;
    style?: React.CSSProperties;
    facingMode?: "user" | "environment";
    legacyMode?: boolean;
    maxImageSize?: number;
    className?: string;
  }

  const QrScanner: ComponentType<QrScannerProps>;
  export default QrScanner;
}
