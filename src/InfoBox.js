import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, cases, total, active, isRed,isLight, ...props }) {
  console.log("isLight-->", isLight);
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"} ${isLight === "light" ? "infoBox--light" : "infoBox--dark"}`}
    >
      <CardContent>
        <Typography color={`textSecondary ${isLight === "light" ? "infoBox--light" : "infoBox--dark"}`} gutterBottom>
          {title}
        </Typography>
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"} `}>
          {cases}
        </h2>

        <Typography className={`infoBox__total ${isLight === "light" ? "infoBox--light" : "infoBox--dark"}`} color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
