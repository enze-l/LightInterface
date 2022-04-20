import {XAxis, YAxis, Area, Label, ComposedChart, Line, Legend} from "recharts";
import {Box, Slider} from "@mui/material";
import axios from "axios";
import React from "react";

const serverAddress = "http://localhost:3000"
const textColor = "#6B7280"
const graphColor = "#ffffff"
const maxValueColor = "#ffdd00"
const currentValueColor = "#6faeff"
const buttonStyle = "m-1 border border-gray-500 hover:bg-gray-700 text-gray-500 font-bold py-2 px-4 rounded-full"

function App() {
    const [hundredValues, setHundredValues] = React.useState([])
    const [brightnessValue, setBrightnessValue] = React.useState(0)

    function getHundredValues() {
        return axios.get(serverAddress + "/sensor/100")
    }

    function getCurrentDisplayBrightness() {
        return axios.get(serverAddress + "/display/brightness")
    }

    function getCurrentSensorBrightness() {
        return axios.get(serverAddress + "/sensor")
    }

    function getMaxBrightness() {
        return axios.get(serverAddress + "/sensor/max")
    }

    React.useEffect(() => {
        Promise.all(
            [getHundredValues(), getCurrentDisplayBrightness(), getMaxBrightness(), getCurrentSensorBrightness()]
        ).then((results) => {
            const hundredValues = String(results[0].data).split(/(\s+)/).filter(e => e.trim().length > 0)
            const currentDisplayBrightness = results[1].data * 100
            const maxBrightness = results[2].data
            const currentSensorLevel = results[3].data
            setHundredValues(
                convertArrayToObjects(hundredValues, maxBrightness, currentSensorLevel)
            )
            setBrightnessValue(currentDisplayBrightness)
        })
    }, [])

    function setBrightness(dataPercent) {
        axios.post(serverAddress + "/display/brightness", dataPercent / 100).then(res => {
            console.log(dataPercent)
        })
    }

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
                        <Legend/>
                        <XAxis dataKey="brightness" stroke={textColor}/>
                        <Area dot={false} type="monotone" dataKey="day" stroke={textColor} fill="url(#brightness)"/>
                        <Line dot={false} type="monotone" dataKey="max" stroke={maxValueColor}/>
                        <Line dot={false} type="monotone" dataKey="current" stroke={currentValueColor}/>
                    </ComposedChart>
                    <Box width={500}>
                        <Slider
                            size="small"
                            min={10}
                            max={100}
                            aria-label="Small"
                            valueLabelDisplay="auto"
                            value={brightnessValue}
                            onChange={(e, value) => setBrightnessValue(value)}
                            onChangeCommitted={(e, value) => setBrightness(value)}
                        />
                    </Box>
                </div>
            </header>
        </div>
    );
}

export default App;
