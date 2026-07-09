import jwt from "jsonwebtoken";
import User from "../schemas/User.js";
export const protect = async (req, res, next) => {
  try {
    let token =  req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password -__v -createdAt -updatedAt");
    if (!req.user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (req.user.isActive === false) {
      return res.status(403).json({ success: false, message: "Account is suspended" });
    }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role.toLowerCase() === "admin") {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: "Forbidden: Administrative privileges required" 
    });
  }
};
