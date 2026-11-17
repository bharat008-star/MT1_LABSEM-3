const express = require("express");

const app = express();
const PORT = 4000;

app.use(express.json());

// Vehicle array
let vehicles = [
    {
        id: 1,
        vehicleName: "Hyundai Creta",
        vehicleNumber: "HR26AB1234",
        type: "SUV",
        price: 1500000
    },
    {
        id: 2,
        vehicleName: "Maruti Swift",
        vehicleNumber: "DL8CAF5030",
        type: "Hatchback",
        price: 750000
    },
    {
        id: 3,
        vehicleName: "Honda City",
        vehicleNumber: "UP16CD4567",
        type: "Sedan",
        price: 1200000
    }
];

// Validate vehicle
function validateVehicle(vehicle) {

    const required = [
        "id",
        "vehicleName",
        "vehicleNumber",
        "type",
        "price"
    ];

    const missing = required.filter(
        key => vehicle[key] === undefined ||
               vehicle[key] === null ||
               vehicle[key] === ""
    );

    if (missing.length > 0) {
        return "Required fields are missing";
    }

    if (typeof vehicle.price !== "number" ||
        vehicle.price <= 0) {
        return "Price must be positive";
    }

    return null;
}

// 1. GET all vehicles
app.get("/vehicles", (req, res) => {
    res.status(200).json(vehicles);
});

// 2. GET vehicle by ID
app.get("/vehicles/:id", (req, res) => {

    const id = Number(req.params.id);

    const vehicle = vehicles.find(v => v.id === id);

    if (!vehicle) {
        return res.status(404).json({
            message: "Vehicle not found"
        });
    }

    res.status(200).json(vehicle);
});

// 3. POST add vehicle
app.post("/vehicles", (req, res) => {

    const newVehicle = req.body;

    const error = validateVehicle(newVehicle);

    if (error) {
        return res.status(400).json({
            message: error
        });
    }

    const id = Number(newVehicle.id);

    if (vehicles.some(v => v.id === id)) {
        return res.status(400).json({
            message: "Vehicle ID already exists"
        });
    }

    newVehicle.id = id;

    vehicles.push(newVehicle);

    res.status(201).json({
        message: "Vehicle added successfully",
        vehicle: newVehicle
    });
});

// 4. PUT update vehicle
app.put("/vehicles/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = vehicles.findIndex(v => v.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Vehicle not found"
        });
    }

    const updatedVehicle = {
        ...vehicles[index],
        ...req.body,
        id: id
    };

    const error = validateVehicle(updatedVehicle);

    if (error) {
        return res.status(400).json({
            message: error
        });
    }

    vehicles[index] = updatedVehicle;

    res.status(200).json({
        message: "Vehicle updated successfully",
        vehicle: updatedVehicle
    });
});

// 5. DELETE vehicle
app.delete("/vehicles/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = vehicles.findIndex(v => v.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Vehicle not found"
        });
    }

    const deletedVehicle = vehicles.splice(index, 1)[0];

    res.status(200).json({
        message: "Vehicle deleted successfully",
        vehicle: deletedVehicle
    });
});

// Invalid JSON handling
app.use((err, req, res, next) => {

    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            message: "Invalid JSON"
        });
    }

    next(err);
});

// Invalid route
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});