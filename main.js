import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5); // Set camera position

// Create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Add a basic ambient light
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

// Add a directional light from above
const topLight = new THREE.DirectionalLight(0xffffff, 4);
topLight.position.set(0, 2, 0).normalize(); // Position the light above the model
scene.add(topLight);

// Add a directional light from forward
const forcLight = new THREE.DirectionalLight(0xffffff, 4);
topLight.position.set(0, 5, 10).normalize(); // Position the light above the model
scene.add(forcLight);
// Load the 3D model



const loader = new GLTFLoader();
let model;
loader.load(
    '/bmw/scene.gltf', // Adjust this path based on your setup
    function (gltf) {
        model = gltf.scene;
        scene.add(model);

        // Optionally adjust the model's position and scale
        model.position.set(0, 2, 0);
        model.scale.set(1, 1, 1);

        // Render the scene
        renderer.render(scene, camera);
    },
    undefined,
    function (error) {
        console.error('An error occurred:', error);
    }
);

// Mouse position
const mouse = new THREE.Vector2();

// Handle mouse movement
document.addEventListener('mousemove', (event) => {
    // Normalize mouse coordinates to [-1, 1]
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);

    if (model) {
        // Convert mouse position to 3D world coordinates
        const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5); // 0.5 is the depth, adjust as needed
        vector.unproject(camera); // Project the vector from NDC to world space

        // Calculate direction
        const dir = vector.sub(camera.position).normalize();

        // Create a point for the model to look at
        const lookAtPosition = camera.position.clone().add(dir.multiplyScalar(2)); // Adjust distance as needed

        // Rotate the model to face the lookAtPosition
        model.lookAt(lookAtPosition);
    }

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
