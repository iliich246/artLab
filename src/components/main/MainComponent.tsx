import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Box, Typography } from "@mui/material";
import * as THREE from "three";
import * as dat from "dat.gui";

import particlePhoto from "@/src/classes/ParticlePhoto/ParticlePhoto";

function MainComponent() {
  const threeContainer = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   const state = {
  //     cubeX: 0.01,
  //     cubeY: 0.01
  //   }
  //   const gui = new dat.GUI();
  //   gui.add(state, 'cubeX', -0.05, 0.05, 0.01);
  //   gui.add(state, 'cubeY', -0.05, 0.05, 0.01);
  //   var scene = new THREE.Scene();
  //   var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  //   var renderer = new THREE.WebGLRenderer();
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  //   // document.body.appendChild( renderer.domElement );
  //   // use ref as a mount point of the Three.js scene instead of the document.body
  //   threeContainer.current && threeContainer.current.appendChild( renderer.domElement );
  //   var geometry = new THREE.BoxGeometry(1, 1, 1);
  //   var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  //   var cube = new THREE.Mesh(geometry, material);
  //   scene.add(cube);
  //   camera.position.z = 5;
  //   var animate = function () {
  //     requestAnimationFrame(animate);
  //     cube.rotation.x += state.cubeX;
  //     cube.rotation.y += state.cubeY;
  //     renderer.render(scene, camera);
  //   };
  //   animate();
    
  // }, []);

  useEffect(() => {
    if (!threeContainer.current) return;

    particlePhoto.setThreeContainer(threeContainer.current);
    particlePhoto.initialization();
  }, []);

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      backgroundColor: "transparent",
    }}>
      <Typography sx={{
        color: "#ccc",
        fontSize: 24
      }}>
        Main
      </Typography>
      <Box 
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
