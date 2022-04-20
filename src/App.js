import {AreaChart, XAxis, YAxis, Area} from "recharts";
import axios from "axios";
import React from "react";

const serverAddress = "http://localhost:3000"
const textColor = "#6B7280"
const fillColor = "#dbdbdb"
const buttonStyle = "m-1 border border-gray-500 hover:bg-gray-700 text-gray-500 font-bold py-2 px-4 rounded-full"

function App() {
    const [hundredValues, setHundredValues] = React.useState([])

    React.useEffect(() => {
        axios.get(serverAddress + "/sensor/100")
            .then(res => {
                const array = String(res.data).split(/(\s+)/).filter(e => e.trim().length > 0)
                setHundredValues(convertArrayToObjects(array))
            })
    }, [])

    function convertArrayToObjects(array) {
        let objectArray = []
        array.forEach(element => objectArray.push({name: element.index + 1, x: element}))
        return objectArray
    }

    return (
        <div className="App">
            <header className="App-header min-h-screen bg-gray-800">
                <div className="grid place-items-center">
                    <p className="text-gray-500">Brightness-Control</p>
                    <AreaChart width={500} height={300} data={hundredValues}>
                        <YAxis stroke={textColor}/>
                        <XAxis dataKey="name" stroke={textColor}/>
                        <Area dot={false} type="monotone" dataKey="x" stroke={textColor} fill={fillColor}/>
                    </AreaChart>
                    <div>
                        <button className={buttonStyle}>
                            Set 0.5
                        </button>
                        <button className={buttonStyle}>
                            Set 1.0
                        </button>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
