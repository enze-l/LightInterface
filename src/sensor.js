import axios from "axios";

export default class Sensor {
    constructor(serverAddress) {
        this.serverAddress = serverAddress
    }

    getHundredValues() {
        return axios.get(this.serverAddress + "/sensor/100")
    }

    getDayValues() {
        return axios.get(this.serverAddress + "/sensor/day")
    }

    getCurrentBrightness() {
        return axios.get(this.serverAddress + "/sensor")
    }

    getMaxBrightness() {
        return axios.get(this.serverAddress + "/sensor/max")
    }

    setMinThreshold(value) {
        axios.post(this.serverAddress + "/sensor/threshold/min", value).then()
    }

    getMinThreshold() {
        return axios.get(this.serverAddress + "/sensor/threshold/min")
    }

    setMaxThreshold(value) {
        axios.post(this.serverAddress + "/sensor/threshold/max", value).then()
    }

    getMaxThreshold() {
        return axios.get(this.serverAddress + "/sensor/threshold/max")
    }
}
