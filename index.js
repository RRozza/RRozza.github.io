var _scene = null;

var _camera = null;
var _controls = null;
var _renderer = null;

var render = function () {
    var width = _renderer.domElement.clientWidth;
    var height = _renderer.domElement.clientHeight;

    var widthThreeJS = Math.floor(width * window.devicePixelRatio);
    var heightThreeJS = Math.floor(height * window.devicePixelRatio);

    if (_renderer.domElement.width !== widthThreeJS || _renderer.domElement.height !== heightThreeJS)
        _renderer.setSize( width, height, false );

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

    _scene = new THREE.Scene();

    var _sceneName = getParameterByName("scene");
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

            var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
            _scene.add(ambientLight);

            var softRightLight = new THREE.RectAreaLight(0xFFFFFF, 0.8, 0.6, 0.45, 1, 1);
            softRightLight.matrixAutoUpdate = true;
            softRightLight.position.set(0.399, 0.218, -0.684);
            softRightLight.rotateY(-0.2 * Math.PI);
            softRightLight.rotateX(0.125 * Math.PI);
            softRightLight.add(new THREE.RectAreaLightHelper(softRightLight));

            var softLeftLight = new THREE.RectAreaLight(0xFFFFFF, 0.9, 0.15, 0.15, 1, 1);
            softLeftLight.matrixAutoUpdate = true;
            softLeftLight.position.set(0.269, 0.693, 0.484);
            softLeftLight.rotateY(1.09 * Math.PI);
            softLeftLight.rotateX(0.32 * Math.PI);
            softLeftLight.add(new THREE.RectAreaLightHelper(softLeftLight));

            var softTopLight = new THREE.RectAreaLight(0xFFFFFF, 0.4, 0.75, 0.75, 1, 1);
            softTopLight.matrixAutoUpdate = true;
            softTopLight.position.set(0.100, 0.835, -0.305);
            softTopLight.rotateZ(-0.12 * Math.PI);
            softTopLight.rotateX(0.44 * Math.PI);
            softTopLight.add(new THREE.RectAreaLightHelper(softTopLight));

            _scene.add(softTopLight);
            _scene.add(softLeftLight);
            _scene.add(softRightLight);

            /* OBJECTS */

            var stdWithNormals = [ '505010', '505040', '505050', '505060', '505070', '505080', '505090', '5050100', '505030' ];  
            stdWithNormals.forEach(function (name) {
                loadEntity(name, [0.0, 0.0, 0.0], undefined, 2);
            });
            
            var stdWithoutNormals = [ '505020', '5050110', '5050120', '5050140' ];
            stdWithoutNormals.forEach(function (name) {
                loadEntity(name, [0.0, 0.0, 0.0], undefined, 1);
            });

            var basicWithoutNormals = [ '805011', '805022', '805033', '805044', '805055', '805066', '805077', '805088', '805099', '508011' ];
            basicWithoutNormals.forEach(function (name) {
                loadEntity(name, [0.0, 0.0, 0.0], undefined, 0);
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

            var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
            _scene.add(ambientLight);

            var sideLight = new THREE.RectAreaLight(0xFFFFFF, 0.3, 0.135, 0.135, 0.5, 0.5);
            sideLight.matrixAutoUpdate = true;
            sideLight.position.set(-0.385, 0.183, -0.532);
            sideLight.rotateY(0.5 * Math.PI);
            sideLight.add(new THREE.RectAreaLightHelper(sideLight));

            var topLight = new THREE.RectAreaLight(0xFFFFFF, 0.2, 0.56, 0.57, 0.5, 0.5);
            topLight.matrixAutoUpdate = true;
            topLight.position.set(0.195, 0.620, -0.675);
            topLight.rotateX(0.5*Math.PI);
            topLight.add(new THREE.RectAreaLightHelper(topLight));

            _scene.add(sideLight);
            _scene.add(topLight);

            /* OBJECTS */ 

            var objWithNormals = [ '25500', '02550' ];            
            objWithNormals.forEach(function (name) {
                loadEntity(name, [0.0, 0.0, 0.0], undefined, true);
            });

            var objWithoutNormals = [ '00255', '2550255', '255255255'];
            objWithoutNormals.forEach(function (name) {
                loadEntity(name, [0.0, 0.0, 0.0], undefined, false);
            });
            break;

        default:
            alert('Error: Missing scene parameter. Example: index.html?scene=Puma')
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

    function loadEntity(name, pos, channels, matType) {
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
        switch (matType)
        {
            case 0:
                /* Color channel */
                var texLoader = new THREE.TextureLoader();
                texLoader.setPath('./images/' + _sceneName + '/baking/');
                texLoader.load(name + imgType, function (colorMap) {
                    var material = new THREE.MeshBasicMaterial({ map: colorMap });
                    loadObject(material);
                });
                break;
            case 1:
                /* Color channel */
                var texLoader = new THREE.TextureLoader();
                texLoader.setPath('./images/' + _sceneName + '/baking/');
                texLoader.load(name + imgType, function (colorMap) {
                    var material = new THREE.MeshStandardMaterial({ map: colorMap });
                    loadObject(material);
                });
                break;
            case 2:
                /* Color & Normals channels */
                var texLoader = new THREE.TextureLoader();
                texLoader.setPath('./images/' + _sceneName + '/baking/');
                texLoader.load(name + imgType, function (colorMap) {
                    texLoader.load(name + 'n' + imgType, function (normalMap) {
                        var material = new THREE.MeshStandardMaterial({ 
                            map: colorMap, 
                            normalMap: normalMap,
                            normalScale: new THREE.Vector2(0.5, 0.5)
                        });
                        loadObject(material);
                    });
                });
                break;
            default:
                break;
        }
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