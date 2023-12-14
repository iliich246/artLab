import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Box, Typography } from "@mui/material";
import * as THREE from "three";

function MainComponent() {
  const threeContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    threeContainer.current && threeContainer.current.appendChild( renderer.domElement );
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    var animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
    
  }, []);

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      backgroundColor: "#ccc"
    }}>
      <Typography sx={{
        color: "#fff",
        fontSize: 24
      }}>
        Main
      </Typography>
      <Box 
        ref={threeContainer} 
        sx={{
          position: "absolute",
          top: 0,
          height: "100vh"
        }}
      />      
    </Box>
  )
}

export default observer(MainComponent);
