import { createRouter } from '../createRouter';
import { prisma } from '~/server/prisma';
import { TRPCError } from '@trpc/server';

export const userRouter = createRouter()
  .query('posts', {
    async resolve({ ctx }) {
      const posts = await prisma.post.findMany({
        where: {
          userId: ctx.session?.user?.id,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          user: true,
        },
      });
      if (!posts) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User has no posts',
        });
      }
      return posts;
    },
  })
  .query('byComment', {
    async resolve({ ctx }) {
      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session?.user?.id,
        },
      });
      return user;
    },
  });
