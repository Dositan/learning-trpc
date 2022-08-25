import { z } from 'zod';
import { createRouter } from '../createRouter';
import { prisma } from '~/server/prisma';
import { TRPCError } from '@trpc/server';

export const userRouter = createRouter().query('posts', {
  input: z.object({ id: z.string() }),
  async resolve({ input }) {
    const { id } = input;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { posts: true },
    });
    if (!user?.posts) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User has no posts',
      });
    }
    return user.posts;
  },
});
