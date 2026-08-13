import { Router } from "express";
import { createRoom, listRooms, getRoom } from "../controllers/watchPartyController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.post("/watchparty/rooms", requireAuth, createRoom);
router.get("/watchparty/rooms", listRooms);
router.get("/watchparty/rooms/:id", getRoom);

export default router;
