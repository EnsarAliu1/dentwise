"use server";

import { prisma } from "../prisma";

export async function getAppointments(){
    try {
        const appointmens = await prisma.appointment.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                },
                doctor:{select:{name:true,imageUrl:true}}
            },
            orderBy:{createdAt:"desc"}
        })

        return appointmens
    } catch (error) {
        console.log("Error fetching appointments:", error);
        throw new Error("failed to fetch appointments");
    }
}