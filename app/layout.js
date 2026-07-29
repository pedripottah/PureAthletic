import "./globals.css";

export const metadata = {
  title: "PureAthletic — Train for what comes next",
  description: "A functional prototype for adaptive football training plans.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14211d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
