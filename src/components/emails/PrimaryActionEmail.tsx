import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  render,
} from "@react-email/components";

import * as React from "react";

interface EmailTemplateProps {
  actionLabel: string;
  buttonText: string;
  href: string;
}

export const EmailTemplate = ({
  actionLabel,
  buttonText,
  href,
}: EmailTemplateProps) => {
  return (
    <Html>
      <Head />

      <Preview>State of Origin Certificate Request Portal</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`https://res.cloudinary.com/devryx1y0/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1708130370/logo_xeosjj.jpg?_s=public-apps`}
            height="150"
            alt="Pacesetter Logo"
            style={logo}
          />
          <Text style={paragraph}>Hi there,</Text>
          <Text style={paragraph}>
            Your order has been approved please login to yout acount to download
            your certificate.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={href}>
              {buttonText}
            </Button>
          </Section>
          <Text style={paragraph}>
            Best,
            <br />
            The Pacesetter team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            If you have already downloaded your certificate please ignore this
            email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export const PrimaryActionEmailHtml = (props: EmailTemplateProps) =>
  render(<EmailTemplate {...props} />, { pretty: true });
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    'Genos, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  padding: "12px 12px",
  backgroundColor: "#A40002",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
