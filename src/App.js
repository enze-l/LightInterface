import {XAxis, YAxis, Area, Label, ComposedChart, Line, Legend} from "recharts";
import {Box, Slider} from "@mui/material";
import axios from "axios";
import React from "react";

const serverAddress = "http://localhost:3000"
const textColor = "#6B7280"
const graphColor = "#ffffff"
const maxValueColor = "#ffdd00"
const currentValueColor = "#6faeff"

function App() {
    const [hundredValues, setHundredValues] = React.useState([])
    const [displayBrightnessRange, setDisplayBrightnessRange] = React.useState([10, 100])
    const [sensorBrightnessRange, setSensorBrightnessRange] = React.useState([1, 500])

    //sensor values
    function getHundredValues() {
        return axios.get(serverAddress + "/sensor/100")
    }
    function getDayValues() {
        return axios.get(serverAddress + "/sensor/day")
    }
    function getCurrentSensorBrightness() {
        return axios.get(serverAddress + "/sensor")
    }
    function getMaxBrightness() {
        return axios.get(serverAddress + "/sensor/max")
    }
    function setMinThreshold(value){
        axios.post(serverAddress + "/sensor/threshold/min", value).then()
    }
    function getMinThreshold(){
        return axios.get(serverAddress + "/sensor/threshold/min")
    }
    function setMaxThreshold(value){
        axios.post(serverAddress + "/sensor/threshold/max", value).then()
    }
    function getMaxThreshold(){
        return axios.get(serverAddress + "/sensor/threshold/max")
    }

    //client values
    function getDisplayBrightness() {
        return axios.get(serverAddress + "/display/brightness")
    }
    function setDisplayBrightness(dataPercent) {
        axios.post(serverAddress + "/display/brightness", dataPercent[1] / 100).then()
    }
    function getDisplayMin() {
        return axios.get(serverAddress + "/display/min")
    }
    function setDisplayMin(value){
        axios.post(serverAddress + "/display/min", value).then()
    }
    function getDisplayMax() {
        return axios.get(serverAddress + "/display/max")
    }
    function setDisplayMax(value){
        axios.post(serverAddress + "/display/max", value).then()
    }

    

    React.useEffect(() => {
        Promise.all(
            [getHundredValues(), getDisplayBrightness(), getMaxBrightness(), getCurrentSensorBrightness()]
        ).then((results) => {
            const hundredValues = String(results[0].data).split(/(\s+)/).filter(e => e.trim().length > 0)
            const currentDisplayBrightness = results[1].data * 100
            const maxBrightness = results[2].data
            const currentSensorLevel = results[3].data
            setHundredValues(
                convertArrayToObjects(hundredValues, maxBrightness, currentSensorLevel)
            )
            setDisplayBrightnessRange([20, currentDisplayBrightness])
        })
    }, [])

    function convertArrayToObjects(array, max, current) {
        let objectArray = []
        array.forEach(
            element => objectArray.push({brightness: element.day + 1, day: element, current: current, max: max})
        )
        return objectArray
    }

    return (
        <div className="App">
            <header className="App-header min-h-screen bg-gray-800">
                <div className="grid place-items-center">
                    <p className="m-8 mt-9  text-4xl text-gray-500">Brightness-Control</p>
                    <div className="flex flex-row">
                        <ComposedChart width={500} height={300} data={hundredValues}>
                            <defs>
                                <linearGradient id="brightness" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={graphColor} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={graphColor} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <YAxis stroke={textColor}>
                                <Label angle={-90} value="Brightness" fill={textColor} position='insideLeft'
                                       style={{textAnchor: 'middle'}}/>
                            </YAxis>
                            <XAxis dataKey="brightness" stroke={textColor}/>
                            <Area dot={false} type="monotone" dataKey="day" stroke={textColor} fill="url(#brightness)"/>
                            <Line dot={false} type="monotone" dataKey="max" stroke={maxValueColor}/>
                            <Line dot={false} type="monotone" dataKey="current" stroke={currentValueColor}/>
                        </ComposedChart>
                        <div className="pl-8 pb-9 pt-2">
                            <Slider
                                size="small"
                                min={0}
                                max={500}
                                orientation="vertical"
                                aria-label="Small"
                                valueLabelDisplay="auto"
                                value={sensorBrightnessRange}
                                onChange={(e, value) => setSensorBrightnessRange(value)}
                            />
                        </div>
                    </div>
                    <Box width={500}>
                        <div className="pl-9 pr-8">
                            <Slider
                                size="small"
                                min={10}
                                max={100}
                                aria-label="Small"
                                valueLabelDisplay="auto"
                                value={displayBrightnessRange}
                                onChange={(e, value) => setDisplayBrightnessRange(value)}
                                onChangeCommitted={(e, value) => setDisplayBrightness(value)}
                            />
                        </div>
                    </Box>
                </div>
            </header>
        </div>
    );
}

export default App;
