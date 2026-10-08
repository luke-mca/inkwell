// server/src/routes/stats.routes.js

import { Router } from "express";
import { getTotalPostsPublished } from "../events/listeners/count-published-posts.listener.js";

const router = Router();

router.get("/stats", (req, res) => {
  res.status(200).json({ totalPostsPublished: getTotalPostsPublished() });
});

export default router;
