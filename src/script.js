import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { makeSpiral } from './spiral'

// UI functionality

const outputTag = document.querySelector('output');
const slider = document.getElementById('slider');

const description = document.getElementById('description')

slider.addEventListener('input', (e) => {
    outputTag.innerHTML = e.target.value
})

const sliderForm = document.getElementById("sliderForm")
sliderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    description.innerHTML = ""
    const value = Number(slider.value)
    runCreationScript(value)
});

//Function

function runCreationScript(N) {

    // Canvas

    const canvas = document.querySelector('canvas.webgl')

    // Sizes

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    
    // Renderer

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    })
    renderer.setSize(sizes.width, sizes.height)

    // Scene
    const scene = new THREE.Scene()


    // Lights

    const pointLight1 = new THREE.PointLight(0xffffff, 1, 0)
    scene.add(pointLight1)
    pointLight1.position.z = 3

    const pointLight2 = new THREE.PointLight(0xffffff, 0.6, 0)
    scene.add(pointLight2)
    pointLight2.position.z = 2
    pointLight2.position.y = -2

    const pointLight3 = new THREE.PointLight(0xff0000, 0.5, 0)
    scene.add(pointLight3)
    pointLight2.position.z = 200
    pointLight2.position.y = 200
        
    const light = new THREE.HemisphereLight( 0xffffff, 0x000000, 0.6 ); 
    scene.add( light );

    // Camera

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
    camera.position.z = 3
    camera.position.y = 2
    scene.add(camera)

    // Controls

    const controls = new OrbitControls( camera, renderer.domElement );

    // Objects

    const createCube = (position) => {
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshLambertMaterial( { color: 0xaaff00 } );
        const mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = position[0]
        mesh.position.y = position[1]
        mesh.position.z = position[2]
        scene.add( mesh );
    }

    const make3DSpiral = (spiralResolution) => {
        const spiral = makeSpiral(spiralResolution)
        spiral.forEach((row) => {row.forEach((element => createCube([element[0],element[1],(element[2])/spiralResolution])))})
        
        controls.target.set(spiralResolution / 2, spiralResolution / 2, spiralResolution / 2)
        camera.position.set(spiralResolution / 2, spiralResolution / 2, (spiralResolution / 2) - spiralResolution)
    }

    make3DSpiral(N)

    // Animations

    function animate() {

        requestAnimationFrame( animate );
        
        // required if controls.enableDamping or controls.autoRotate are set to true
        
        controls.update();

        renderer.render( scene, camera );

    }
    renderer.clear()
    animate()

}

