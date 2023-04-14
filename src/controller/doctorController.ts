import { NextFunction, Request, Response } from "express";
import { DoctorRepository } from "../repository";
import { IDoctor } from "../entity";
import { veriftyJwtToken, generateJwtToken } from "../util";

export class DoctorController {
  private doctorRepository: DoctorRepository = new DoctorRepository();

  public registerNewDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password, name, address, specialization } = req.body;
      if (!email || !password || !name || !address || !specialization) {
        throw new Error(
          "[email/ password/ name/ address/ specialization] is missing"
        );
      }
      await this.doctorRepository.registerDoctor(
        email,
        password,
        name,
        address,
        specialization
      );
      res.json({
        error: false,
        message: "doctor registered",
      });
    } catch (error) {
      next(error);
    }
  };

  public loginDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new Error("[email/ password] is missing");
      }
      const doctor: IDoctor = await this.doctorRepository.getDoctorByEmail(
        email
      );
      
      if (!doctor) {
        throw new Error("Invalid email/ password");
      }

      if (doctor.password !== password.trim()) {
        throw new Error("Invalid email/ password");
      }

      doctor.password = undefined;

      const payload = {
        _id: doctor["_id"],
        email: doctor.email,
        name: doctor.name,
        specialization: doctor.specialization
      }
      const token = generateJwtToken(payload);

      res.json({
        error: false,
        message: "login success",
        doctor: doctor,
        token: token
      });
    } catch (error) {
      next(error);
    }
  };

  public getPatientReports = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctorId = req["user"]["_id"];
      
      const reports = await this.doctorRepository.getPatientReportsRegisteredUnderDoctor(doctorId);
      res.json({
        error: false,
        message: "reports fetched",
        data: reports
      });
    } catch (error) {
      next(error);
    }
  };

  public provideRemarkOnPatientReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { reportId, consultingRequired, note, firstAidNote } = req.body;
      const doctorId = req["user"]["_id"];

      if(!reportId || !doctorId) {
        throw new Error("[reportId/ doctorId is missing]");
      }
      const response = await this.doctorRepository.provideRemarkOnPatientReport(doctorId, reportId, consultingRequired, note, firstAidNote);
      if(!response) {
        throw new Error("Some error occured");
      }
      res.json({
        error: false,
        message: "remark added"
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllDoctors = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctors = await this.doctorRepository.getAllDoctorsList();
      res.json({
        error: false,
        message: "remark added",
        data: doctors
      });
    } catch (error) {
      next(error);
    }
  };

  public getNewPatientRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctorId = req["user"]["_id"];
      const requests = await this.doctorRepository.getPatientRequests(doctorId);
      res.json({
        error: false,
        message: "remark added",
        data: requests
      });
    } catch (error) {
      next(error);
    }
  };

  public approvePatientRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctorId = req["user"]["_id"];
      const { patientId } = req.body;
      const response = await this.doctorRepository.approvePatientRequests(doctorId, patientId);
      if(!response) {
        throw new Error("Some error occured");
      }
      res.json({
        error: false,
        message: "success"
      });
    } catch (error) {
      next(error);
    }
  };

  public getRegisteredPatients = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctorId = req["user"]["_id"];
      const response = await this.doctorRepository.getRegisteredPatients(doctorId);
      if(!response) {
        throw new Error("Some error occured");
      }
      res.json({
        error: false,
        message: "success"
      });
    } catch (error) {
      next(error);
    }
  };

}
