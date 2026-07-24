const mongoose = require('mongoose');

const HistorySchema = mongoose.Schema(
    {
        username: {
            type: String
        },
        id: {
            type: String
        },
        path: {
            type: [[Object]],
            required: true
        },
        estimatedTime: {
            type: Number,
            required: true
        },
        startLocation: {
            type: String,
            required: true
        },
        endLocation: {
            type: String,
            required: true
        },
        optimisation: {
            type: String,
            required: true
        },
        totalNodes: {
            type: Number,
            required: true
        },
        favourite: {
            type: Boolean,
            default: false
        },
        timestamp: {
            type: Number,
            required: [true]
        }
    }
);
const Histories = mongoose.model('Historie', HistorySchema);
module.exports = Histories;
