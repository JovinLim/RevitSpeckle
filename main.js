// import express from 'express';
import { SpeckleLoader } from "./js/SpeckleLoader.js";
import { objectUrl } from "./utils/objectURL.js";
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
// import * as THREE from 'https://unpkg.com/three@0.138.0/build/three.module.js';
// import { OrbitControls } from 'https://unpkg.com/three@0.138.0/examples/jsm/controls/OrbitControls.js';

// const express = require("express");
// const app = express();
// const port = 3000;

// Handling GET / Request
// app.get('/', function (req, res) {
//     res.send("Hello World!, I am server created by expresss");
// })
  
// // Listening to server at port 3000
// app.listen(3000, function () {
//     console.log("server started");
// })
// app.use('/Speckle', express.static('/index.html'));

const heading = document.getElementById('heading');
heading.textContent = 'Text Changed';

//Adding variables
let model_count = 0
const w_fac = 0.992;
const h_fac = 0.80;
let scene, camera, renderer

let speckle_loader = new SpeckleLoader();
init();
loadEnvironment(speckle_loader);


//load speckle stream
function loadEnvironment(loader){
		
    let options = JSON.stringify({
        objectUrl: objectUrl,
    });

    loader.load(options, function(geometry){
        console.log(geometry);

        
        geometry.traverse((child)=>{
        if(child.isMesh){

            child.material = new THREE.MeshLambertMaterial({
                //wireframe: true,
                color: 0xdadada,

            })
            child.castShadow = true;
            child.receiveShadow = true;
        }

        });

        let model_name = "Model "+model_count.toString();
        //TODO: Make special node for speckle models and allow using different objecturl
        // model_node(editor,"Model "+model_count.toString(),{name:model_name});
        model_count++;
        geometry.name = model_name;
        scene.add(geometry);
    }
    
    );


}

function init() {

    // Rhino models are z-up, so set this as the default
    THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);

    // create a scene and a camera
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#3c3c3c');//(1, 1, 1)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
    camera.position.x = 1
    camera.position.y = 1
    camera.position.z = 1
    camera.lookAt(0,0,0)

    // create the renderer and add it to the html
    renderer = new THREE.WebGLRenderer( { antialias: true } )
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth*w_fac, window.innerHeight*h_fac)
    document.body.appendChild(renderer.domElement)

    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.3;
    renderer.shadowMap.enabled = true;

    // add some controls to orbit the camera
    const controls = new OrbitControls(camera, renderer.domElement)
	const skyColor = 0xB1E1FF;
	const groundColor = 0x666666;
	const intensity = 4;
	const light2 = new THREE.HemisphereLight(skyColor, groundColor,intensity);
  scene.add(light2)
    const grid_size = 1;
    const grid_divs = 10;
    const gridHelper = new THREE.GridHelper(grid_size,grid_divs);
    gridHelper.rotation.x=Math.PI/2;
    scene.add(gridHelper);

    // add a directional light
    const directionalLight = new THREE.DirectionalLight( 0xffffff )
    directionalLight.intensity = 1;
    directionalLight.target.position.set(30,40,50);
    scene.add( directionalLight )

    const ptLight = new THREE.PointLight(0xffffff,1,0);
    ptLight.position.set(-200,-200,0);
    //scene.add(ptLight);
    // 
    
    let spotlight = new THREE.SpotLight(0xffa95c,4);
    spotlight.castShadow = true;
    scene.add(spotlight);


    const ambientLight = new THREE.AmbientLight({intensity:0.005})
    //scene.add( ambientLight )

    // handle changes in the window size
    window.addEventListener( 'resize', onWindowResize, false )

    animate()
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth*w_fac, window.innerHeight*h_fac )
    animate()
}

// function to continuously render the scene
function animate() {
    resizeCanvasToDisplaySize();
    requestAnimationFrame(animate)
    renderer.render(scene, camera)

}

function resizeCanvasToDisplaySize(){
    const canvas = renderer.domElement;
  
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
  
    if(canvas.width !== width || canvas.height !== height){
      renderer.setSize(width,height,false);
      camera.aspect = width/height;
      camera.updateProjectionMatrix();
  
    }
  
  }