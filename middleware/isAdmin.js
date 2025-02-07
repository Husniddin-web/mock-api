const isAdmin = (req, res, next) => {
    try {
        const { role } = req.user;

        if (role !== "admin") {
            return res.status(403).send({ message: "Access denied. Admins only.", success: false });
        }

        next();
    } catch (error) {
        res.status(500).send({ message: "An error occurred", success: false, error });
    }
};

module.exports = { isAdmin }
