
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { EventEmitter } from "node:events";
import { Server } from "socket.io";

import { Map } from "../src/map.js";
import { MacGuffin } from "../src/mac-guffin.js";
import { Simulator } from "../src/simulator.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emitter = new EventEmitter();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', "public")));
app.use(express.static(path.join(__dirname, '..', "node_modules/spectre.css/dist")));

// Simulation API
app.post("/api/simulate", async (req, res) => {
  const { width, height, startX, startY, commands } = req.body;

  // Validate the request format
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width <= 0 ||
    height <= 0 ||
    !Number.isInteger(startX) ||
    !Number.isInteger(startY) ||
    !Array.isArray(commands) ||
    !commands.every(
      (command) =>
        Number.isInteger(command) &&
        command >= 0 &&
        command <= 4
    ) ||
    !commands.includes(0)
  ) {
    return res.status(400).json({
      error: "Invalid input. Provide dimensions, starting position, and commands ending with 0."
    });
  }

  try {
    // Adapt this call to your simulator's existing API.
    const map = new Map(width, height);
    const macGuffin = new MacGuffin(startX, startY);
    const result =  []
    const logger = {
      start(macGuffin, map, commands) {
        emitter.emit('start', { macGuffin, map, commands });
      },
      step(macGuffin) {
        emitter.emit('step', { macGuffin });
      },
      stop(macGuffin) {
        emitter.emit('stop', { macGuffin, valid: map.isValid(macGuffin.position) });
      },
      log(...args) {
        emitter.emit('log', { args });
        result.push(...args);
      },
    };
    const simulator = new Simulator(map, macGuffin);
    await simulator.simulate(commands, logger);

    return res.json(result);
  } catch (error) {
    console.error("Simulation failed:", error);

    return res.status(500).json({
      error: "The simulation could not be completed.",
      message: error.message,
    });
  }
});


io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  const onstart = (payload) => {
    socket.emit('simulator:start', payload);
  };
  const onstep = (payload) => {
    socket.emit('simulator:step', payload);
  };
  const onstop = (payload) => {
    socket.emit('simulator:stop', payload);
  };
  const onlog = (payload) => {
    socket.emit('simulator:log', payload);
  };

  emitter.on('start', onstart);
  emitter.on('step', onstep);
  emitter.on('stop', onstop);
  emitter.on('log', onlog);

  socket.on("simulate", (data, callback) => {
    try {
      callback?.({ result });
    } catch (error) {
      console.error("Simulation failed:", error);

      callback?.({
        error: "The simulation could not be completed."
      });
    }
  });

  socket.on("disconnect", () => {
    emitter.off('start', onstart);
    emitter.off('step', onstep);
    emitter.off('stop', onstop);
    emitter.off('log', onlog);
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the server only when this file is executed directly.
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
