import type { Comment as CommentType } from '@prisma/client';
import type { Session } from 'next-auth';
import { CARD, DELETE_BUTTON } from '~/styles';

type CommentProps = {
  data: CommentType;
  session: Session | null;
  deleteComment: any;
};

export const CommentItem = ({ data, session, deleteComment }: CommentProps) => {
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
          <h1 className="font-medium">{data.userName || 'unknown'}</h1>
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
