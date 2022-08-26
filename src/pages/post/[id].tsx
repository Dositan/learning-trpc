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
      <button onClick={() => push('/')}>Go home</button>
      <h1>{data.title}</h1>
      <em>Created {data.createdAt.toLocaleDateString('en-us')}</em>

      <p>{data.text}</p>

      <h2>Edit post:</h2>
      <form
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
        <label htmlFor="title">Title:</label>
        <br />
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          disabled={editPost.isLoading}
        />

        <br />
        <label htmlFor="text">Text:</label>
        <br />
        <textarea
          id="text"
          name="text"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          disabled={editPost.isLoading}
        />
        <br />
        <input type="submit" disabled={editPost.isLoading} />
        {editPost.error && (
          <p style={{ color: 'red' }}>{editPost.error.message}</p>
        )}
      </form>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(data, null, 4)}</pre>

      <button onClick={() => deletePost.mutate({ id })}>Delete Post</button>
    </>
  );
};

export default PostViewPage;
