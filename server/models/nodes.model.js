const mongoose = require('mongoose');

const NodeSchema = mongoose.Schema(
    {
        node_id: {
            type: String,
            required: [true, 'ID needed to keep track of where nodes are']
        },
        building: {
            type: String,
            required: [true, 'Main building of junction required'],
        },
        floor: {
            type: Number,
            required: [true, 'Floor level of junction required'],
        },
        neighbour: [{
            node: {
                type: String,
                required: true,
            },
            weight: {
                type: Number,
                default: 0,
            }
        }],
        attribute: {
            type: [String],
            enum: ['walk', 'sheltered', 'lift', 'stairs', 'ramp'],
            default: ['walk'],
        },
        clusterGroup: {
            type: String,
            required: false,
        },
        nodeType: {
            type: String,
            enum: ['door', 'junction'],
            default: 'door'
        }
    },
    {
        timestamps: true,
    }
);

const Node = mongoose.model('Node', NodeSchema);
module.exports = Node;
