import type { Comment as CommentType } from '@prisma/client';
import type { Session } from 'next-auth';
import { useState } from 'react';
import { ACTION_BUTTON, CARD, DELETE_BUTTON, LABEL, TEXTAREA } from '~/styles';
import { trpc } from '~/utils/trpc';

type CommentProps = {
  data: CommentType;
  session: Session | null;
  deleteComment: any;
};

type AddCommentProps = {
  postId: string;
  addingComment: boolean;
  session: Session | null;
  addComment: any;
};

type CommentsSectionProps = { session: Session | null; postId: string };

export default function CommentSection({
  session,
  postId,
}: CommentsSectionProps) {
  const [addingComment, setAddingComment] = useState(false);
  const utils = trpc.useContext();

  const commentsQuery = trpc.useQuery([
    'comment.all',
    { postId: postId || '' },
  ]);
  const addComment = trpc.useMutation('comment.add', {
    async onSuccess() {
      await utils.invalidateQueries(['comment.all', { postId: postId || '' }]);
    },
  });
  const deleteComment = trpc.useMutation('comment.delete', {
    async onSuccess() {
      await utils.invalidateQueries(['comment.all', { postId: postId || '' }]);
    },
  });
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-center text-3xl font-bold mb-2">Comments</h2>
        <button
          onClick={() => setAddingComment(!addingComment)}
          className={ACTION_BUTTON}
        >
          Add
        </button>
      </div>
      {/* Add Comment form */}
      <AddComment
        postId={postId}
        addingComment={addingComment}
        session={session}
        addComment={addComment}
      />
      {/* Displaying Comments */}
      {commentsQuery.data?.map((comment) => (
        <Comment
          key={comment.id}
          data={comment}
          session={session}
          deleteComment={deleteComment}
        />
      ))}
    </div>
  );
}

export const AddComment = ({
  postId,
  addingComment,
  session,
  addComment,
}: AddCommentProps) => {
  if (!session) return null;
  return (
    <div className={`rounded-xl my-4 ${CARD}}`}>
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
        <h2 className="text-center text-3xl font-bold mb-2">Add Post</h2>
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

export const Comment = ({ data, session, deleteComment }: CommentProps) => {
  return (
    <div className={`${CARD} my-4`}>
      {/* The user is author */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            width={32}
            height={32}
            src={data.userImage || '/default-avatar.png'}
            className="rounded-full border border-teal-400"
          />
          <h1 className="font-medium">{data.userName || 'belgısız'}</h1>
          {data.isEdited && <span>(edited)</span>}
        </div>
        {session?.user?.id === data.userId && (
          <button
            className={`${DELETE_BUTTON} text-xs`}
            onClick={() => deleteComment.mutate({ id: data.id })}
          >
            Delete
          </button>
        )}
      </div>
      <p className="text-gray-500 mb-2">{`${data.updatedAt.toLocaleDateString()}, ${data.updatedAt.toLocaleTimeString()}`}</p>
      <p className="text-xl">{data.content}</p>
    </div>
  );
};
