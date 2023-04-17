import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const router = createTRPCRouter({
	getAllMedicine: publicProcedure.query(({ ctx }) => {
		return ctx.prisma.medicine.findMany();
	}),
	fetchAllPersonsWithInventory: publicProcedure
		.input(z.object({ medicine_id: z.number() }))
		.query(({ input, ctx }) => {
			return ctx.prisma.person.findMany({
				where: {
					inventory: {
						every: {
							medicine_id: input.medicine_id,
						},
					},
				},
			});
		}),
	createInventory: publicProcedure
		.input(
			z.object({
				person_id: z.number(),
				medicine_id: z.number(),
				is_available: z.boolean(),
			}),
		)
		.query(async ({ input, ctx }) => {
			const { is_available, medicine_id, person_id } = input;

			await ctx.prisma.person.findFirstOrThrow({
				where: { id: person_id },
			});
			await ctx.prisma.medicine.findFirstOrThrow({
				where: { id: medicine_id },
			});

			const inventoryExists = await ctx.prisma.inventory.findFirst({
				where: {
					medicine_id,
					person_id,
				},
			});
			if (inventoryExists) {
				throw new Error('Inventory already exists.');
			}

			return ctx.prisma.inventory.create({
				data: {
					medicine_id,
					person_id,
					is_available,
				},
			});
		}),
});
