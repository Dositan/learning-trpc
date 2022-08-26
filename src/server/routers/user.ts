import { z } from 'zod';
import { createRouter } from '../createRouter';
import { prisma } from '~/server/prisma';
import { TRPCError } from '@trpc/server';

export const userRouter = createRouter().query('posts', {
  input: z.object({ id: z.string() }),
  async resolve({ input }) {
    const { id } = input;
    const posts = await prisma.post.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
    });
    if (!posts) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User has no posts',
      });
    }
    return posts;
  },
});
