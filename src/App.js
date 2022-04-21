import {XAxis, YAxis, Area, Label, ComposedChart, Line, Legend} from "recharts";
import {Box, Dialog, Slider} from "@mui/material";
import React from "react";
import Sensor from "./sensor"
import Display from "./display";

const serverAddress = "http://localhost:3000"
const textColor = "#6B7280"
const graphColor = "#ffffff"
const maxValueColor = "#ffdd00"
const currentValueColor = "#6faeff"
const sensor = new Sensor(serverAddress)
const display = new Display(serverAddress)

function App() {
    const [hundredValues, setHundredValues] = React.useState([])
    const [displayBrightnessRange, setDisplayBrightnessRange] = React.useState([10, 100])
    const [sensorBrightnessRange, setSensorBrightnessRange] = React.useState([1, 500])

    React.useEffect(() => {
        Promise.all([
            sensor.getHundredValues(),
            sensor.getMaxBrightness(),
            sensor.getCurrentBrightness(),
            display.getMaxThreshold(),
            display.getMinThreshold(),
            display.getMaxBrightness(),
            display.getMinBrightness(),
        ]).then((results) => {
            const hundredValues = String(results[0].data).split(/(\s+)/).filter(e => e.trim().length > 0)
            const maxBrightness = results[1].data
            const currentSensorLevel = results[2].data
            setSensorBrightnessRange([results[4].data, results[3].data])
            setDisplayBrightnessRange([results[6].data, results[5].data])
            setHundredValues(convertArrayToObjects(hundredValues, maxBrightness, currentSensorLevel))
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
                                onChangeCommitted={(e, value) =>{
                                    display.setMinThreshold(value[0])
                                    display.setMaxThreshold(value[1])
                                }}
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
                                onChangeCommitted={(e, value) => {
                                    display.setMinBrightness(value[0])
                                    display.setMaxBrightness(value[1])
                                }}
                            />
                        </div>
                    </Box>
                </div>
            </header>
        </div>
    );
}

export default App;
