let renderer, scene, camera, floor, cube, sphere, light, step = 0, controller, stats;

function createRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('#000000'); //background color
    renderer.setPixelRatio(window.devicePixelRatio || 1); //diff screens
    renderer.shadowMap.enabled = true; //shadows or not. making game realistic
    //console.log(renderer);

    return renderer;
}

//createRenderer();

function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        45, //degree FIELD of VIEW
        window.innerWidth/window.innerHeight, //screen ratio, aspect
        0.1, //near field, default
        1000 //far field, large number
    );
    camera.position.set(-30, 40, 30); // x y z coordinates
    camera.lookAt(0, 0, 0);

    return camera;
}

function createFloor() {
    const floorMaterial = new THREE.MeshLambertMaterial({
        color: '#cfd8dc'
    });

    const floorGeometry = new THREE.BoxGeometry(60, 0.1, 20); //w h d
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    //floor.castShadow = true;
    floor.receiveShadow = true;
    floor.position.set(15, 0, 0);
    
    return floor;
}

//cube
function createBox(x, y, z, color) {
    const cubeMaterial = new THREE.MeshLambertMaterial({
        color,
        //wireframe: true
    });

    const cubeGeometry = new THREE.BoxGeometry(4,4,4);
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.position.set(x,y,z);
    return cube;
}

function createSphere() {
    const sphereMaterial = new THREE.MeshLambertMaterial({
        color: '#039be5',
        //wireframe: true
    });
    const sphereGeometry = new THREE.SphereGeometry(
        4, //radius
        30, //width segment
        30 //height segment
    );

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.position.set(20, 4, 0);
    return sphere;
}

function createLight() {
    const light = new THREE.PointLight('#ffffff'); //lightbulb
    light.castShadow = true;
    light.position.set(10, 60, 10); //change to 10 to check light //60 value
    light.shadow.mapSize.width = 2048; //optional
    light.shadow.mapSize.height = 2048; //optional
    
    return light;
}

function resize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
}

function Controller() {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.05;
}

function addGui() {
    const gui = new dat.GUI();
    gui.add(controller, 'rotationSpeed', 0, 0.3);
    gui.add(controller, 'bouncingSpeed', 0, 0.5);
}

function addStats() {
    const stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    return stats;
}

function animate() {
    stats.update();

    step += controller.bouncingSpeed;

    sphere.position.y = 4 + Math.abs(Math.sin(step) * 10);  //10 is fast
    sphere.position.x = 20 + 10 * Math.cos(step);

    cube.rotation.x += controller.rotationSpeed;
    cube.rotation.y += controller.rotationSpeed;
    cube.rotation.z += controller.rotationSpeed;


    renderer.render(scene, camera);
    requestAnimationFrame(animate); //request for animation, built in for JS
}


function init() {
    //when you load page

    renderer = createRenderer();
    scene = new THREE.Scene();
    camera = createCamera();

    //just for checking
    const axes = new THREE.AxesHelper(100);
    scene.add(axes);

    floor = createFloor();
    scene.add(floor);

    cube = createBox(-4, 4, 0, '#ff8f00');
    scene.add(cube);

    sphere = createSphere();
    scene.add(sphere);

    light = createLight();
    scene.add(light);

    const pointLightHelper = new THREE.PointLightHelper(light);
    scene.add(pointLightHelper);

    controller = new Controller();
    const gui = addGui(controller);

    const controls = new THREE.OrbitControls(
        camera,
        renderer.domElement
    );

    stats = addStats();
    document.getElementById('stats').appendChild(stats.domElement);

    document.body.appendChild(renderer.domElement); //canvas

    //renderer.render(scene, camera);

    animate();
}

window.onload = init();
window.addEventListener('resize', resize);