import { StockRequest } from '../../models/StockRequest.model.js';
import { Vaccine } from '../../models/Vaccine.model.js';
import { Center } from '../../models/Center.model.js';

// ===== STOCK REQUEST MANAGEMENT =====

// Create stock request
export const createStockRequest = async (req, res) => {
  try {
    const { vaccine, quantity, urgency, notes } = req.body;
    const centerId = req.center?.id; // From auth middleware
    const centerName = req.center?.name;

    // Validate required fields
    if (!vaccine || !quantity || !centerId) {
      return res.status(400).json({
        success: false,
        message: 'Vaccine, quantity, and center information are required'
      });
    }

    // Find vaccine by name
    const vaccineDoc = await Vaccine.findOne({ name: vaccine, isActive: true });
    if (!vaccineDoc) {
      return res.status(404).json({
        success: false,
        message: 'Vaccine not found'
      });
    }

    const stockRequest = new StockRequest({
      centerId,
      centerName,
      vaccineId: vaccineDoc._id,
      vaccineName: vaccineDoc.name,
      quantity,
      urgency: urgency || 'medium',
      notes: notes || '',
      requestedBy: centerName
    });

    await stockRequest.save();

    res.status(201).json({
      success: true,
      message: 'Stock request submitted successfully',
      data: stockRequest
    });

  } catch (error) {
    console.error('Create stock request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create stock request'
    });
  }
};

// Get stock requests for a specific center
export const getCenterStockRequests = async (req, res) => {
  try {
    const centerId = req.center?.id;

    const stockRequests = await StockRequest.find({ centerId })
      .populate('vaccineId', 'name manufacturer')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: stockRequests
    });

  } catch (error) {
    console.error('Get center stock requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock requests'
    });
  }
};

// Get available vaccines
export const getAvailableVaccines = async (req, res) => {
  try {
    const vaccines = await Vaccine.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: vaccines
    });

  } catch (error) {
    console.error('Get vaccines error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vaccines'
    });
  }
};

// Get center profile
export const getCenterProfile = async (req, res) => {
  try {
    const centerId = req.center?.id;

    const center = await Center.findById(centerId);
    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: center._id,
        name: center.name,
        address: center.address,
        division: center.division,
        capacity: center.capacity,
        staff: center.staff,
        status: center.status,
        lastLogin: center.lastLogin
      }
    });

  } catch (error) {
    console.error('Get center profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch center profile'
    });
  }
};

// Update center profile (limited fields)
export const updateCenterProfile = async (req, res) => {
  try {
    const centerId = req.center?.id;
    const { capacity, staff } = req.body;

    // Only allow centers to update capacity and staff count
    const updateData = {};
    if (capacity !== undefined) updateData.capacity = capacity;
    if (staff !== undefined) updateData.staff = staff;

    const center = await Center.findByIdAndUpdate(
      centerId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Center profile updated successfully',
      data: {
        id: center._id,
        name: center.name,
        address: center.address,
        division: center.division,
        capacity: center.capacity,
        staff: center.staff,
        status: center.status
      }
    });

  } catch (error) {
    console.error('Update center profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update center profile'
    });
  }
};