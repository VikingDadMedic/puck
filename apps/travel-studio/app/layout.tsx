import "@/core/dist/index.css";
import "./styles.css";

export const metadata = {
  title: "Travel Composition Studio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
