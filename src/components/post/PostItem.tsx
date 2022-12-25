import { Post } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { trpc } from '~/utils/trpc';

type PostItemProps = { post: Post };

export const PostItem = ({ post }: PostItemProps) => {
  const [liked, setLiked] = useState(false);
  const likePost = trpc.useMutation('post.like');

  return (
    <article className="border border-gray-500 rounded-xl p-4 my-4">
      <div className="flex items-center gap-2">
        <img
          src={post.userImage || '/default-avatar.png'}
          alt="User Avatar"
          className="rounded-full border border-teal-400"
          width={32}
          height={32}
        />
        <h1>{post.userName || 'unknown'}</h1>
      </div>
      <h3 className="text-2xl">{post.title}</h3>
      <p className="text-gray-500">{post.subtitle}</p>
      <div className="flex items-center justify-between">
        <Link href={`/post/${post.id}`}>
          <a className="text-teal-500">View more</a>
        </Link>
        <button
          className="flex items-center gap-1"
          onClick={() => setLiked(!liked)}
        >
          {liked ? (
            <IoHeart width={24} height={24} />
          ) : (
            <IoHeartOutline width={24} height={24} />
          )}
          {post.likes}
        </button>
      </div>
    </article>
  );
};
