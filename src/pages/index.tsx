import { NextPageWithLayout } from './_app';
import { useSession } from 'next-auth/react';
import { Page } from '~/components/layout/Page';
import SignIn from '~/components/common/SignIn';
import { PostSection } from '~/components/post/PostSection';
import { trpc } from '~/utils/trpc';

const IndexPage: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const postsQuery = trpc.useQuery(['post.all']);

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   for (const { id } of postsQuery.data ?? []) {
  //     utils.prefetchQuery(['post.byId', { id }]);
  //   }
  // }, [postsQuery.data, utils]);

  if (!session) return <SignIn />;
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
      {/* Post Section */}
      <PostSection postsQuery={postsQuery} session={session} />
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
