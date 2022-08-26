import NextError from 'next/error';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NextPageWithLayout } from '~/pages/_app';
import { trpc } from '~/utils/trpc';

const PostViewPage: NextPageWithLayout = () => {
  const { query, push } = useRouter();
  const [title, setTitle] = useState<string | undefined>('');
  const [text, setText] = useState<string | undefined>('');
  const id = query.id as string;
  const utils = trpc.useContext();
  const postQuery = trpc.useQuery(['post.byId', { id }]);
  const editPost = trpc.useMutation('post.edit');
  const deletePost = trpc.useMutation('post.delete', {
    async onSuccess() {
      push('/');
      await utils.invalidateQueries(['post.all']);
    },
  });
  const { data } = postQuery;

  const [editing, setEditing] = useState(false);
  const [rawShown, setRawShown] = useState(false);

  useEffect(() => {
    setTitle(data?.title);
    setText(data?.text);
  }, [data]);

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (!data || postQuery.status !== 'success') {
    return <>Loading...</>;
  }
  return (
    <>
      <h1 className="text-4xl font-extrabold">{data.title}</h1>
      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          Created {data.createdAt.toLocaleDateString('en-us')}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setRawShown(!rawShown)}
            className="py-2 px-4 rounded-md text-gray-100 bg-teal-400 hover:bg-teal-500 duration-500"
          >
            JSON
          </button>
          <button
            onClick={() => setEditing(!editing)}
            className="py-2 px-4 rounded-md text-gray-100 bg-teal-400 hover:bg-teal-500 duration-500"
          >
            Edit
          </button>
          <button
            className="text-white rounded-md px-4 py-2 bg-red-400 hover:bg-red-500 hover:duration-500"
            onClick={() => deletePost.mutate({ id })}
          >
            Delete Post
          </button>
        </div>
      </div>

      <p>{data.text}</p>

      <div className="my-10 flex items-center justify-center bg-gray-100 rounded-xl p-10">
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
            const data = {
              title: $title.value,
              text: $text.value,
            };
            try {
              await editPost.mutateAsync({ id, data });

              $title.value = '';
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

      <div className="p-10 bg-gray-100 rounded-xl" hidden={!rawShown}>
        <h2>Raw data:</h2>
        <pre>{JSON.stringify(data, null, 4)}</pre>
      </div>
    </>
  );
};

export default PostViewPage;
