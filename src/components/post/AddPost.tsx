import { Session } from 'next-auth';
import { ACTION_BUTTON, CARD, INPUT_TEXT, LABEL, TEXTAREA } from '~/styles';

type AddPostProps = {
  adding: boolean;
  addPost: any;
  session: Session;
};

export const AddPost = ({ adding, addPost, session }: AddPostProps) => {
  return (
    <div className={`flex items-center justify-center my-4 ${CARD}`}>
      <form
        hidden={!adding}
        className="w-[90%] mx-auto"
        onSubmit={async (e) => {
          e.preventDefault();

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
          <p className="text-red-500">{addPost.error.message}</p>
        )}
      </form>
    </div>
  );
};
