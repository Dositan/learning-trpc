import { useSession } from 'next-auth/react';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CommentSection from '~/components/CommentSection';
import { NextPageWithLayout } from '~/pages/_app';
import { ACTION_BUTTON, CARD, DELETE_BUTTON } from '~/styles';
import { trpc } from '~/utils/trpc';

const PostViewPage: NextPageWithLayout = () => {
  // Router
  const { query, push } = useRouter();
  const id = query.id as string;
  // Session
  const { data: session } = useSession();
  // States
  const [title, setTitle] = useState<string | undefined>('');
  const [subtitle, setSubtitle] = useState<string | undefined>('');
  const [text, setText] = useState<string | undefined>('');
  const [editing, setEditing] = useState(false);
  const [rawShown, setRawShown] = useState(false);
  // tRPC
  const utils = trpc.useContext();
  const postQuery = trpc.useQuery(['post.byId', { id }]);
  const editPost = trpc.useMutation('post.edit', {
    async onSuccess() {
      await utils.invalidateQueries(['post.byId', { id }]);
    },
  });
  const deletePost = trpc.useMutation('post.delete', {
    async onSuccess() {
      push('/');
      await utils.invalidateQueries(['post.all']);
    },
  });
  const { data: post } = postQuery;

  useEffect(() => {
    setTitle(post?.title);
    setSubtitle(post?.subtitle);
    setText(post?.text);
  }, [post]);

  // failed getting post
  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (!post || postQuery.status !== 'success') {
    return <>Loading...</>;
  }
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
      {/* Post Content */}
      <p>{post.text}</p>
      {/* Edit Form */}
      <div className={`my-10 flex items-center justify-center ${CARD}`}>
        <form
          hidden={!editing}
          onSubmit={async (e) => {
            e.preventDefault();
            /**
             * In a real app you probably don't want to use this manually
             * Checkout React Hook Form - it works great with tRPC
             * @link https://react-hook-form.com/
             */

            const $text: HTMLInputElement = (e as any).target.elements.text;
            const $title: HTMLInputElement = (e as any).target.elements.title;
            const $subtitle: HTMLInputElement = (e as any).target.elements
              .subtitle;
            const data = {
              title: $title.value,
              subtitle: $subtitle.value,
              text: $text.value,
            };
            try {
              await editPost.mutateAsync({ id, data });

              $title.value = '';
              $subtitle.value = '';
              $text.value = '';
            } catch {}
          }}
        >
          <h2 className="text-center text-3xl font-bold mb-2">Edit Post</h2>
          <div>
            <label className="text-2xl font-semibold" htmlFor="title">
              Title:
            </label>
            <br />
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              disabled={editPost.isLoading}
            />
          </div>

          <div className="my-4">
            <label className="text-2xl font-semibold" htmlFor="subtitle">
              Subtitle:
            </label>
            <br />
            <input
              id="subtitle"
              name="subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.currentTarget.value)}
              disabled={editPost.isLoading}
            />
          </div>

          <div className="my-4">
            <label className="text-2xl font-semibold" htmlFor="text">
              Text:
            </label>
            <br />
            <textarea
              id="text"
              name="text"
              value={text}
              onChange={(e) => setText(e.currentTarget.value)}
              disabled={editPost.isLoading}
            />
          </div>

          <button
            className="py-2 px-4 rounded-md text-white bg-teal-400 hover:bg-teal-500 hover:duration-500"
            type="submit"
            disabled={editPost.isLoading}
          >
            Save
          </button>
          {editPost.error && (
            <p style={{ color: 'red' }}>{editPost.error.message}</p>
          )}
        </form>
      </div>
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
