const getRoute = async (req, res) => {
    try {
        const start = req.query.start;
        const end = req.query.end;

        res.status(200).json({
            start,
            end,
            path: [
                "Walk straight",
                "Turn left",
                "Arrive destination"
            ],
            distance: "250m"
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { getRoute };