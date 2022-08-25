import Head from 'next/head';
import { ReactQueryDevtools } from 'react-query/devtools';

type DefaultLayoutProps = { children: React.ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Head>
        <title>Qaldyr - Post Anything</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>{children}</main>

      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  );
};
