import { Router } from "express";
import { AvatarService } from "../services/avatarService.js";
import { toInworldCharacter } from "../adapters/inworldAdapter.js";
import { toConvaiCharacter } from "../adapters/convaiAdapter.js";
import { toCharismaCharacter } from "../adapters/charismaAdapter.js";

export function createAvatarRouter(service: AvatarService): Router {
  const router = Router();

  router.post("/generate", async (req, res, next) => {
    try {
      const avatar = await service.generateAvatar(req.body);
      res.json(avatar);
    } catch (error) {
      next(error);
    }
  });

  router.post("/:id/reroll", async (req, res, next) => {
    try {
      const avatar = await service.rerollAvatar(req.params.id, req.body);
      res.json(avatar);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const avatar = await service.getAvatar(req.params.id);
      if (!avatar) {
        res.status(404).json({ error: "Avatar not found" });
        return;
      }
      res.json(avatar);
    } catch (error) {
      next(error);
    }
  });

  router.get("/", async (req, res, next) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const offset = req.query.offset ? Number(req.query.offset) : undefined;
      const avatars = await service.listAvatars(limit, offset);
      res.json({
        items: avatars,
        limit: limit ?? 20,
        offset: offset ?? 0,
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id/inworld", async (req, res, next) => {
    try {
      const avatar = await service.getAvatar(req.params.id);
      if (!avatar) {
        res.status(404).json({ error: "Avatar not found" });
        return;
      }
      res.json(toInworldCharacter(avatar));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id/convai", async (req, res, next) => {
    try {
      const avatar = await service.getAvatar(req.params.id);
      if (!avatar) {
        res.status(404).json({ error: "Avatar not found" });
        return;
      }
      res.json(toConvaiCharacter(avatar));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id/charisma", async (req, res, next) => {
    try {
      const avatar = await service.getAvatar(req.params.id);
      if (!avatar) {
        res.status(404).json({ error: "Avatar not found" });
        return;
      }
      res.json(toCharismaCharacter(avatar));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
