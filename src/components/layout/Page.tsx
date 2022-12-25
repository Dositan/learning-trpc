import Head from 'next/head';

type PageProps = { children: React.ReactNode; title: string };

export const Page = ({ children, title }: PageProps) => {
  return (
    <>
      <Head>
        <title>{title} | Qaldyr</title>
      </Head>
      <main className="min-h-screen">{children}</main>
    </>
  );
};
