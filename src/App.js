import {LineChart, Line, XAxis, YAxis} from "recharts";

function App() {
  function convertArrayToObjects(array){
    let objectArray = []
    array.forEach(element => objectArray.push({uv: element}))
    return objectArray
  }

  const data = convertArrayToObjects([1, 2, 3, 5, 4])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <LineChart width={500} height={300} data={data}>
          <XAxis/>
          <YAxis/>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        </LineChart>
      </header>
    </div>
  );
}

export default App;
