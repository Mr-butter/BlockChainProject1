import axios from "axios";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={() => {
            axios.post("/").then((res) => {
              console.log(res.data.say);
            });
          }}
        >
          프록시 연결 테스트
        </button>
        <button
          onClick={() => {
            axios
              .post("/users", {
                email: "asd@asd.com",
                nick: "테스트유저",
                password: 1234,
              })
              .then((res) => {
                console.log(res.data.message);
              });
          }}
        >
          유저등록테스트
        </button>
        <button
          onClick={() => {
            axios
              .post("/users/edit", {
                email: "asd@asd.com",
                nick: "닉네임수정",
              })
              .then((res) => {
                console.log(res.data.message);
              });
          }}
        >
          유저수정테스트
        </button>
        <button
          onClick={() => {
            axios
              .post("/users/del", {
                email: "asd@asd.com",
              })
              .then((res) => {
                console.log(res.data.message);
              });
          }}
        >
          유저삭제테스트
        </button>
      </header>
    </div>
  );
}

export default App;
