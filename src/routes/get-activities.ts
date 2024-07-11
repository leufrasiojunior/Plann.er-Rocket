import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import {dayjs} from '../lib/dayjs';

export async function getActivities(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripid/activities',{
        schema:{
            params:z.object({
                tripid: z.string().uuid()
            })
        }
    } ,async (request)=> {
        const {tripid } = request.params;

        const trip = await prisma.trip.findUnique({
            where:{id: tripid},
            include: {
                activities: true,
            }
        })

        if (!trip) {
            throw new Error('Trip not found')
        }


        return { activities: trip.activities}
    })
}