import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Page } from '~/components/Page';
import { trpc } from '~/utils/trpc';
import { NextPageWithLayout } from './_app';

const Profile: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const postsQuery = trpc.useQuery([
    'user.posts',
    { id: session?.user?.id as string },
  ]);

  const { data } = postsQuery;

  if (!session) {
    return (
      <>
        <h1>Not Authorized</h1>
        <button onClick={() => signIn()}>Sign In</button>
      </>
    );
  }
  return (
    <Page title="Profile">
      <div className="flex flex-col items-center justify-center">
        <Image
          className="rounded-full"
          src={session.user?.image || ''}
          width={100}
          height={100}
          alt="User Avatar"
        />
        <h1 className="text-4xl font-extrabold">{session.user?.name}</h1>
        <h3 className="text-2xl">{data?.length} posts</h3>
      </div>

      <div className="my-4">
        <h1 className="text-4xl font-extrabold text-center">
          Your Posts{postsQuery.status === 'loading' && ' (loading)'}
        </h1>
        {data?.map((item) => (
          <article key={item.id}>
            <h3 className="text-2xl font-semibold">{item.title}</h3>
            <Link href={`/post/${item.id}`}>
              <a className="text-teal-400">View more</a>
            </Link>
          </article>
        ))}
      </div>
    </Page>
  );
};

export default Profile;
