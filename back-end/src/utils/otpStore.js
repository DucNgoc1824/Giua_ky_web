// Simple in-memory OTP store
// In production, use Redis or database
const otpStore = new Map();

// OTP expiry time: 5 minutes
const OTP_EXPIRY = 5 * 60 * 1000;

const otpManager = {
  // Generate 6-digit OTP
  generateOTP: () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Store OTP with expiry
  storeOTP: (username, otp) => {
    const expiryTime = Date.now() + OTP_EXPIRY;
    otpStore.set(username, {
      otp,
      expiryTime,
      attempts: 0
    });
    console.log(`🔑 OTP stored for ${username}: ${otp} (expires in 5 min)`);
  },

  // Verify OTP
  verifyOTP: (username, otp) => {
    const stored = otpStore.get(username);
    
    if (!stored) {
      return { success: false, message: 'OTP không tồn tại hoặc đã hết hạn.' };
    }

    if (Date.now() > stored.expiryTime) {
      otpStore.delete(username);
      return { success: false, message: 'OTP đã hết hạn.' };
    }

    if (stored.attempts >= 3) {
      otpStore.delete(username);
      return { success: false, message: 'Bạn đã nhập sai quá 3 lần. Vui lòng thử lại.' };
    }

    if (stored.otp !== otp) {
      stored.attempts++;
      return { success: false, message: `OTP không đúng. Còn ${3 - stored.attempts} lần thử.` };
    }

    // OTP correct
    otpStore.delete(username);
    return { success: true, message: 'OTP hợp lệ.' };
  },

  // Clear OTP
  clearOTP: (username) => {
    otpStore.delete(username);
  }
};

module.exports = otpManager;
