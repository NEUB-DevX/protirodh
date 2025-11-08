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

    // Find vaccine by ID or name (supports both for backward compatibility)
    let vaccineDoc = await Vaccine.findById(vaccine);
    if (!vaccineDoc) {
      // Try finding by name if ID lookup fails
      vaccineDoc = await Vaccine.findOne({ name: vaccine, isActive: true });
    }
    
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

// Get stock request by ID
export const getStockRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const centerId = req.center.id;

    const request = await StockRequest.findOne({ _id: id, centerId })
      .populate('vaccineId', 'name manufacturer');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Stock request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Get stock request by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock request'
    });
  }
};

// Get vaccine by ID
export const getVaccineById = async (req, res) => {
  try {
    const { id } = req.params;
    const vaccine = await Vaccine.findOne({ _id: id, isActive: true });

    if (!vaccine) {
      return res.status(404).json({
        success: false,
        message: 'Vaccine not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vaccine
    });
  } catch (error) {
    console.error('Get vaccine by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vaccine'
    });
  }
};

// Get center dashboard
export const getCenterDashboard = async (req, res) => {
  try {
    const centerId = req.center.id;

    // Get center details
    const center = await Center.findById(centerId);
    
    // Get stock request statistics
    const totalRequests = await StockRequest.countDocuments({ centerId });
    const pendingRequests = await StockRequest.countDocuments({ centerId, status: 'pending' });
    const approvedRequests = await StockRequest.countDocuments({ centerId, status: 'approved' });
    const fulfilledRequests = await StockRequest.countDocuments({ centerId, status: 'fulfilled' });

    // Calculate total received stocks
    const stockAggregation = await StockRequest.aggregate([
      { $match: { centerId: center._id, status: 'fulfilled' } },
      { $group: { _id: null, totalReceived: { $sum: '$approvedQuantity' } } }
    ]);
    const totalReceived = stockAggregation.length > 0 ? stockAggregation[0].totalReceived : 0;

    const dashboard = {
      center: {
        name: center.name,
        division: center.division,
        capacity: center.capacity,
        staff: center.staff,
        status: center.status
      },
      stockRequests: {
        total: totalRequests,
        pending: pendingRequests,
        approved: approvedRequests,
        fulfilled: fulfilledRequests
      },
      inventory: {
        totalReceived,
        // Add more inventory details as needed
      }
    };

    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Get center dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
};