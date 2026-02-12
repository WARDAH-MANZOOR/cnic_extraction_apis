import cnic from "./cnic/index.js";
export default function (app) {
    app.use("/cnic", cnic);
}
