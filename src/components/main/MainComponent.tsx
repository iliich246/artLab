import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Box, Typography } from "@mui/material";
import * as THREE from "three";
import * as dat from "dat.gui";

import interactiveParticles from "@/src/classes/InteractiveParticles/InteractiveParticles";
import particleText from "@/src/classes/ParticleText/ParticleText";


function MainComponent() {
  const threeContainer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  // 1. Test of interactiveParticles
  // useEffect(() => {
  //   if (!threeContainer.current) return;

  //   interactiveParticles.setThreeContainer(threeContainer.current);
  //   //interactiveParticles.setC(canvas.current as HTMLCanvasElement);
  //   interactiveParticles.initialization();
  // }, []);

  // 2. Test of particleText
  useEffect(() => {
    if (!threeContainer.current) return;

    particleText.setThreeContainer(threeContainer.current);
    particleText.initialization();
    
  }, []);

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      backgroundColor: "transparent",
    }}>
      <Box 
        id="three-container"
        ref={threeContainer} 
        sx={{
          position: "absolute",
          top: 0,
          height: "100vh",
          zIndex: -1
        }}
      />
    </Box>
  )
}
export default observer(MainComponent);
