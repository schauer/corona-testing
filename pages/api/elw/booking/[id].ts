import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import { isModerator } from '../../../../lib/authorization';
import { sendCancelationEmail } from '../../../../lib/email/cancel';
import prisma from '../../../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'DELETE') {
        res.status(405).json({ result: 'error' });
        return;
    }

    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ result: 'error' });
        return;
    }

    if (!isModerator(session)) {
        res.status(401).json({ result: 'error' });
        return;
    }

    const id = parseInt(req.query.id.toString(), 10);

    if (isNaN(id)) {
        res.status(400).json({ result: 'error', message: 'Invalid id' });
        return;
    }

    const booking = await prisma.booking.delete({
        where: {
            id,
        }
    });

    await sendCancelationEmail(booking);

    console.log(`${session.user?.email} canceled booking ${booking.id}`);

    res.status(200).json(booking);
}