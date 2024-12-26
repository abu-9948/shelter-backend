import { hash } from 'bcrypt';
import { validationResult } from 'express-validator';
import User from '../models/user.js'; // Ensure that this path is correct
import { v4 as uuidv4 } from 'uuid'; // Import the UUID library
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';



// Register User
export const register = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array(),
      message: 'Validation errors occurred',
     });
  }

  try {
    const { name, email, password, phone, role } = req.body;
    const normalizedEmail = email.toLowerCase();

    // Check if the user already exists by the normalized email
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await hash(password, 10);

    // Generate a UUID for the user
    const userId = uuidv4();

    // Create the new user using Sequelize
    const newUser = await User.create({
      user_id: userId,
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      role,
    });

    // Respond with a success message and the newly created user
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });

  } catch (error) {
    // Handle any errors that occur during the registration process
    console.error(error);
    res.status(500).json({
      error: 'An error occurred during registration',
      message: error.message,
    });
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
  
    const normalizedEmail = email.toLowerCase();
    

    // Find the user by email using Sequelize
    const user = await User.findOne({ where: { email: normalizedEmail } });
  
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the hashed password
    console.log("pass is :" ,password);
    console.log("user pass is :" ,user.password);
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
        user_id: user.user_id,
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
        user_id: user.user_id,
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

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

    // Hash the reset token before storing
    const hashedToken = await bcrypt.hash(resetToken, 10);
    user.resetToken = hashedToken;
    user.resetTokenExpiry = resetTokenExpiry;

    await user.save();

    // Create the reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email using Mailgun SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER, // Your Mailgun SMTP username
        pass: process.env.EMAIL_PASSWORD, // Your Mailgun SMTP password
      },
    });

    const mailOptions = {
      from: `Password Reset <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link below to reset your password:\n\n${resetLink}\n\nThis link is valid for 1 hour.`,
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
    // Find user where the reset token expiry is valid
    const user = await User.findOne({
      where: { resetTokenExpiry: { [Op.gt]: Date.now() } },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Compare the provided token with the stored hashed token
    const isTokenValid = await bcrypt.compare(token, user.resetToken);
    if (!isTokenValid) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password and update it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear reset token and expiry
    user.resetToken = null;
    user.resetTokenExpiry = null;

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

