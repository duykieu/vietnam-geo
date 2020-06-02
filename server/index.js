const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");

const server = express();

server.get("/state", async (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(process.cwd() + "/local.json"));

    const states = data.map((state) => {
      delete state.districts;
      return state;
    });

    return res.json({ success: true, data: { states } });
  } catch (error) {
    return res.json({
      success: false,
    });
  }
});

server.get("/city/:stateCode", async (req, res) => {
  try {
    const { stateCode } = req.params;

    if (!stateCode)
      return res.json({
        success: false,
        message: "You must specify `stateCode`",
      });

    const data = JSON.parse(fs.readFileSync(process.cwd() + "/local.json"));

    const state = data.find((state) => state.code === stateCode);

    const cities = state.districts.map((city) => {
      city.code = state.code + "_" + city.id;
      delete city.wards;
      delete city.streets;
      delete city.projects;
      return city;
    });

    return res.json({ success: true, data: { cities } });
  } catch (error) {
    return res.json({
      success: false,
    });
  }
});

server.get("/ward/:cityCode", async (req, res) => {
  try {
    const { cityCode } = req.params;

    if (!cityCode)
      return res.json({
        success: false,
        message: "You must specify `cityCode`",
      });

    const data = JSON.parse(fs.readFileSync(process.cwd() + "/local.json"));

    const codes = cityCode.split("_");

    if (codes.length !== 2) {
      return res.json({
        success: false,
      });
    }

    const state = data.find((state) => state.code === codes[0]);

    const city = state.districts.find((cityItem) => {
      return state.code + "_" + cityItem.id === cityCode;
    });

    const wards = city.wards.map((ward) => {
      ward.code = state.code + "_" + city.id + "_" + ward.id;
      return ward;
    });

    return res.json({ success: true, data: { wards } });
  } catch (error) {
    return res.json({
      success: false,
    });
  }
});

server.get("/street/:streetCode", async (req, res) => {
  try {
    const { streetCode } = req.params;

    if (!streetCode)
      return res.json({
        success: false,
        message: "You must specify `streetCode`",
      });

    const data = JSON.parse(fs.readFileSync(process.cwd() + "/local.json"));

    const codes = streetCode.split("_");

    if (codes.length !== 2) {
      return res.json({
        success: false,
      });
    }

    const state = data.find((state) => state.code === codes[0]);

    const city = state.districts.find((cityItem) => {
      return state.code + "_" + cityItem.id === streetCode;
    });

    const streets = city.streets.map((ward) => {
      ward.code = state.code + "_" + city.id + "_" + ward.id;
      return ward;
    });

    return res.json({ success: true, data: { streets } });
  } catch (error) {
    return res.json({
      success: false,
    });
  }
});

server.get("/project/:projectCode", async (req, res) => {
  try {
    const { projectCode } = req.params;

    if (!projectCode)
      return res.json({
        success: false,
        message: "You must specify `projectCode`",
      });

    const data = JSON.parse(fs.readFileSync(process.cwd() + "/local.json"));

    const codes = projectCode.split("_");

    if (codes.length !== 2) {
      return res.json({
        success: false,
      });
    }

    const state = data.find((state) => state.code === codes[0]);

    const city = state.districts.find((cityItem) => {
      return state.code + "_" + cityItem.id === projectCode;
    });

    const projects = city.projects.map((ward) => {
      ward.code = state.code + "_" + city.id + "_" + ward.id;
      return ward;
    });

    return res.json({ success: true, data: { projects } });
  } catch (error) {
    return res.json({
      success: false,
    });
  }
});

server.listen(8080, () => {
  console.log("listen on 8080");
});
