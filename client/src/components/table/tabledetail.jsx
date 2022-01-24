import React, { useEffect } from "react";

const tabledetail = (props) => {
  //   useEffect(() => {
  //     console.log(props.dataShow);
  //   }, [props]);

  return (
    <div className="table-wrapper">
      <table>
        {props.headData && props.renderHead ? (
          <thead>
            <tr>
              {props.headData.map((item, index) =>
                props.renderHead(item, index)
              )}
            </tr>
          </thead>
        ) : null}
        {props.bodyData && props.renderBody ? (
          <tbody>
            {/* {dataShow.map((item, index) => props.renderBody(item, index))} */}
          </tbody>
        ) : null}
      </table>
    </div>
  );
};

export default tabledetail;
