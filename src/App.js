import {XAxis, YAxis, Area, Label, ComposedChart} from "recharts";
import {Box, Slider} from "@mui/material";
import axios from "axios";
import React from "react";

const serverAddress = "http://localhost:3000"
const textColor = "#6B7280"
const graphColor = "#ffffff"
const buttonStyle = "m-1 border border-gray-500 hover:bg-gray-700 text-gray-500 font-bold py-2 px-4 rounded-full"

function App() {
    const [hundredValues, setHundredValues] = React.useState([])
    const [brightnessValue, setBrightnessValue] = React.useState(0)

    React.useEffect(() => {
        axios.get(serverAddress + "/sensor/100")
            .then(res => {
                const array = String(res.data).split(/(\s+)/).filter(e => e.trim().length > 0)
                setHundredValues(convertArrayToObjects(array))
            })
        axios.get(serverAddress + "/display/brightness")
            .then(res => {
                const value = res.data * 100
                setBrightnessValue(value)
                console.log("Current brightness value = " + res.data)
            })
    }, [])

    function setBrightness(dataPercent) {
        axios.post(serverAddress + "/display/brightness", dataPercent / 100).then(res => {
            console.log(dataPercent)
        })
    }

    function convertArrayToObjects(array) {
        let objectArray = []
        array.forEach(element => objectArray.push({name: element.index + 1, x: element}))
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
                        <XAxis dataKey="name" stroke={textColor}/>
                        <Area dot={false} type="monotone" dataKey="x" stroke={textColor} fill="url(#brightness)"/>
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
