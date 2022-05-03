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

    getSensorIP(){
        return axios.get(this.serverAddress + "/sensor/ip")
    }

    setSensorIP(value){
        axios.post(this.serverAddress + "/sensor/ip", value).then()
    }
}
