const express = require("express");
const crypto = require("crypto");
const URL = require("../models/url");

const router = express.Router();

router.post("/", async (req, res) =>{
       const body = req.body;

       const shortId = crypto.randomBytes(4).toString("hex");

    await URL.create({
            shortId: shortId,
            redirectURL: body.url,
            visitHistory: []
    });

       return res.json({
        id: shortId
       });
});


router.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        }
    );

    if (!entry) {
        return res.status(404).json({
            error: "Short URL not found"
        });
    }

    return res.redirect(entry.redirectURL);
});


router.get("/analytics/:shortId", async (req, res) => {
    const shortId = req.params.shortId;

    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.status(404).json({
            error: "Short URL not found"
        });
    }

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory
    });
});

module.exports = router;