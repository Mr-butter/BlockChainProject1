import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <button onClick={()=>{
                    axios.post("/").then((res) => {
                        console.log(res.data.say);
                    });
                }}>프록시 연결 테스트</button>
            </header>
        </div>
    );
}

export default App;
