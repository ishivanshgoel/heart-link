import { Doctor, Patient, DoctorRemarkOnPatientReport, IDoctorRemarkOnPatientReport, PatientRegisteredWithDoctor, Report, Specilaization, IDoctor, IPatient, IPatientRegisteredWithDoctor, IReport, ISpecialization } from "../entity";

export class PatientRepository {

    async registerPatient(email: string, password: string, name: string, deviceId: string) : Promise<IPatient> {
        const newPatient = new Patient({ email, password, name, deviceId });
        await newPatient.save();
        return newPatient;
    }

    async getPatientByEmail(email: string): Promise<IPatient> {
        const patient = await Patient.findOne({ email: email }).exec();
        return patient;
    }

    async getPatientById(patientId: string): Promise<IPatient> {
        const patient = await Patient.findOne({ _id: patientId }).exec();
        return patient;
    }

    async isPatientRegisteredUnderDoctor(patientId: string, doctorId: string): Promise<boolean> {
        const response = await PatientRegisteredWithDoctor.findOne({ patientId, doctorId });
        if(response.approvedByDoctor) {
            return true;
        }
        return false;
    }

    async shareReportWithDoctor(doctorId: string, patientId: string, reportId: string): Promise<boolean> {
        const share = new DoctorRemarkOnPatientReport({ doctorId, reportId, patientId });
        const res = await share.save();
        if(res) return true;
        return false;
    }

    async getPatientReports(patientId: string): Promise<Array<IReport>> {
        const response = await Report.find({ patientId });
        return response;
    }

    async getDoctorRemarkOnReport(patientId: string): Promise<Array<IDoctorRemarkOnPatientReport>> {
        const response = await DoctorRemarkOnPatientReport.find({ patientId });
        return response;
    }

    async registerUnderDoctor(patientId: string, doctorId: string) {
        const response = new PatientRegisteredWithDoctor({ patientId, doctorId });
        await response.save();
    }
}