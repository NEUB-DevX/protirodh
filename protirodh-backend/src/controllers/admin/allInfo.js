import { DateSlot } from '../../models/DateSlot.model.js';
import { TimeSlot } from '../../models/TimeSlot.model.js';

export const handleAllInfo = async (req, res) => {
    try {
        const { centerId } = req.body;
        console.log(centerId);

        // fetch both lists
        const dateSlots = await DateSlot.find({ centerId }).sort({ date: 1 }).lean();
        const timeSlots = await TimeSlot.find({ centerId }).lean();

        // group timeSlots by a key. Prefer dateSlotId, fall back to date string if no relation field exists.
        const timeSlotsByKey = {};
        timeSlots.forEach((ts) => {
            // try common relation fields
            const possibleId = ts.dateSlotId ?? ts.dateSlot?._id ?? null;
            let key = null;
            if (possibleId) {
                key = possibleId.toString();
            } else if (ts.date) {
                // normalize date to ISO so it can match dateSlot.date
                key = new Date(ts.date).toISOString();
            }
            if (!key) return;
            if (!timeSlotsByKey[key]) timeSlotsByKey[key] = [];
            timeSlotsByKey[key].push(ts);
        });

        // attach matching timeSlots to each dateSlot
        const merged = (dateSlots || []).map((ds) => {
            const obj = { ...ds };
            const idKey = ds._id ? ds._id.toString() : null;
            const dateKey = ds.date ? new Date(ds.date).toISOString() : null;

            obj.timeSlots = (idKey && timeSlotsByKey[idKey]) || (dateKey && timeSlotsByKey[dateKey]) || [];
            return obj;
        });

        return res.status(200).json({
            success: true,
            data: merged,
        });
    } catch (error) {
        console.error('Error fetching slots:', error);
        return res.status(500).json({
            success: false,
            data: {
                message: 'Error fetching slots',
                error: error.message,
            },
        });
    }
};
