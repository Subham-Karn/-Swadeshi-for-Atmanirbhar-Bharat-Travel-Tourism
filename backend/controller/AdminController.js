import Booking from "../schemas/Booking.js";
import Trip from "../schemas/Trip.js";
import User from "../schemas/User.js";
import bcrypt from "bcryptjs";

const publicUserFields = "-password -refreshTokens -otp -otpExpires -__v";

export const getAdminDashboard = async (req, res) => {
  try {
    const [totalUsers, totalAdmins, totalTrips, totalBookings, pendingBookings, confirmedBookings, revenueResult, recentBookings] =
      await Promise.all([
        User.countDocuments({ isVerified: true }),
        User.countDocuments({ role: "admin", isVerified: true }),
        Trip.countDocuments(),
        Booking.countDocuments(),
        Booking.countDocuments({ bookingStatus: "pending" }),
        Booking.countDocuments({ bookingStatus: "confirmed" }),
        Booking.aggregate([
          { $match: { "paymentDetails.paymentStatus": "completed" } },
          { $group: { _id: null, total: { $sum: "$paymentDetails.paidAmount" } } },
        ]),
        Booking.find()
          .populate("userId", "name email")
          .populate({
            path: "tripId",
            select: "title placeId startDate",
            populate: { path: "placeId", select: "name cityName coverImage category" },
          })
          .sort({ createdAt: -1 })
          .limit(6)
          .lean(),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalUsers,
          totalAdmins,
          totalTrips,
          totalBookings,
          pendingBookings,
          confirmedBookings,
          grossRevenue: revenueResult[0]?.total || 0,
        },
        recentBookings,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const { search = "", role = "all" } = req.query;
    const query = {};

    if (role !== "all") query.role = role;
    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ name: regex }, { username: regex }, { email: regex }, { phone: regex }];
    }

    const users = await User.find(query).select(publicUserFields).sort({ createdAt: -1 }).lean();

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createAdminUser = async (req, res) => {
  try {
    const { name, username, gender, age, email, phone, address, password, role = "user", isActive = true } = req.body;

    if (!name || !username || !gender || !age || !email || !phone || !address || !password) {
      return res.status(422).json({ success: false, message: "All user fields are required." });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Role must be user or admin." });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { username: username.trim() },
        { phone: phone.trim() },
      ],
    });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "A user with this email, username, or phone already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      username: username.trim(),
      gender,
      age: Number(age),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      address: address.trim(),
      password: hashedPassword,
      role,
      isActive: Boolean(isActive),
      isVerified: true,
    });

    const safeUser = await User.findById(user._id).select(publicUserFields).lean();

    return res.status(201).json({ success: true, message: "User created successfully.", data: safeUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = {};

    if (typeof req.body.isActive === "boolean") allowed.isActive = req.body.isActive;
    if (["user", "admin"].includes(req.body.role)) allowed.role = req.body.role;

    if (Object.keys(allowed).length === 0) {
      return res.status(400).json({ success: false, message: "No valid user fields supplied." });
    }

    if (String(req.user._id) === String(id) && allowed.isActive === false) {
      return res.status(400).json({ success: false, message: "You cannot suspend your own admin account." });
    }

    const user = await User.findByIdAndUpdate(id, { $set: allowed }, { new: true, runValidators: true })
      .select(publicUserFields)
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, message: "User updated successfully.", data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
