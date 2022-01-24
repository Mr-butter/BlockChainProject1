import { Button, FormControl, OutlinedInput, TextField } from "@mui/material";
import { height, padding } from "@mui/system";
import React from "react";
import styled from "styled-components";

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "grey",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "grey",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gold",
    },
    "&:hover fieldset": {
      borderColor: "yellow",
    },
    "&.Mui-focused fieldset": {
      borderColor: "gold",
    },
  },
});

const Transaction = () => {
  return (
    <div>
      <div className="table-wrapper" style={{ marginBottom: "200px" }}>
        <h2>Create transaction</h2>
        <br />
        <div>
          <div className="col-8" style={{ width: "1100px" }}>
            <div className="card" style={{ width: "900px" }}>
              <div className="card__header">
                <h3>Transfer some money to someone!</h3>
              </div>
              <div className="card__body" style={{ width: "500px" }}>
                <CssTextField
                  label=" From address"
                  //   style={{ width: "800px", height: "50px" }}
                  helperText="This is your wallet address. You cannot change it because you can only spend your own coins."
                  id="demo-helper-text-aligned"
                  style={{
                    marginTop: 11,
                    width: "800px",
                    height: "100px",
                    padding: "10px",
                  }}
                />
                <CssTextField
                  label=" To address"
                  style={{
                    marginTop: 5,
                    width: "800px",
                    height: "100px",
                    padding: "10px",
                  }}
                  helperText="The address of the wallet where you want to send the money to. You can type random text here (if you are not interested in recovering the funds)"
                  id="demo-helper-text-aligned"
                />
                <CssTextField
                  label=" Amount"
                  style={{
                    marginTop: 5,
                    width: "800px",
                    height: "100px",
                    padding: "10px",
                  }}
                  helperText="You can transfer any amount. Account balance is not checked in this demo. Have at it!
                  "
                  id="demo-helper-text-aligned"
                />
              </div>
              <Button
                style={{
                  borderRadius: 10,
                  borderColor: "gold",
                  marginLeft: 30,
                  color: "gold",
                  size: 100,
                  padding: "10px",
                  marginBottom: "25px",
                }}
                // onClick={connect}
                variant="outlined"
              >
                Sign & create transaction
              </Button>
              <h3>Transaction pool</h3>
              <TextField
                defaultValue="No transactions in transaction pool"
                style={{
                  width: "800px",
                  height: "50px",
                  padding: "10px",
                }}
              />
              <div className="card__footer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
