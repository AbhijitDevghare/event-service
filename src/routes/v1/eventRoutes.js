const express = require("express");
const EventController = require("../../controllers/eventController");
const uploads = require("../../middleware/multer");
const jwtAuth = require("../../middleware/jwtAuth");

const router = express.Router();

// -------------------- EVENT ROUTES --------------------

// Create event with multiple media files
router.post("/", jwtAuth,uploads.array("media"), EventController.createEvent);
router.post("/publish/:event_id", jwtAuth, EventController.publishEvent);

router.put("/:event_id/:status", jwtAuth, EventController.changeEventStatus);

router.get("/getEventsByIds", EventController.getEventsByIds);
router.get("/getPublishedEvent", jwtAuth, EventController.getPublishedEvents);
router.get("/getUnpublishedEvents", jwtAuth, EventController.getUnpublishedEvents);
router.get("/getPastEvents", jwtAuth, EventController.getPastEvents);

router.get("/completed",jwtAuth,EventController.getCompletedEvents)

// List all events
router.get("/", EventController.listEvents);

// Get event by ID
router.get("/:id", EventController.getEventById);



// Update event
router.put("/:id", EventController.updateEvent);

// Delete event
router.delete("/:id", EventController.deleteEvent);


// -------------------- REWARD ROUTE --------------------
// ✅ Route to give rewards & badges manually for completed events
router.post("/reward/give/:event_id", jwtAuth, EventController.giveRewardsToUsers);

module.exports = router;
