import { DateSlot } from '../../models/DateSlot.model.js';

/**
 * Get all available date slots for a specific center
 * This is a public endpoint for users to view available dates
 */
export const handleGetDateSlots = async (req, res) => {
  try {
    const { centerId } = req.body;

    if (!centerId) {
      return res.status(400).json({
        success: false,
        message: 'Center ID is required'
      });
    }

    // Get all active date slots for the center that are not fully booked
    // and are in the future or today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateSlots = await DateSlot.find({
      centerId,
      status: 'active',
      date: { $gte: today },
      $expr: { $lt: ['$booked', '$capacity'] } // Not fully booked
    })
      .sort({ date: 1 }) // Sort by date ascending
      .select('_id date capacity booked status');

    res.status(200).json({
      success: true,
      message: 'Date slots fetched successfully',
      data: {
        dateSlots,
        count: dateSlots.length
      }
    });
  } catch (error) {
    console.error('Get date slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch date slots',
      error: error.message
    });
  }
};
