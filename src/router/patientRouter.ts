import express from "express";
import { PatientController } from "../controller";
import { patientAuthMiddleware } from "../middleware/patientAuthMiddleware";
const router = express.Router();
const patientController = new PatientController();

router.route("/register").post(patientController.registerNewPatient);
router.route("/login").post(patientController.loginPatient);
router.route("report/share-with-doctor").post(patientAuthMiddleware, patientController.shareReportWithDoctor);
router.route("/report/new").post(patientAuthMiddleware, patientController.createNewReport);
router.route("/register-under-doctor").post(patientAuthMiddleware, patientController.registerUnderDoctor);

router.route("/report/all").get(patientAuthMiddleware, patientController.getAllReports);
router.route("/report/doctor-remarks").get(patientAuthMiddleware, patientController.getDoctorRemarksOnReports);

export { router as patientRouter }
