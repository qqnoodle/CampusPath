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

//Enable index on name, building, roomNumber because they are frequently queried in search
LocationSchema.index({ name: 1, roomNumber: 1, building: 1 });

const Locations = mongoose.model('Location', LocationSchema);
module.exports = Locations;

