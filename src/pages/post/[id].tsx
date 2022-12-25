import { useSession } from 'next-auth/react';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { CommentSection } from '~/components/comment/CommentSection';
import { NextPageWithLayout } from '~/pages/_app';
import { ACTION_BUTTON, CARD, DELETE_BUTTON } from '~/styles';
import { trpc } from '~/utils/trpc';
import styles from '~/styles/Post.module.css';
import EditPost from '~/components/post/EditPost';

const PostViewPage: NextPageWithLayout = () => {
  // Router
  const { query, push } = useRouter();
  const id = query.id as string;
  // Session
  const { data: session } = useSession();
  // States
  const [editing, setEditing] = useState(false);
  const [rawShown, setRawShown] = useState(false);

  // tRPC
  const utils = trpc.useContext();
  const postQuery = trpc.useQuery(['post.byId', { id }]);
  const deletePost = trpc.useMutation('post.delete', {
    async onSuccess() {
      push('/');
      await utils.invalidateQueries(['post.all']);
    },
  });
  const { data: post } = postQuery;

  // failed getting post
  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (!post || postQuery.status !== 'success') return <>Loading...</>;
  return (
    <>
      {/* Header */}
      <h1 className="text-4xl font-extrabold">{post.title}</h1>
      <p className="my-2">{post.subtitle}</p>
      <div className="flex items-center justify-between my-2">
        <p className="text-gray-400">
          Created {post.createdAt.toLocaleDateString('en-us')}
        </p>
        <div className="flex gap-2 my-2">
          <button
            className={ACTION_BUTTON}
            onClick={() => setRawShown(!rawShown)}
          >
            JSON
          </button>
          {session?.user?.id === post.userId && (
            <>
              <button
                className={ACTION_BUTTON}
                onClick={() => setEditing(!editing)}
              >
                Edit
              </button>
              <button
                className={DELETE_BUTTON}
                onClick={() => deletePost.mutate({ id })}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      <EditPost id={id} editing={editing} post={post} />
      {/* Post Content */}
      <ReactMarkdown className={styles.content}>{post.text}</ReactMarkdown>
      {/* Displaying JSON data */}
      <div className={`my-10 ${CARD}`} hidden={!rawShown}>
        <code>{JSON.stringify(post, null, 4)}</code>
      </div>
      {/* Comments Section */}
      <CommentSection session={session} postId={post.id} />
    </>
  );
};

export default PostViewPage;
