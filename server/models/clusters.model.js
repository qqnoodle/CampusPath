const mongoose = require('mongoose');

const ClusterSchema = mongoose.Schema(
    {
        //The id of this can be obtained by Sorting the 2 junctions nodes and hashing it with a fixed key/seed
        id: {
            type: Number,
        },
        name: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

const Cluster = mongoose.model('Cluster', ClusterSchema);
module.export = Cluster;
