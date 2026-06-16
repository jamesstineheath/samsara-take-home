import "./globals.css";

export const metadata = {
  title: "Samsara Shift Brief Prototype",
  description: "Connected Maintenance Shift Brief prototype for Hertz LAX"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
