const express = require("express");
const mongoose = require('mongoose')
const Vehicle = require('../models/VehicleModel');
const vehicleRouter = express.Router();

vehicleRouter.route('/')
    .get((req, res) => {
        Vehicle.find({}, (err, vehicles) => {
        if(err) {
          res.sendStatus(500);
        }
        else {
          res.json(vehicles);
        }     
        });  
    })
    .post((req, res) => {
        let vehicle = new Vehicle(req.body);
        vehicle.save().then(res.send(201));
    })

vehicleRouter.route('/:vehicleId')
    .get((req, res) => {
        var id = mongoose.Types.ObjectId(req.params.vehicleId);
        Vehicle.findById(id, (err, vehicle) => {
          if(err) {
            res.sendStatus(500);
          }
          else {
            res.json(vehicle);
          }
        })
    })
    .delete((req, res) => {
        var id = mongoose.Types.ObjectId(req.params.vehicleId)
        Vehicle.findByIdAndDelete(id, (err, vehicle) => {
          if (err) {
            res.sendStatus(500);
          }
          else {
            if (vehicle) {
                res.sendStatus(201);
            }
          }})
        
    })
    .put((req,res) => {
        Vehicle.findById(req.params.vehicleId, (err, vehicle) => {
          if (err) {
            res.send(500);
          }
          else {
          vehicle.name = req.body.name;
          vehicle.type = req.body.type;
          vehicle.save().then(res.sendStatus(200))
          }
        })
    })

module.exports = vehicleRouter;