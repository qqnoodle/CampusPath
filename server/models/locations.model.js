const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema(
    {
        name: {
            type: String,
            default: () => { return this.roomNumber }
        },
        roomNumber: {
            type: String,
            required: [true]
        },
        building: {
            type: String,
            required: [true, 'Main building of location required'],
        },
        floor: {
            type: Number,
            required: [true, 'Floor level of location required'],
        },
        doors: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Node'
            }],
            required: [true, 'All location must have doors'],
        }
    },
    {
        timestamps: true,
    },
);

const Locations = mongoose.model('Location', LocationSchema);
module.exports = Locations;

