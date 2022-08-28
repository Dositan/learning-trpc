import { Post } from '@prisma/client';
import type { Session } from 'next-auth';
import Link from 'next/link';
import { useState } from 'react';
import { ACTION_BUTTON, CARD, INPUT_TEXT, TEXTAREA, LABEL } from '~/styles';
import { trpc } from '~/utils/trpc';

type PostSectionProps = {
  session: Session;
  postsQuery: any;
  profilePage?: boolean;
};

export default function PostSection({
  session,
  postsQuery,
  profilePage = false,
}: PostSectionProps) {
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
      {/* Add Post */}
      <button className={ACTION_BUTTON} onClick={() => setAdding(!adding)}>
        Add Post
      </button>
      <AddPost adding={adding} addPost={addPost} session={session} />
      <h2 className="text-3xl font-bold my-4">
        Posts
        {postsQuery.status === 'loading' && ' (loading)'}
      </h2>
      <hr />
      {postsQuery.data?.map((post: Post) => (
        <article className="p-1 my-4" key={post.id}>
          <div className="flex items-center gap-2">
            <img
              src={post.userImage || '/default-avatar.png'}
              alt="User Avatar"
              className="rounded-full border border-teal-400"
              width={32}
              height={32}
            />
            <h1>{post.userName || 'belgısız'}</h1>
          </div>
          <h3 className="text-2xl">{post.title}</h3>
          <p className="text-gray-500">{post.subtitle}</p>
          <Link href={`/post/${post.id}`}>
            <a className="text-teal-500">View more</a>
          </Link>
        </article>
      ))}
    </>
  );
}

export const AddPost = ({
  adding,
  addPost,
  session,
}: {
  adding: boolean;
  addPost: any;
  session: Session;
}) => {
  return (
    <div className={`flex items-center justify-center my-4 ${CARD}`}>
      <form
        hidden={!adding}
        className="w-[90%] mx-auto"
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
          const input = {
            title: $title.value,
            text: $text.value,
            subtitle: $subtitle.value,
            userName: session.user?.name,
            userImage: session.user?.image,
            userId: session.user?.id,
          };
          try {
            await addPost.mutateAsync(input);

            $title.value = '';
            $subtitle.value = '';
            $text.value = '';
          } catch {}
        }}
      >
        <h2 className="text-center text-3xl font-bold mb-2">Add Post</h2>
        {/* Title */}
        <div>
          <label className={LABEL} htmlFor="title">
            Title:
          </label>
          <br />
          <input
            id="title"
            name="title"
            type="text"
            className={INPUT_TEXT}
            disabled={addPost.isLoading}
          />
        </div>
        {/* Subtitle */}
        <div className="my-4">
          <label className={LABEL} htmlFor="subtitle">
            Subtitle:
          </label>
          <br />
          <input
            id="subtitle"
            name="subtitle"
            type="text"
            className={INPUT_TEXT}
            disabled={addPost.isLoading}
          />
        </div>
        {/* Text */}
        <div className="my-4">
          <label className={LABEL} htmlFor="text">
            Text:
          </label>
          <br />
          <textarea
            id="text"
            name="text"
            className={TEXTAREA}
            disabled={addPost.isLoading}
          />
        </div>
        <button
          className={ACTION_BUTTON}
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
  );
};
