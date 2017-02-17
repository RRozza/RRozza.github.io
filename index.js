var _scene = null;

var _camera = null;
var _controls = null;
var _renderer = null;

var render = function () {
    _renderer.render(_scene, _camera);
};

var animate = function () {
    requestAnimationFrame(animate);
    _controls.update();
    render();
};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log(JSON.stringify(event));

    var _spinner = new Spinner({ color: '#FFFFFF' });
    _spinner.spin(document.getElementsByTagName('BODY')[0]);

    var _totalObjects = 0;
    var _loadedObjects = 0;

    var _width = 0;
    var _height = 0;
    var _aspect = 0;

    _scene = new THREE.Scene();

    function getParameterByName(name, url) {
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

    var _sceneName = getParameterByName("scene");
    var _viewportSize = 2/*Number(getParameterByName("size"))*/;
    var _materialType = (_sceneName === "Puma") ? "StdWithNormals" : "Full"/*getParameterByName("material")*/;

    switch (_sceneName)
    {
        case "Puma":
            /* RENDERER */
            
            _width = 720;
            _height = 400;
            _aspect = 0.9;

            /* CAMERA */

            loadCamera({
                origin: [0.353, 0.160, 0.068],
                target: [0.006, 0.069, 0.018],
                filmHeight: 20,
                focalLength: 35.6
            });

            /* LIGHTS */
            
            var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0);
            _scene.add(ambientLight);

            /* OBJECTS */

            var mainObjects = [ 
                '505010', '505020', '505030', '505040', '505050', '505060', '505070', 
                '505080', '505090', '5050100', '5050110', '5050120', '5050130', '5050140'
            ];

            mainObjects.forEach(function (name) {
                loadEntity(name, [0.0, 0.0, 0.0], undefined, undefined);
            });
    
            var restObjects = [ 
                '805011', '805022', '805033', '805044', '805055', 
                '805066', '805077', '805088', '805099', '508011',
            ];

            restObjects.forEach(function (name) {
                loadEntity(name, [0.0, 0.0, 0.0], "Basic", undefined);
            });       

            break;

        case "Spheres":
            /* RENDERER */
            
            _width = 720;
            _height = 400;
            _aspect = 0.9;

            /* CAMERA */

            loadCamera({
                origin: [0.411, 0.0768, 0.060],
                target: [0.029, 0.043, 0.010],
                filmHeight: 20,
                focalLength: 35.6
            });

            /* LIGHTS */

            var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0);
            _scene.add(ambientLight);

            /* OBJECTS */

            var mainObjects = [ '505010', '505020', '505030' ];

            mainObjects.forEach(function (name) {
                loadEntity(name, [0.0, 0.0, 0.0], undefined, undefined);
            });
    
            var restObjects = [ '805010' ];

            restObjects.forEach(function (name) {
                loadEntity(name, [0.0, 0.0, 0.0], "Basic", undefined);
            });       

            break;
        
        default:
            alert('Error: Missing scene parameter. Example: index.html?scene=Puma');
            break;
    }

    function loadCamera(data) {
        var fov = 2.0 * 180.0 / Math.PI * Math.atan(0.5 * data.filmHeight / data.focalLength);

        _camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.02, 1000);
        _camera.position.fromArray(data.origin);

        var target = new THREE.Vector3();
        target.fromArray(data.target);
        _camera.lookAt(target);

        _controls = new THREE.OrbitControls(_camera);
        _controls.target.copy(target);
        _controls.enabled = false;
    };

    function loadObj(name, position) {
        var objLoader = new THREE.OBJLoader();
        objLoader.setPath('./images/' + _sceneName + '/objects/');
        objLoader.load(name + '.obj',
            function (obj) {
                _scene.add(obj);

                var mesh = obj.children[0];
                mesh.material = new THREE.MeshBasicMaterial({ 
                    color: Math.random() * 0xFFFFFF, 
                    wireframe: true, 
                    wireframeLinewidth: 2
                });
                mesh.position.fromArray(position);
            },
            function (xhr) {
                if (xhr.lengthComputable) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log(Math.round(percentComplete, 2) + '% downloaded');
                }
            },
            function (xhr) {
                console.log(xhr.error);
            }
        );
    };

    function loadEntity(name, pos, mat, size) {
        _totalObjects++;

        if (pos === undefined)
            pos = [0.0, 0.0, 0.0];

        var loadObject = function (material) {
            var objLoader = new THREE.OBJLoader();
            objLoader.setPath('./images/' + _sceneName + '/objects/');
            objLoader.load(name + '.obj',
                function (obj) {
                    _scene.add(obj);

                    var mesh = obj.children[0];
                    mesh.material = material;
                    mesh.position.fromArray(pos);

                    _loadedObjects++;
                    if (_loadedObjects == _totalObjects)     
                        start();
                },
                function (xhr) {
                    if (xhr.lengthComputable) {
                        var percentComplete = xhr.loaded / xhr.total * 100;
                        console.log(Math.round(percentComplete, 2) + '% downloaded');
                    }
                },
                function (xhr) {
                    console.log(xhr.error);
                }
            );
        };

        var imgType = '.png';
        var texLoader = new THREE.TextureLoader();

        var imgResolution = null;

        if (size !== undefined)
            _viewportSize = size;

        switch (_viewportSize)
        {
            case 0:
                imgResolution = "";
                break;
            case 1:
                imgResolution = "256/";
                break;
            case 2:
                imgResolution = "512/";
                break;
            case 3:
                imgResolution = "1024/";
                break;
            case 4:
                imgResolution = "2048/";
                break;
            default:
                imgResolution = "512/";
                break;
        }

        texLoader.setPath('./images/' + _sceneName + '/baking/' + imgResolution );
        texLoader.load(name + imgType, function (colorMap) {
            var meshMaterial = null;
            
            if (mat !== undefined)
                _materialType = mat;
            
            switch (_materialType)
            {    
                case "Basic":
                    meshMaterial = new THREE.MeshBasicMaterial({ map: colorMap });
                    loadObject(meshMaterial);
                    break;
                case "Lambert":
                    meshMaterial = new THREE.MeshLambertMaterial({ map: colorMap });
                    loadObject(meshMaterial);
                    break;
                case "StdWithoutNormals":
                    meshMaterial = new THREE.MeshStandardMaterial({ map: colorMap });
                    loadObject(meshMaterial);
                    break;
                case "StdWithNormals":
                    texLoader.load(name + 'n' + imgType, function (normalMap) {
                        meshMaterial = new THREE.MeshStandardMaterial({ 
                            map: colorMap, 
                            normalMap: normalMap,
                            roughness: 1.0,
                            metalness: 0.0, 
                        });
                        loadObject(meshMaterial);
                    });
                    break;
                case "Full":
                    console.log("aca");
                    texLoader.load(name + 'n' + imgType, function (normalMap) {
                        texLoader.load(name + 'r' + imgType, function (roughMap) {
                            meshMaterial = new THREE.MeshStandardMaterial({ 
                                map: colorMap, 
                                normalMap: normalMap,
                                roughnessMap: roughMap,
                                metalness: 0.0,                                
                            });
                            loadObject(meshMaterial);
                        });
                    });
                    break;                
                default:
                    meshMaterial = new THREE.MeshBasicMaterial({ 
                        color: Math.random() * 0xFFFFFF, 
                        wireframe: true, 
                        wireframeLinewidth: 2
                    });
                    loadObject(meshMaterial);
                    break;
            }
        });
    };

    var start = function () {
        var canvas = document.getElementById('viewport');
        _renderer = new THREE.WebGLRenderer({ canvas: canvas });     
        _renderer.setPixelRatio(_aspect);
        _renderer.setSize(_width, _height, false);
        _renderer.setViewport(0, 0, _width, _height);
        _renderer.setClearColor(0x000000, 0);

        _controls.enabled = true;
        _controls.addEventListener('change', render);

        _spinner.stop();

        animate();
    }
});