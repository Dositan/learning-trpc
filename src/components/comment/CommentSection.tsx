import type { Session } from 'next-auth';
import { useState } from 'react';
import { ACTION_BUTTON } from '~/styles';
import { trpc } from '~/utils/trpc';
import { AddComment } from './AddComment';
import { CommentItem } from './CommentItem';

type CommentsSectionProps = { session: Session | null; postId: string };

export const CommentSection = ({ session, postId }: CommentsSectionProps) => {
  const utils = trpc.useContext();
  const [addingComment, setAddingComment] = useState(false);
  // comments CRUD
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
    <div className="my-4">
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
        <CommentItem
          key={comment.id}
          data={comment}
          session={session}
          deleteComment={deleteComment}
        />
      ))}
    </div>
  );
};
