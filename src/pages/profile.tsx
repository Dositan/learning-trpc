import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Page } from '~/components/layout/Page';
import { PostSection } from '~/components/post/PostSection';
import SignIn from '~/components/common/SignIn';
import { trpc } from '~/utils/trpc';
import { NextPageWithLayout } from './_app';

const Profile: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const postsQuery = trpc.useQuery(['user.posts']);
  const { data } = postsQuery;

  if (!session) return <SignIn />;
  return (
    <Page title="Profile">
      {/* Header */}
      <div className="flex flex-col items-center justify-center">
        <Image
          className="rounded-full"
          src={session.user?.image || '/default-avatar.png'}
          width={100}
          height={100}
          alt="User Avatar"
        />
        <h1 className="text-4xl font-extrabold">{session.user?.name}</h1>
        <h3 className="text-2xl">{data?.length} posts</h3>
      </div>
      {/* User Posts */}
      <PostSection profilePage postsQuery={postsQuery} session={session} />
    </Page>
  );
};

export default Profile;
