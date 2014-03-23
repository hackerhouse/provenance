var container, stats;

var camera, controls, scene, renderer, texture, material;

var cross;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 500;

    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'change', render );

    scene = new THREE.Scene();

    // world

    var geometry = new THREE.PlaneGeometry(200, 200);
    var texture = []
    for (var i = 0; i<12; i++) {
        texture.push(THREE.ImageUtils.loadTexture( "images/" + Math.ceil(Math.random() * 12 )+".png" ));
    };

    for ( var i = 0; i < 500; i ++ ) {
        material = new THREE.MeshBasicMaterial( { map: texture[Math.ceil(Math.random() * 12 )] } );

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = ( Math.random() - 0.5 ) * 10000;
        mesh.position.y = ( Math.random() - 0.5 ) * 10000;
        mesh.position.z = (200);
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        scene.add( mesh );

    }

    // lights

    light = new THREE.AmbientLight( 0xffffff );
    scene.add( light );


    // renderer

    renderer = new THREE.WebGLRenderer( { antialias: false, alpha: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

function animate() {

    requestAnimationFrame( animate );
    controls.update();

}

function render() {
    renderer.render( scene, camera );
}
