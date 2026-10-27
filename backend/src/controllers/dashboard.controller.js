const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    // Run all aggregations in parallel for better performance
    const [
      totalDoctors,
      totalPatients,
      patientsPerDoctor,
      doctorsBySpecialization,
      patientsByCondition,
      monthlyGrowth,
      recentDoctors,
      recentPatients
    ] = await Promise.all([
      // Total counts
      Doctor.countDocuments(),
      Patient.countDocuments(),
      
      // Patients per doctor (top 10)
      Patient.aggregate([
        {
          $group: {
            _id: '$doctor',
            count: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'doctors',
            localField: '_id',
            foreignField: '_id',
            as: 'doctor'
          }
        },
        {
          $unwind: '$doctor'
        },
        {
          $project: {
            _id: 0,
            name: '$doctor.name',
            count: 1
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]),
      
      // Doctors by specialization
      Doctor.aggregate([
        {
          $group: {
            _id: '$specialization',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            count: 1
          }
        },
        {
          $sort: { count: -1 }
        }
      ]),
      
      // Patients by condition
      Patient.aggregate([
        {
          $group: {
            _id: '$condition',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            count: 1
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]),
      
      // Monthly growth (last 12 months)
      (async () => {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
        twelveMonthsAgo.setDate(1);
        twelveMonthsAgo.setHours(0, 0, 0, 0);

        const [doctorGrowth, patientGrowth] = await Promise.all([
          Doctor.aggregate([
            {
              $match: {
                createdAt: { $gte: twelveMonthsAgo }
              }
            },
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
              }
            },
            {
              $sort: { '_id.year': 1, '_id.month': 1 }
            }
          ]),
          Patient.aggregate([
            {
              $match: {
                createdAt: { $gte: twelveMonthsAgo }
              }
            },
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
              }
            },
            {
              $sort: { '_id.year': 1, '_id.month': 1 }
            }
          ])
        ]);

        // Merge and format monthly data
        const months = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          
          const doctorData = doctorGrowth.find(
            d => d._id.year === year && d._id.month === month
          );
          const patientData = patientGrowth.find(
            p => p._id.year === year && p._id.month === month
          );

          months.push({
            month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
            doctors: doctorData?.count || 0,
            patients: patientData?.count || 0
          });
        }

        return months;
      })(),
      
      // Recent doctors (last 5)
      Doctor.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name specialization hospital createdAt'),
      
      // Recent patients (last 5)
      Patient.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name condition createdAt')
        .populate('doctor', 'name')
    ]);

    // Calculate new this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [newDoctorsThisMonth, newPatientsThisMonth] = await Promise.all([
      Doctor.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Patient.countDocuments({ createdAt: { $gte: startOfMonth } })
    ]);

    // Calculate average patients per doctor
    const avgPatientsPerDoctor = totalDoctors > 0 
      ? Math.round((totalPatients / totalDoctors) * 10) / 10 
      : 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalDoctors,
          totalPatients,
          newDoctorsThisMonth,
          newPatientsThisMonth,
          avgPatientsPerDoctor
        },
        patientsPerDoctor,
        doctorsBySpecialization,
        patientsByCondition,
        monthlyGrowth,
        recentDoctors,
        recentPatients
      }
    });
  } catch (error) {
    next(error);
  }
};
