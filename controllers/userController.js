import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/user.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';


// Register User
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, phone, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await hash(password, 10);

    // Create the new user using Sequelize
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Find the user by email using Sequelize
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the hashed password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,   // Prevent access via JavaScript (mitigates XSS attacks)
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'Strict', // Prevent CSRF attacks
      maxAge: 3600000, // 1 hour in milliseconds (match token expiration)
    });

    return res.status(200).json({ message: 'Login successful' });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Logout User
export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'Strict' 
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// Get User Profile
export const getUserProfile = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findOne({ where: { user_id: userId } });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({
        id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
//Update User Profile

export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, phone } = req.body;

  try {
    // Find the user by user_id
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user profile
    user.name = name || user.name;
    user.phone = phone || user.phone;

    // Save the updated user
    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user.user_id,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

//delete User Profile

export const deleteUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by user_id
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await user.destroy();

    return res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Generate and send password reset link
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token (using crypto)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry time

    // Store reset token and expiry in the database (you may want to hash the token before saving it for security)
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        
        user: process.env.EMAIL_USER, // your email here
        pass: process.env.EMAIL_PASS, // your email password here
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link below to reset your password: \n\n${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password with the token
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { resetToken: token } });
    if (!user || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password and update it
    const hashedPassword = await hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null; // Clear the reset token
    user.resetTokenExpiry = null; // Clear the expiry

    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change password (Logged-in User)
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { userId } = req.user; // Assuming the user ID is stored in the JWT payload

  try {
    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the old password with the stored one
    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Hash the new password and update it
    const hashedPassword = await hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

