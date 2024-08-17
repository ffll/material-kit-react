const User = require('../models/User');

const getUser = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
};

module.exports = { getUser };
