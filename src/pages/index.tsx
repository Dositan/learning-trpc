import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';
import { Page } from '~/components/Page';

const IndexPage: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const postsQuery = trpc.useQuery(['post.all']);
  const addPost = trpc.useMutation('post.add', {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(['post.all']);
    },
  });

  const [adding, setAdding] = useState(false);

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   for (const { id } of postsQuery.data ?? []) {
  //     utils.prefetchQuery(['post.byId', { id }]);
  //   }
  // }, [postsQuery.data, utils]);

  if (!session) {
    return (
      <>
        <h1>Not Authorized</h1>
        <button onClick={() => signIn()}>Sign In</button>
      </>
    );
  }
  return (
    <Page title="Home">
      {/* Header */}
      <div className="text-center my-4">
        <h1 className="text-3xl font-bold">Welcome, {session.user?.name}!</h1>
        <p>
          template by{' '}
          <a className="text-teal-400" href="https://twitter.com/alexdotjs">
            @alexdotjs
          </a>
          , improved by{' '}
          <a className="text-teal-400" href="https://twitter.com/dastanozgeldi">
            @dastanozgeldi
          </a>
        </p>
      </div>

      {/* Add Post */}
      <button
        className="rounded-md px-4 py-2 text-white bg-teal-400 hover:bg-teal-500 hover:duration-500"
        onClick={() => setAdding(!adding)}
      >
        Add Post
      </button>
      <div className="flex items-center justify-center bg-gray-100 rounded-xl p-10 my-4">
        <form
          hidden={!adding}
          onSubmit={async (e) => {
            e.preventDefault();
            /**
             * In a real app you probably don't want to use this manually
             * Checkout React Hook Form - it works great with tRPC
             * @link https://react-hook-form.com/
             */

            const $text: HTMLInputElement = (e as any).target.elements.text;
            const $title: HTMLInputElement = (e as any).target.elements.title;
            const input = {
              title: $title.value,
              text: $text.value,
            };
            try {
              await addPost.mutateAsync(input);

              $title.value = '';
              $text.value = '';
            } catch {}
          }}
        >
          <h2 className="text-center text-3xl font-bold mb-2">Add Post</h2>
          {/* Title */}
          <div>
            <label htmlFor="title">Title:</label>
            <br />
            <input
              id="title"
              name="title"
              type="text"
              disabled={addPost.isLoading}
            />
          </div>
          {/* Text */}
          <div className="my-4">
            <label htmlFor="text">Text:</label>
            <br />
            <textarea id="text" name="text" disabled={addPost.isLoading} />
          </div>
          <button
            className="rounded-md px-4 py-2 text-white bg-teal-400 hover:bg-teal-500 hover:duration-500"
            type="submit"
            disabled={addPost.isLoading}
          >
            Submit
          </button>
          {addPost.error && (
            <p style={{ color: 'red' }}>{addPost.error.message}</p>
          )}
        </form>
      </div>
      <h2 className="text-3xl font-bold my-4">
        Posts
        {postsQuery.status === 'loading' && '(loading)'}
      </h2>
      <hr />
      {postsQuery.data?.map((item) => (
        <article className="my-4" key={item.id}>
          <h3 className="text-2xl font-semibold">{item.title}</h3>
          <Link href={`/post/${item.id}`}>
            <a className="text-teal-500">View more</a>
          </Link>
        </article>
      ))}
    </Page>
  );
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('post.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
