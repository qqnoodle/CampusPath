const { graphBuilder } = require("./graphBuilder");


const testData1 = [
    { "node_id": "COM1-1-D-7-7", "building": "COM1", "floor": 1, "neighbour": [{ "node": "COM1-1-J-7-5", "weight": 2 }, { "node": "COM1-1-D-7-10", "weight": 3 }], "nodeType": "door", "attribute": ["walk", "sheltered"], "clusterGroup": "cluster" },
    { "node_id": "COM1-1-D-7-10", "building": "COM1", "floor": 1, "neighbour": [{ "node": "COM1-1-D-7-7", "weight": 2 }, { "node": "COM1-1-D-7-12", "weight": 2 }], "nodeType": "door", "attribute": ["walk", "sheltered"], "clusterGroup": "cluster" },
    { "node_id": "COM1-1-D-7-12", "building": "COM1", "floor": 1, "neighbour": [{ "node": "COM1-1-D-7-10", "weight": 2 }, { "node": "COM1-1-D-7-14", "weight": 2 }], "nodeType": "door", "attribute": ["walk", "sheltered"], "clusterGroup": "cluster" }
];


const testData2 =
    [
        {
            "_id": "6a16e772cd0381f66250a18e",
            "node_id": "COM1-1-D-6-40",
            "building": "COM1",
            "floor": 1,
            "nodeType": "door",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd21",
                    "node": "COM1-1-J-6-35",
                    "weight": 5
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd22",
                    "node": "COM1-1-D-6-46",
                    "weight": 6
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a18f",
            "node_id": "COM1-1-D-16-40",
            "building": "COM1",
            "floor": 1,
            "nodeType": "door",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd23",
                    "node": "COM1-1-J-17-39",
                    "weight": 1
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a190",
            "node_id": "COM1-1-D-16-46",
            "building": "COM1",
            "floor": 1,
            "nodeType": "door",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": []
        },
        {
            "_id": "6a16e772cd0381f66250a191",
            "node_id": "COM1-1-D-6-46",
            "building": "COM1",
            "floor": 1,
            "nodeType": "door",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd24",
                    "node": "COM1-1-D-6-40",
                    "weight": 6
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd25",
                    "node": "COM1-1-J-6-49",
                    "weight": 3
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a192",
            "node_id": "COM1-1-D-11-50",
            "building": "COM1",
            "floor": 1,
            "nodeType": "door",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd26",
                    "node": "COM1-1-J-6-49",
                    "weight": 5
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd27",
                    "node": "COM1-1-J-15-50",
                    "weight": 4
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a193",
            "node_id": "COM1-1-D-19-53",
            "building": "COM1",
            "floor": 1,
            "nodeType": "door",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": []
        },
        {
            "_id": "6a16e772cd0381f66250a194",
            "node_id": "COM1-1-D-24-40",
            "building": "COM1",
            "floor": 1,
            "nodeType": "door",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd28",
                    "node": "COM1-1-J-28-40",
                    "weight": 4
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd29",
                    "node": "COM1-1-J-17-39",
                    "weight": 7
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a195",
            "node_id": "COM1-1-D-17-34",
            "building": "COM1",
            "floor": 1,
            "nodeType": "door",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd2a",
                    "node": "COM1-1-J-17-39",
                    "weight": 5
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd2b",
                    "node": "COM1-1-J-17-30",
                    "weight": 4
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a196",
            "node_id": "COM1-1-D-20-30",
            "building": "COM1",
            "floor": 1,
            "nodeType": "door",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd2c",
                    "node": "COM1-1-J-17-30",
                    "weight": 3
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd2d",
                    "node": "COM1-1-J-28-30",
                    "weight": 8
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a197",
            "node_id": "COM1-1-D-7-10",
            "building": "COM1",
            "floor": 1,
            "nodeType": "door",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd2e",
                    "node": "COM1-1-D-7-16",
                    "weight": 6
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a198",
            "node_id": "COM1-1-D-7-16",
            "building": "COM1",
            "floor": 1,
            "nodeType": "door",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd2f",
                    "node": "COM1-1-D-7-10",
                    "weight": 6
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd30",
                    "node": "COM1-1-D-7-20",
                    "weight": 4
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a199",
            "node_id": "COM1-1-D-7-20",
            "building": "COM1",
            "floor": 1,
            "nodeType": "door",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd31",
                    "node": "COM1-1-D-7-16",
                    "weight": 4
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd32",
                    "node": "COM1-1-J-6-22",
                    "weight": 2
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a19a",
            "node_id": "COM1-1-D-9-30",
            "building": "COM1",
            "floor": 1,
            "nodeType": "door",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd33",
                    "node": "COM1-1-J-17-30",
                    "weight": 8
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd34",
                    "node": "COM1-1-J-6-30",
                    "weight": 3
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a19b",
            "node_id": "COM1-1-D-6-25",
            "building": "COM1",
            "floor": 1,
            "nodeType": "door",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd35",
                    "node": "COM1-1-J-6-22",
                    "weight": 3
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd36",
                    "node": "COM1-1-J-6-30",
                    "weight": 5
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a19c",
            "node_id": "COM1-1-J-6-30",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd37",
                    "node": "COM1-1-D-6-25",
                    "weight": 5
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd38",
                    "node": "COM1-1-J-4-27",
                    "weight": 3
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd39",
                    "node": "COM1-1-J-6-35",
                    "weight": 5
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd3a",
                    "node": "COM1-1-J-6-22",
                    "weight": 8
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd3b",
                    "node": "COM1-1-D-9-30",
                    "weight": 3
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd3c",
                    "node": "COM1-1-J-17-30",
                    "weight": 11
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a19d",
            "node_id": "COM1-1-J-6-22",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd3d",
                    "node": "COM1-1-J-1-22",
                    "weight": 5
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd3e",
                    "node": "COM1-1-D-7-20",
                    "weight": 2
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd3f",
                    "node": "COM1-1-D-6-25",
                    "weight": 3
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd40",
                    "node": "COM1-1-J-4-27",
                    "weight": 5
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd41",
                    "node": "COM1-1-J-6-30",
                    "weight": 8
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a19e",
            "node_id": "COM1-1-J-6-35",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "lift"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd42",
                    "node": "COM1-1-J-3-35",
                    "weight": 3
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd43",
                    "node": "COM1-1-J-6-30",
                    "weight": 5
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd44",
                    "node": "COM1-1-D-6-40",
                    "weight": 5
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd45",
                    "node": "COM1-1-J-6-49",
                    "weight": 14
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a19f",
            "node_id": "COM1-1-J-6-49",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "lift"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd46",
                    "node": "COM1-1-D-6-46",
                    "weight": 3
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd47",
                    "node": "COM1-1-J-4-55",
                    "weight": 6
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd48",
                    "node": "COM1-1-J-6-35",
                    "weight": 14
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd49",
                    "node": "COM1-1-D-11-50",
                    "weight": 5
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd4a",
                    "node": "COM1-1-J-15-50",
                    "weight": 9
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a1a0",
            "node_id": "COM1-1-J-15-50",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "lift"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd4b",
                    "node": "COM1-1-D-11-50",
                    "weight": 4
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd4c",
                    "node": "COM1-1-J-6-49",
                    "weight": 9
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd4d",
                    "node": "COM1-1-J-28-50",
                    "weight": 13
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a1a1",
            "node_id": "COM1-1-J-17-39",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "lift"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd4e",
                    "node": "COM1-1-D-24-40",
                    "weight": 7
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd4f",
                    "node": "COM1-1-J-28-40",
                    "weight": 11
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd50",
                    "node": "COM1-1-D-16-40",
                    "weight": 1
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd51",
                    "node": "COM1-1-D-17-34",
                    "weight": 5
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd52",
                    "node": "COM1-1-J-17-30",
                    "weight": 9
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a1a2",
            "node_id": "COM1-1-J-17-30",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "lift"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd53",
                    "node": "COM1-1-D-17-34",
                    "weight": 4
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd54",
                    "node": "COM1-1-J-17-39",
                    "weight": 9
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd55",
                    "node": "COM1-1-J-28-30",
                    "weight": 11
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd56",
                    "node": "COM1-1-D-20-30",
                    "weight": 3
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd57",
                    "node": "COM1-1-D-9-30",
                    "weight": 8
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd58",
                    "node": "COM1-1-J-6-30",
                    "weight": 11
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a1a3",
            "node_id": "COM1-1-J-28-30",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "lift"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd59",
                    "node": "COM1-1-J-17-30",
                    "weight": 11
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd5a",
                    "node": "COM1-1-D-20-30",
                    "weight": 8
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a1a4",
            "node_id": "COM1-1-J-28-40",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "lift"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd5b",
                    "node": "COM1-1-J-28-50",
                    "weight": 10
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd5c",
                    "node": "COM1-1-J-29-38",
                    "weight": 2
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd5d",
                    "node": "COM1-1-J-27-37",
                    "weight": 3
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd5e",
                    "node": "COM1-1-D-24-40",
                    "weight": 4
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd5f",
                    "node": "COM1-1-J-17-39",
                    "weight": 11
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a1a5",
            "node_id": "COM1-1-J-28-50",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "lift"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd60",
                    "node": "COM1-1-J-15-50",
                    "weight": 13
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd61",
                    "node": "COM1-1-J-30-49",
                    "weight": 2
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd62",
                    "node": "COM1-1-J-28-40",
                    "weight": 10
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a1a6",
            "node_id": "COM1-1-J-4-27",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd63",
                    "node": "COM1-1-J-6-30",
                    "weight": 3
                },
                {
                    "_id": "6a16e7ab4aa3e6973511bd64",
                    "node": "COM1-1-J-6-22",
                    "weight": 5
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a1a7",
            "node_id": "COM1-1-J-1-22",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd65",
                    "node": "COM1-1-J-6-22",
                    "weight": 5
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a1a8",
            "node_id": "COM1-1-J-4-55",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd66",
                    "node": "COM1-1-J-6-49",
                    "weight": 6
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a1a9",
            "node_id": "COM1-1-J-30-49",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd67",
                    "node": "COM1-1-J-28-50",
                    "weight": 2
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a1aa",
            "node_id": "COM1-1-J-29-38",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd68",
                    "node": "COM1-1-J-28-40",
                    "weight": 2
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a1ab",
            "node_id": "COM1-1-J-27-37",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd69",
                    "node": "COM1-1-J-28-40",
                    "weight": 3
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a1ac",
            "node_id": "COM1-1-J-29-23",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "stairs"
            ],
            "neighbour": []
        },
        {
            "_id": "6a16e772cd0381f66250a1ad",
            "node_id": "COM1-1-J-3-35",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "lift"
            ],
            "neighbour": [
                {
                    "_id": "6a16e7ab4aa3e6973511bd6a",
                    "node": "COM1-1-J-6-35",
                    "weight": 3
                }
            ]
        },
        {
            "_id": "6a16e772cd0381f66250a1ae",
            "node_id": "COM1-1-J-28-25",
            "building": "COM1",
            "floor": 1,
            "nodeType": "junction",
            "attribute": [
                "walk",
                "sheltered",
                "lift"
            ],
            "neighbour": []
        }
    ];

test("graphBuilding testcase 1", () => {
    expect(graphBuilder(testData1)).toEqual(new Map([
        ["COM1-1-D-7-7", { "node_id": "COM1-1-D-7-7", "building": "COM1", "floor": 1, "neighbour": [{ "node": "COM1-1-J-7-5", "weight": 2 }, { "node": "COM1-1-D-7-10", "weight": 3 }], "nodeType": "door", "attribute": ["walk", "sheltered"], "clusterGroup": "cluster" }],
        ["COM1-1-D-7-10", { "node_id": "COM1-1-D-7-10", "building": "COM1", "floor": 1, "neighbour": [{ "node": "COM1-1-D-7-7", "weight": 2 }, { "node": "COM1-1-D-7-12", "weight": 2 }], "nodeType": "door", "attribute": ["walk", "sheltered"], "clusterGroup": "cluster" }],
        ["COM1-1-D-7-12", { "node_id": "COM1-1-D-7-12", "building": "COM1", "floor": 1, "neighbour": [{ "node": "COM1-1-D-7-10", "weight": 2 }, { "node": "COM1-1-D-7-14", "weight": 2 }], "nodeType": "door", "attribute": ["walk", "sheltered"], "clusterGroup": "cluster" }]
    ]));
});

test("graphBuilding testcase 2", () => {
    expect(graphBuilder(testData2)).toEqual(graphBuilder(testData2));
});
