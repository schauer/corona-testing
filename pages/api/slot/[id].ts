import type { NextApiRequest, NextApiResponse } from 'next'
import nc from "next-connect";
import { getSession } from 'next-auth/client';
import { isModerator } from '../../../lib/authorization';
import prisma from '../../../lib/prisma';
import moderatorRequired from '../../../lib/middleware/moderatorRequired';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(moderatorRequired);

handler.post(async (req, res) => {
    const session = await getSession({ req });

    const id = parseInt(req.query.id.toString(), 10);

    if (isNaN(id) || id.toString() !== req.query.id.toString()) {
        res.status(400).json({ result: 'error', message: 'Invalid id' });
        return;
    }

    const seats = req.body?.seats ? parseInt(req.body?.seats, 10) : undefined;

    if (!seats || seats < 1 || seats > 100) {
        res.status(400).json({ result: 'error', message: 'Seats out of range' });
        return;
    }

    const slot = await prisma.slot.update({
        where: {
            id,
        },
        data: {
            seats
        }
    });

    console.log(`${session.user?.email} updated slot ${id}`);

    res.status(200).json(slot);
});

handler.delete(async (req, res) => {
    const session = await getSession({ req });

    const id = parseInt(req.query.id.toString(), 10);

    if (isNaN(id) || id.toString() !== req.query.id.toString()) {
        res.status(400).json({ result: 'error', message: 'Invalid id' });
        return;
    }

    const slot = await prisma.slot.findUnique({
        where: {
            id,
        }
    });

    if (!slot) {
        res.status(404).json({ result: 'not_found' });
        return;
    }

    const numberOfBookings = await prisma.booking.count({
        where: {
            date: slot.date,
        }
    });

    if (numberOfBookings > 0) {
        res.status(409).json({ result: 'already_booked', message: `There are already ${numberOfBookings} bookings for that slot` });
        return;
    }

    console.log(`${session.user?.email} deleted slot ${id}`);

    res.status(200).json(await prisma.slot.delete({
        where: {
            id,
        },
    }));
})

export default handler;