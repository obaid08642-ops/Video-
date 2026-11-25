import React from "react";
import { AbsoluteFill } from "remotion";
import { Paper } from "../components/Frame";
import { Pylori3D } from "./Pylori3D";
export const Proto3D: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#EFE6D6" }}>
    <Paper />
    <div style={{ position: "absolute", left: 0, top: 420 }}><Pylori3D /></div>
  </AbsoluteFill>
);
