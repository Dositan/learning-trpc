import type { Session } from 'next-auth';
import { useState } from 'react';
import { ACTION_BUTTON } from '~/styles';
import { trpc } from '~/utils/trpc';
import { AddPost } from './AddPost';
import { PostItem } from './PostItem';

type PostSectionProps = {
  session: Session;
  postsQuery: any;
  profilePage?: boolean;
};

export const PostSection = ({
  session,
  postsQuery,
  profilePage = false,
}: PostSectionProps) => {
  const [adding, setAdding] = useState(false);

  const utils = trpc.useContext();
  const addPost = trpc.useMutation('post.add', {
    async onSuccess() {
      // refetches posts after a post is added
      if (profilePage) {
        await utils.invalidateQueries(['user.posts']);
      } else {
        await utils.invalidateQueries(['post.all']);
      }
    },
  });

  return (
    <>
      <button className={ACTION_BUTTON} onClick={() => setAdding(!adding)}>
        Add Post
      </button>
      <AddPost adding={adding} addPost={addPost} session={session} />
      <h2 className="text-3xl font-bold my-4">
        Posts
        {postsQuery.status === 'loading' && ' (loading)'}
      </h2>
      <hr />
      {postsQuery.data?.map((post: any) => (
        <PostItem key={post.id} post={post} />
      ))}
    </>
  );
};
