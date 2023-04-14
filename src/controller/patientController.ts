import { NextFunction, Request, Response } from "express";
import { PatientRepository } from "../repository";
import { IPatient } from "../entity";
import { veriftyJwtToken, generateJwtToken } from "../util";

export class PatientController {

  private patientRepository: PatientRepository = new PatientRepository();

  public registerNewPatient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password, name, deviceId } = req.body;
      if (!email || !password || !name || !deviceId) {
        throw new Error("[email/ password/ name/ deviceId] is missing");
      }
      await this.patientRepository.registerPatient(
        email,
        password,
        name,
        deviceId
      );
      res.json({
        error: false,
        message: "patient registered",
      });
    } catch (error) {
      next(error);
    }
  };

  public loginPatient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new Error("[email/ password] is missing");
      }
      const patient: IPatient = await this.patientRepository.getPatientByEmail(
        email
      );
      if (!patient) {
        throw new Error("Invalid email/ password");
      }

      if (patient.password !== password.trim()) {
        throw new Error("Invalid email/ password");
      }

      patient.password = undefined;

      const payload = {
        _id: patient["_id"],
        email: patient.email,
        name: patient.name,
        deviceId: patient.deviceId
      }

      const token = generateJwtToken(payload);

      res.json({
        error: false,
        message: "login success",
        data: patient,
        token: token
      });
    } catch (error) {
      next(error);
    }
  };

  public shareReportWithDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { reportId, doctorId } = req.body;
      const patientId = req["user"]["_id"];

      if (!reportId || !doctorId) {
        throw new Error("[reportId/ doctorId] is missing");
      }

      const isPatientRegisteredUnderDoctor = await this.patientRepository.isPatientRegisteredUnderDoctor(patientId, doctorId);
      if(!isPatientRegisteredUnderDoctor) {
        throw new Error("Patient is not registered under this doctor");
      }

      const response = await this.patientRepository.shareReportWithDoctor(doctorId, patientId, reportId);
      if(!response) {
        throw new Error("Some error occured");
      }

      res.json({
        error: false,
        message: "report shared"
      });
    } catch (error) {
      next(error);
    }
  };

  public createNewReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { predictedDisease } = req.body;
      const patientId = req["user"]["_id"];
      const deviceId = req["deviceId"];

      if (!patientId || !deviceId) {
        throw new Error("[patientId/ deviceId] is missing");
      }

      // service to upload report to s3
      // service to save patient report

      res.json({
        error: false,
        message: "report saved"
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllReports = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patientId = req["user"]["_id"];

      if (!patientId) {
        throw new Error("[patientId] is missing");
      }

      const response = await this.patientRepository.getPatientReports(patientId);
      res.json({
        error: false,
        message: "reports fetched",
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  public registerUnderDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patientId = req["user"]["_id"];

      const { doctorId } = req.body;

      if (!doctorId) {
        throw new Error("[doctorId] is missing");
      }

      await this.patientRepository.registerUnderDoctor(patientId, doctorId);
      res.json({
        error: false,
        message: "registered under doctor"
      });
    } catch (error) {
      next(error);
    }
  };

  public getDoctorRemarksOnReports = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patientId = req["user"]["_id"];

      if (!patientId) {
        throw new Error("[patientId] is missing");
      }

      const response = await this.patientRepository.getDoctorRemarkOnReport(patientId);
      res.json({
        error: false,
        message: "doctor remarks fetched",
        data: response
      });
    } catch (error) {
      next(error);
    }
  };
}
