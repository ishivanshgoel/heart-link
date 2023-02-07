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

      delete patient.password;
      const token = generateJwtToken(patient);
      patient["token"] = token;

      res.json({
        error: false,
        message: "login success",
        data: patient,
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

      if (!reportId || !doctorId || !patientId) {
        throw new Error("[reportId/ doctorId/ patientId] is missing");
      }

      // service to share report with doctor

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

      if (!patientId) {
        throw new Error("[patientId] is missing");
      }

      // service to upload report to s3
      // service to save patient report
      
      res.json({
        error: false,
        message: "report shared"
      });
    } catch (error) {
      next(error);
    }
  };

}
