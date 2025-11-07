import { Center } from '../../models/Center.model.js';
import { Vaccine } from '../../models/Vaccine.model.js';
import { StockRequest } from '../../models/StockRequest.model.js';
import { VaccineMovement } from '../../models/VaccineMovement.model.js';

// Generate secure password
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// ===== CENTER MANAGEMENT =====

// Get all centers
export const getAllCenters = async (req, res) => {
  try {
    const centers = await Center.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: centers
    });
  } catch (error) {
    console.error('Get centers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch centers'
    });
  }
};

// Create new center
export const createCenter = async (req, res) => {
  try {
    const { name, address, division, capacity, staff, status } = req.body;

    // Validate required fields
    if (!name || !address || !division || !capacity || !staff) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Generate password if not provided
    const password = req.body.password || generatePassword();

    const center = new Center({
      name,
      address,
      division,
      capacity,
      staff,
      status: status || 'active',
      password
    });

    await center.save();

    res.status(201).json({
      success: true,
      message: 'Center created successfully',
      data: center
    });

  } catch (error) {
    console.error('Create center error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Center with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create center'
    });
  }
};

// Update center
export const updateCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const center = await Center.findByIdAndUpdate(
      id,
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
      message: 'Center updated successfully',
      data: center
    });

  } catch (error) {
    console.error('Update center error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update center'
    });
  }
};

// Delete center
export const deleteCenter = async (req, res) => {
  try {
    const { id } = req.params;

    const center = await Center.findByIdAndDelete(id);

    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Center deleted successfully'
    });

  } catch (error) {
    console.error('Delete center error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete center'
    });
  }
};

// ===== VACCINE MANAGEMENT =====

// Get all vaccines
export const getAllVaccines = async (req, res) => {
  try {
    const vaccines = await Vaccine.find({ isActive: true }).sort({ createdAt: -1 });
    
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

// Create new vaccine
export const createVaccine = async (req, res) => {
  try {
    const { name, manufacturer, doses, temperature, efficacy } = req.body;

    // Validate required fields
    if (!name || !manufacturer || !doses || !temperature || !efficacy) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const vaccine = new Vaccine({
      name,
      manufacturer,
      doses,
      temperature,
      efficacy
    });

    await vaccine.save();

    res.status(201).json({
      success: true,
      message: 'Vaccine created successfully',
      data: vaccine
    });

  } catch (error) {
    console.error('Create vaccine error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Vaccine with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create vaccine'
    });
  }
};

// Update vaccine
export const updateVaccine = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const vaccine = await Vaccine.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!vaccine) {
      return res.status(404).json({
        success: false,
        message: 'Vaccine not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vaccine updated successfully',
      data: vaccine
    });

  } catch (error) {
    console.error('Update vaccine error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vaccine'
    });
  }
};

// Delete vaccine
export const deleteVaccine = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete by setting isActive to false
    const vaccine = await Vaccine.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!vaccine) {
      return res.status(404).json({
        success: false,
        message: 'Vaccine not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vaccine deleted successfully'
    });

  } catch (error) {
    console.error('Delete vaccine error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete vaccine'
    });
  }
};

// ===== STOCK REQUEST MANAGEMENT =====

// Get all stock requests
export const getAllStockRequests = async (req, res) => {
  try {
    const stockRequests = await StockRequest.find()
      .populate('centerId', 'name')
      .populate('vaccineId', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: stockRequests
    });
  } catch (error) {
    console.error('Get stock requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock requests'
    });
  }
};

// Approve stock request
export const approveStockRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    const stockRequest = await StockRequest.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        approvedBy: approvedBy || 'Admin',
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!stockRequest) {
      return res.status(404).json({
        success: false,
        message: 'Stock request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock request approved successfully',
      data: stockRequest
    });

  } catch (error) {
    console.error('Approve stock request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve stock request'
    });
  }
};

// Reject stock request
export const rejectStockRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason, rejectedBy } = req.body;

    const stockRequest = await StockRequest.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        rejectionReason: rejectionReason || 'No reason provided',
        approvedBy: rejectedBy || 'Admin',
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!stockRequest) {
      return res.status(404).json({
        success: false,
        message: 'Stock request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock request rejected successfully',
      data: stockRequest
    });

  } catch (error) {
    console.error('Reject stock request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject stock request'
    });
  }
};

// ===== VACCINE MOVEMENT TRACKING =====

// Get all vaccine movements
export const getAllVaccineMovements = async (req, res) => {
  try {
    const movements = await VaccineMovement.find()
      .populate('centerId', 'name')
      .populate('vaccineId', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: movements
    });
  } catch (error) {
    console.error('Get vaccine movements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vaccine movements'
    });
  }
};

// Get vaccine by ID
export const getVaccineById = async (req, res) => {
  try {
    const { id } = req.params;
    const vaccine = await Vaccine.findById(id);

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

// Get center by ID
export const getCenterById = async (req, res) => {
  try {
    const { id } = req.params;
    const center = await Center.findById(id);

    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found'
      });
    }

    res.status(200).json({
      success: true,
      data: center
    });
  } catch (error) {
    console.error('Get center by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch center'
    });
  }
};

// Get stock request by ID
export const getStockRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await StockRequest.findById(id)
      .populate('centerId', 'name address division')
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

// Get dashboard analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    // Get counts
    const totalCenters = await Center.countDocuments();
    const activeCenters = await Center.countDocuments({ status: 'active' });
    const totalVaccines = await Vaccine.countDocuments({ isActive: true });
    const pendingRequests = await StockRequest.countDocuments({ status: 'pending' });
    
    // Calculate total stocks (sum of all vaccine quantities in centers)
    const stockAggregation = await StockRequest.aggregate([
      { $match: { status: 'fulfilled' } },
      { $group: { _id: null, totalStocks: { $sum: '$approvedQuantity' } } }
    ]);
    const totalStocks = stockAggregation.length > 0 ? stockAggregation[0].totalStocks : 0;

    // Mock data for now (can be calculated from actual vaccination records later)
    const analytics = {
      totalVaccinated: 125000, // This should come from actual vaccination records
      totalStocks: totalStocks || 50000,
      wastage: 2.3, // Calculate from actual wastage records
      coverage: 68.5, // Calculate from population data
      totalCenters,
      activeCenters,
      totalVaccines,
      pendingRequests
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
};