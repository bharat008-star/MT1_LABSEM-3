const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

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

const server = http.createServer((req, res) => {

    // Home route
    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h1>Welcome to Vehicle Management System</h1>
            <p>Manage your vehicle records easily.</p>
        `);
    }

    // GET all vehicles
    else if (req.url === "/vehicles" && req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(vehicles));
    }

    // About route
    else if (req.url === "/about" && req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>About Vehicle Management System</h1>");
    }

    // Serve static file using FS
    else if (req.url === "/info" && req.method === "GET") {

        fs.readFile(
            path.join(__dirname, "public", "info.html"),
            "utf8",
            (err, data) => {

                if (err) {
                    res.writeHead(500);
                    return res.end("Error reading file");
                }

                res.writeHead(200, {
                    "Content-Type": "text/html"
                });

                res.end(data);
            }
        );
    }

    // POST add vehicle
    else if (req.url === "/add-vehicle" && req.method === "POST") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            try {
                const vehicle = JSON.parse(body);

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
                    res.writeHead(400);
                    return res.end("Missing required fields");
                }

                if (typeof vehicle.price !== "number" ||
                    vehicle.price <= 0) {
                    res.writeHead(400);
                    return res.end("Price must be positive");
                }

                if (vehicles.some(v => v.id === Number(vehicle.id))) {
                    res.writeHead(400);
                    return res.end("Vehicle ID already exists");
                }

                vehicle.id = Number(vehicle.id);
                vehicles.push(vehicle);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Vehicle added successfully",
                    vehicle: vehicle
                }));

            } catch (error) {
                res.writeHead(400);
                res.end("Invalid JSON");
            }
        });
    }

    // Invalid route
    else {
        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("404 Page Not Found");
    }
});

server.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
});