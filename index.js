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
    var _viewportSize = Number(getParameterByName("size"));
    var _materialType = getParameterByName("material");

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

            var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
            _scene.add(ambientLight);

            var softRightLight = new THREE.RectAreaLight(0xFFFFFF, 0.5, 0.6, 0.45);
            softRightLight.matrixAutoUpdate = true;
            softRightLight.position.set(0.399, 0.218, -0.684);
            softRightLight.rotateY(-0.2 * Math.PI);
            softRightLight.rotateX(0.125 * Math.PI);
            softRightLight.add(new THREE.RectAreaLightHelper(softRightLight));

            var softLeftLight = new THREE.RectAreaLight(0xFFFFFF, 0.4, 0.15, 0.15);
            softLeftLight.matrixAutoUpdate = true;
            softLeftLight.position.set(0.269, 0.693, 0.484);
            softLeftLight.rotateY(1.09 * Math.PI);
            softLeftLight.rotateX(0.32 * Math.PI);
            softLeftLight.add(new THREE.RectAreaLightHelper(softLeftLight));

            var softTopLight = new THREE.RectAreaLight(0xFFFFFF, 0.6, 0.75, 0.75);
            softTopLight.matrixAutoUpdate = true;
            softTopLight.position.set(0.100, 0.835, -0.305);
            softTopLight.rotateZ(-0.12 * Math.PI);
            softTopLight.rotateX(0.44 * Math.PI);
            softTopLight.add(new THREE.RectAreaLightHelper(softTopLight));

            _scene.add(softTopLight);
            _scene.add(softLeftLight);
            _scene.add(softRightLight);

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

        case "Simball":
            /* RESOLUTION */

            _width = 500;
            _height = 500;
            _aspect = 1;

            /* CAMERA */

            loadCamera({
                origin: [0.054, 0.172, -0.559],
                target: [0.006, 0.056, -0.688],
                filmHeight: 24.0,
                focalLength: 35.0
            });

            /* LIGHTS */ 

            var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
            _scene.add(ambientLight);

            var sideLight = new THREE.RectAreaLight(0xFFFFFF, 0.04, 0.135, 0.135, 0.5, 0.5);
            sideLight.matrixAutoUpdate = true;
            sideLight.position.set(-0.385, 0.183, -0.532);
            sideLight.rotateY(0.5 * Math.PI);
            sideLight.add(new THREE.RectAreaLightHelper(sideLight));

            var topLight = new THREE.RectAreaLight(0xFFFFFF, 0.05, 0.56, 0.57, 0.5, 0.5);
            topLight.matrixAutoUpdate = true;
            topLight.position.set(0.195, 0.620, -0.675);
            topLight.rotateX(0.5*Math.PI);
            topLight.add(new THREE.RectAreaLightHelper(topLight));

            _scene.add(sideLight);
            _scene.add(topLight);

            /* OBJECTS */ 

            var mainObjects = [ '505010', '505020' ];
            mainObjects.forEach(function (name) {
                loadEntity(name, [0.0, 0.0, 0.0], undefined, undefined);
            });

            var restObjects = [ '00255', '2550255', '255255255' ];
            restObjects.forEach(function (name) {
                loadEntity(name, [0.0, 0.0, 0.0], "Basic", 0);
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
                            normalScale: new THREE.Vector2(0.5, 0.5)
                        });
                        loadObject(meshMaterial);
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