import Head from 'next/head';
import { ReactQueryDevtools } from 'react-query/devtools';
import Footer from './Footer';
import Navbar from './Navbar';

type DefaultLayoutProps = { children: React.ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Head>
        <title>Qaldyr - Post Anything</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="max-w-[60ch] mx-auto p-4">{children}</main>
      <Footer />

      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  );
};
