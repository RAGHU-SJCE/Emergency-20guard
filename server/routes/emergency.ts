import { Router } from "express";
import { EmergencyController } from "../controllers/emergencyController";
import { EmergencyService } from "../services/emergencyService";
import { NotificationService } from "../services/notificationService";
import { LocationService } from "../services/locationService";

// Initialize services
const emergencyService = new EmergencyService();
const notificationService = new NotificationService();
const locationService = new LocationService();

// Initialize controller with services
const emergencyController = new EmergencyController(
  emergencyService,
  notificationService,
  locationService
);

// Create router
const router = Router();

// Emergency routes
router.post("/call", emergencyController.initiateEmergencyCall);
router.post("/alert-contacts", emergencyController.alertEmergencyContacts);
router.post("/log-event", emergencyController.logEmergencyEvent);
router.get("/history", emergencyController.getEmergencyHistory);
router.get("/statistics", emergencyController.getEmergencyStatistics);
router.get("/health", emergencyController.healthCheck);

export default router;
