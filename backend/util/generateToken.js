import jwt from 'jsonwebtoken';
import User from '../schemas/User.js';

export const generateTokens = async (user) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
  User.refreshTokens.push(refreshToken);
  await User.save();

  return { accessToken, refreshToken };
};