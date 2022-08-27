import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { prisma } from '~/server/prisma';

const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  content: true,
  postId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  isEdited: true,
});

export const commentRouter = createRouter()
  .mutation('add', {
    input: z.object({
      id: z.string().uuid().optional(),
      content: z.string().min(1),
      postId: z.string().uuid().optional(),
      userId: z.string().cuid().optional(),
    }),
    async resolve({ input }) {
      const comment = await prisma.comment.create({
        data: input,
        select: defaultCommentSelect,
      });
      return comment;
    },
  })
  .query('all', {
    input: z.object({
      postId: z.string().uuid(),
    }),
    async resolve({ input }) {
      const { postId } = input;
      return prisma.comment.findMany({
        select: defaultCommentSelect,
        where: { postId },
        orderBy: {
          createdAt: 'desc',
        },
      });
    },
  })
  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        content: z.string().min(1),
        isEdited: z.boolean().default(true),
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      const comment = await prisma.comment.update({
        where: { id },
        data,
        select: defaultCommentSelect,
      });
      return comment;
    },
  })
  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.comment.delete({ where: { id } });
      return { id };
    },
  });
