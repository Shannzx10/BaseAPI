const express = require("express");
const danz = require("d-scrape");
const router = express.Router();
const config = require("../schema/config");
const skrep = require("../scrapers/ai");
const { developer: dev } = config.options;

// Log Info
const messages = {
  error: {
    status: 404,
    developer: dev,
    result: "Error, Service Unavailable",
  },
  notRes: {
    status: 404,
    developer: dev,
    result: "Error, Invalid JSON Result",
  },
  query: {
    status: 400,
    developer: dev,
    result: "Please input parameter query!",
  },
  url: {
    status: 400,
    developer: dev,
    result: "Please input parameter URL!",
  },
  notUrl: {
    status: 404,
    developer: dev,
    result: "Error, Invalid URL",
  },
};

// AI Routes
router.post("/ai/luminai", async (req, res) => {
  const { query, username } = req.query;
  if (!query) return res.status(400).json(messages.query);
  if (!username)
    return res.status(400).json({
      status: 400,
      developer: dev,
      result: "Please input Username session!",
    });

  try {
    const data = await skrep.luminai(query, username);
    if (!data) return res.status(404).json(messages.notRes);
    res.json({ status: true, developer: dev, result: data });
  } catch (e) {
    res.status(500).json(messages.error);
  }
});

module.exports = router;
