var _sceneName = null;

var _loadedObjects = 0;
var _totalObjects = 0;

var _camera = null;
var _scene = null;
var _renderer = null;
var _controls = null;

var _spinner = new Spinner({ color: '#FFFFFF' });
_spinner.spin(document.getElementsByTagName('BODY')[0]);

function init () {
    _scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.1);
    _scene.add(ambientLight);
    
    var softRightLight = new THREE.RectAreaLight( 0xFFFFFF, 0.8, 0.6, 0.45, 1, 1 );
    softRightLight.matrixAutoUpdate = true;
    softRightLight.position.set( 0.399, 0.218, -0.684 );  
    softRightLight.rotateY(-0.2*Math.PI);
    softRightLight.rotateX(0.125*Math.PI);
    softRightLight.add( new THREE.RectAreaLightHelper(softRightLight) );
    
    var softLeftLight = new THREE.RectAreaLight( 0xFFFFFF, 0.9, 0.15, 0.15, 1, 1 );
    softLeftLight.matrixAutoUpdate = true;
    softLeftLight.position.set( 0.269, 0.693, 0.484 );  
    softLeftLight.rotateY(1.09*Math.PI);
    softLeftLight.rotateX(0.32*Math.PI);
    softLeftLight.add( new THREE.RectAreaLightHelper(softLeftLight) );

    var softTopLight = new THREE.RectAreaLight( 0xFFFFFF, 0.4, 0.75, 0.75, 1, 1 );
    softTopLight.matrixAutoUpdate = true;
    softTopLight.position.set( 0.100, 0.835, -0.305) ;  
    softTopLight.rotateZ(-0.12*Math.PI);
    softTopLight.rotateX(0.44*Math.PI);
    softTopLight.add( new THREE.RectAreaLightHelper(softTopLight) );

    _scene.add( softTopLight );
    _scene.add( softLeftLight );
    _scene.add( softRightLight );
    
    var canvas = document.getElementById('webgl');
    _renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    _renderer.setPixelRatio(1);
    _renderer.setSize(window.innerWidth, window.innerHeight, true);
    _renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    _renderer.setClearColor(0x000000, 0);
};

var render = function () {
    _renderer.render(_scene, _camera);
};

var animate = function () {
    requestAnimationFrame(animate);
    _controls.update();
    render();
};

function setCamera (data) {
    var fov = 2.0*180.0/Math.PI*Math.atan(0.5*data.filmHeight/data.focalLength);

    _camera = new THREE.PerspectiveCamera(fov,  window.innerWidth/window.innerHeight, 0.02, 1000);
    _camera.position.fromArray(data.origin);

    var target = new THREE.Vector3();
    target.fromArray(data.target);
    _camera.lookAt(target);

    _controls = new THREE.OrbitControls(_camera);
    _controls.target.copy(target);
    _controls.addEventListener('change', render);
    _controls.enabled = false;

    animate();
};

/* loadEntity( obj file, position (absolute), maxwell channels, use normal channel) */
function loadEntity (name, pos, channels, useNormals) {
    _totalObjects++;

    if (pos === undefined)
        pos = [0.0, 0.0, 0.0];

    var loadObject = function (material) {
        var objLoader = new THREE.OBJLoader();
        objLoader.setPath( './images/' + _sceneName + '/objects/' );
        objLoader.load( name + '.obj', 
            function ( obj ) {
                _scene.add( obj );
                
                var mesh = obj.children[0];
                mesh.material = material;
                mesh.position.fromArray(pos);

                _loadedObjects++;
                if (_loadedObjects == _totalObjects) {
                    _controls.enabled = true;
                    _spinner.stop();
                }
            }, 
            function ( xhr ) {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            }, 
            function ( xhr ) {
                console.log( xhr.error );
            }
        );
    };

    if (useNormals) {

        var texLoader = new THREE.TextureLoader();
        texLoader.setPath( './images/' + _sceneName + '/baking/' );
        texLoader.load(name + '.png', function(colorMap) {
            
            texLoader.load(name + 'n.png', function(normalMap) {
                
                var material = new THREE.MeshStandardMaterial({ 
                    map: colorMap, 
                    normalMap: normalMap 
                });
                
                loadObject(material);
            });
        });

    } else {

        var texLoader = new THREE.TextureLoader();
        texLoader.setPath( './images/' + _sceneName + '/baking/' );
        texLoader.load( name + '.png', function( colorMap ) {
            
            var material = new THREE.MeshBasicMaterial({ map: colorMap });

            loadObject(material);
        });

    }
};

function getParameterByName (name, url) {
    if (!url)
        url = window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);

    if (!results)
        return null;

    if (!results[2])
        return '';

    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

init();

_sceneName = getParameterByName("scene");

/* Puma */
if (_sceneName === "Puma") {
    [
        /* Zapatilla */
        '505010', '505020', '505030', '505040', '505050', '505060',
        '505070', '505080', '505090', '5050100', '5050110', '5050120',
        '5050130', '5050140'     
    ].forEach(function (name) {
        loadEntity(name, [0.0, 0.0, 0.0], undefined, true);
    });

    [   
        /* Pespuntes y Escenario */
        '805011', '805022', '805033', '805044', '805055', '805066',
        '805077', '805088', '805099', '508011'        
    ].forEach(function (name) {
        loadEntity(name, [0.0, 0.0, 0.0], undefined, false);
    });

    setCamera({ 
        origin: [0.353, 0.160, 0.068], 
        target: [0.006, 0.069, 0.018],
        filmHeight: 20,
        focalLength: 35.6  
    });
}
