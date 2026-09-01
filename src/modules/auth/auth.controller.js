const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const catchAsync = require('../../utils/catchAsync.utils');
const AppError = require('../../utils/AppError.utils');
const Email = require('../../utils/email.utils');

const signToken = id => {
    return jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        data: {
            accessToken: token,
            user
        }
    });
};

exports.register = catchAsync(async (req, res, next) => {
    req.body.photo = req.file ? req.file.path : undefined;
    const newUser = await User.create(req.body);

    await new Email(newUser).sendWelcome();

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password -__v');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 400));
    }

    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user._id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Your current password is wrong.', 400));
    }

    // 3) If so, update password
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with that email address.', 404));
    }

    // 2) Generate the random OTP
    const otp = user.createPasswordResetOtp();
    await user.save({ validateBeforeSave: false });

    // 3) Send the OTP to the user's email
    await new Email(user).sendResetPassword(otp);

    res.status(200).json({
        status: 'success',
        message: 'OTP sent to email!'
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the OTP
    const user = await User.findOne({
        passwordResetOtp: req.body.otp,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('OTP is invalid or has expired', 400));
    }

    // 2) If OTP is valid, set the new password
    user.password = req.body.newPassword;
    user.confirmPassword = req.body.passwordConfirm;
    user.passwordResetOtp = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Log the user in, send JWT
    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});