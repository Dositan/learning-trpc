import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { trpc } from '~/utils/trpc';
import { NextPageWithLayout } from './_app';

const Profile: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const postsQuery = trpc.useQuery([
    'user.posts',
    { id: session?.user?.id as string },
  ]);

  if (!session) {
    return (
      <>
        <h1>Not Authorized</h1>
        <button onClick={() => signIn()}>Sign In</button>
      </>
    );
  }
  return (
    <>
      <Image
        src={session.user?.image || ''}
        width={100}
        height={100}
        alt="User Avatar"
      />
      <h1>{session.user?.name}</h1>
      <Link href="/">
        <a>
          <button>Go home</button>
        </a>
      </Link>

      <h1>Your Posts {postsQuery.status === 'loading' && '(loading)'}</h1>
      {postsQuery.data?.map((item) => (
        <article key={item.id}>
          <h3>{item.title}</h3>
          <Link href={`/post/${item.id}`}>
            <a>View more</a>
          </Link>
        </article>
      ))}
    </>
  );
};

export default Profile;
