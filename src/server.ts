import express from "express";
import { doctorRouter, patientRouter } from "./router";
import { DbConnector } from "./config/db";

export class Server {
    private readonly app = express();
    private PORT: number;

    constructor(PORT: number, dbUri: string) {
        console.log("connecting to db");
        DbConnector.connect(dbUri).then(() => {
            console.log("connected to DB");
            this.PORT = PORT;
            this.putGlobalMiddleWares();
            this.initiateRoutes();
            this.start();
        }).catch((err) => {
            console.log("Error " + err);
        })
    }

    private putGlobalMiddleWares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private initiateRoutes() {
        this.app.use("/api/v1/patient", patientRouter);
        this.app.use("/api/v1/doctor", doctorRouter);
    }

    private start() {
        this.app.listen(this.PORT, () => {
            console.log("Server" + `Running at PORT: ${this.PORT}`);
        })
    }
}