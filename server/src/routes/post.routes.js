import { Router } from "express";
import { PostService } from "../services/post.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// server/src/routes/post.routes.js — AFTER (hardened)
router.post("/posts", requireAuth, async (req, res, next) => {
  try {
    // Never trust client-supplied identity fields — derive
    // authorId from the authenticated request, not the request body.
    const post = await PostService.publish({
      ...req.body,
      authorId: req.user.id, // set by requireAuth middleware from the verified JWT
    });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

router.get("/posts", async (req, res, next) => {
  try {
    const { page = 1, pageSize, search } = req.query;
    const result = search
      ? await PostService.search({ query: search, page: Number(page), pageSize })
      : await PostService.listPublished({ page: Number(page), pageSize });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
