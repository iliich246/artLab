"use client";
import React, { useEffect } from "react";
import Image from 'next/image';
import { Box, Grid } from "@mui/material";
import MainComponent from "@/src/components/main/MainComponent";
import TWEEN from "@tweenjs/tween.js";

export default function Home() {  
  useEffect(() => {
    let myReq: number;
    const animationLoop = () => {
      myReq = requestAnimationFrame(animationLoop);
      TWEEN.update();    
    }

    animationLoop();

    return () => {
      cancelAnimationFrame(myReq);
    }
  }, []);

  return (
    <Grid 
      container 
      component="main" 
      sx={{
        p: 0,
        height: "100vh"  
      }}
    >
      <MainComponent />
    </Grid>
  )
}
