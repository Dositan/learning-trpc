import { Post } from '@prisma/client';
import { useEffect, useState } from 'react';
import { CARD, INPUT_TEXT, LABEL } from '~/styles';
import { trpc } from '~/utils/trpc';

type EditPostProps = {
  id: string;
  editing: boolean;
  post: Post;
};

const EditPost = ({ id, editing, post }: EditPostProps) => {
  const [title, setTitle] = useState<string | undefined>('');
  const [subtitle, setSubtitle] = useState<string | undefined>('');
  const [text, setText] = useState<string | undefined>('');

  const utils = trpc.useContext();
  const editPost = trpc.useMutation('post.edit', {
    async onSuccess() {
      await utils.invalidateQueries(['post.byId', { id }]);
    },
  });

  useEffect(() => {
    setTitle(post?.title);
    setSubtitle(post?.subtitle);
    setText(post?.text);
  }, [post]);

  return (
    <div className={`my-10 flex items-center justify-center ${CARD}`}>
      <form
        hidden={!editing}
        className="w-[90%]"
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
          <label className={LABEL} htmlFor="title">
            Title:
          </label>
          <br />
          <input
            id="title"
            name="title"
            type="text"
            className={INPUT_TEXT}
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            disabled={editPost.isLoading}
          />
        </div>

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
            value={subtitle}
            onChange={(e) => setSubtitle(e.currentTarget.value)}
            disabled={editPost.isLoading}
          />
        </div>

        <div className="my-4">
          <label className={LABEL} htmlFor="text">
            Text:
          </label>
          <br />
          <textarea
            id="text"
            name="text"
            className={INPUT_TEXT}
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
          <p className="text-red-500">{editPost.error.message}</p>
        )}
      </form>
    </div>
  );
};

export default EditPost;
