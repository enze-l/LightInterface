import axios from "axios";

export default class Display {
    constructor(serverAddress) {
        this.serverAddress = serverAddress
    }
    getBrightness() {
        return axios.get(this.serverAddress + "/display/brightness")
    }
    setBrightness(dataPercent) {
        axios.post(this.serverAddress + "/display/brightness", dataPercent[1] / 100).then()
    }
    getMinBrightness() {
        return axios.get(this.serverAddress + "/display/min")
    }
    setMinBrightness(value){
        axios.post(this.serverAddress + "/display/min", value).then()
    }
    getMaxBrightness() {
        return axios.get(this.serverAddress + "/display/max")
    }
    setMaxBrightness(value){
        axios.post(this.serverAddress + "/display/max", value).then()
    }
    setMinThreshold(value) {
        axios.post(this.serverAddress + "/display/threshold/min", value).then()
    }

    getMinThreshold() {
        return axios.get(this.serverAddress + "/display/threshold/min")
    }

    setMaxThreshold(value) {
        axios.post(this.serverAddress + "/display/threshold/max", value).then()
    }

    getMaxThreshold() {
        return axios.get(this.serverAddress + "/display/threshold/max")
    }
}