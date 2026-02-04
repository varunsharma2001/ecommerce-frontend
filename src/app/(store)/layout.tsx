import Header from '@/app/components/header/Header';
import Footer from '@/app/components/footer/Footer';
import './../globals.css';

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <Footer />
    </>
  );
}
