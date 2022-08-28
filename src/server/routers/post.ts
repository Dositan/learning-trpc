import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  title: true,
  subtitle: true,
  text: true,
  userName: true,
  userImage: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export const postRouter = createRouter()
  .mutation('add', {
    input: z.object({
      id: z.string().uuid().optional(),
      title: z.string().min(1).max(32),
      subtitle: z.string().min(1).max(255),
      text: z.string().min(1),
      userName: z.string().optional(),
      userImage: z.string().optional(),
      userId: z.string().cuid().optional(),
    }),
    async resolve({ input }) {
      const post = await prisma.post.create({
        data: input,
        select: defaultPostSelect,
      });
      return post;
    },
  })
  .query('all', {
    async resolve() {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return prisma.post.findMany({
        select: defaultPostSelect,
        orderBy: {
          createdAt: 'desc',
        },
      });
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const post = await prisma.post.findUnique({
        where: { id },
        select: defaultPostSelect,
      });
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`,
        });
      }
      return post;
    },
  })
  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        title: z.string().min(1).max(32),
        subtitle: z.string().min(1).max(255),
        text: z.string().min(1),
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      const post = await prisma.post.update({
        where: { id },
        data,
        select: defaultPostSelect,
      });
      return post;
    },
  })
  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.post.delete({ where: { id } });
      return { id };
    },
  });
