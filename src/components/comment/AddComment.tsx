import type { Session } from 'next-auth';
import { ACTION_BUTTON, CARD, LABEL, TEXTAREA } from '~/styles';

type AddCommentProps = {
  postId: string;
  addingComment: boolean;
  session: Session | null;
  addComment: any;
};

export const AddComment = ({
  postId,
  addingComment,
  session,
  addComment,
}: AddCommentProps) => {
  if (!session) return null;
  return (
    <div className={`rounded-xl my-4 ${CARD}`}>
      <form
        hidden={!addingComment}
        onSubmit={async (e) => {
          e.preventDefault();

          const $content: HTMLInputElement = (e as any).target.elements.content;

          const input = {
            content: $content.value,
            postId,
            userId: session.user?.id,
            userName: session.user?.name,
            userImage: session.user?.image,
          };

          try {
            await addComment.mutateAsync(input);

            $content.value = '';
          } catch {}
        }}
      >
        {/* Title */}
        <h2 className="text-center text-3xl font-bold mb-2">Add Comment</h2>
        {/* Text */}
        <div className="my-4">
          <label className={LABEL} htmlFor="content">
            Content:
          </label>
          <br />
          <textarea
            id="content"
            name="content"
            className={TEXTAREA}
            disabled={addComment.isLoading}
          />
        </div>
        <button
          className={ACTION_BUTTON}
          type="submit"
          disabled={addComment.isLoading}
        >
          Submit
        </button>
      </form>
    </div>
  );
};
