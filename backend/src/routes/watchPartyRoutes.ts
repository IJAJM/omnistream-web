import { Router } from "express";
import { createRoom, listRooms, getRoom } from "../controllers/watchPartyController";
import { requireAuth } from "../middleware/requireAuth";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post("/watchparty/rooms", requireAuth, asyncHandler(createRoom));
router.get("/watchparty/rooms", asyncHandler(listRooms));
router.get("/watchparty/rooms/:id", asyncHandler(getRoom));

export default router;
