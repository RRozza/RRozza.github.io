var mx_webgl = function () {
    var _camera = null;
    var _scene = null;
    var _renderer = null;
    var _controls = null;
    var _running = false;

    var _focal = 1;

    var render = function () {
        _renderer.render(_scene, _camera);
    };

    var animate = function () {
        requestAnimationFrame(animate);

        _controls.update();

        render();
    };

    this.camera = function () {
        return _camera;
    };

    this.scene = function () {
        return _scene;
    };

    this.renderer = function () {
        return _renderer;
    };

    this.setCamera = function (data) {
        if (_camera !== null)
            return;

        var filmSize = 27;
        var focalLength = 35;
        var fov = 2.0*180.0/Math.PI*Math.atan(0.5*filmSize/focalLength);

        _camera = new THREE.PerspectiveCamera(fov,  window.innerWidth/window.innerHeight, 0.02, 1000);
        _camera.position.set(data.origin[0], data.origin[1], data.origin[2]);

        var target = new THREE.Vector3(data.target[0], data.target[1], data.target[2]);
        _camera.lookAt(target);

        _focal = _camera.position.distanceTo(target);

        _controls = new THREE.OrbitControls(_camera);
        _controls.addEventListener('change', render);

        animate();
    };

    this.loadEntity = function (name) {
        var texLoader = new THREE.TextureLoader();
        texLoader.load(name + '.png', function(tex) {
            var material = new THREE.MeshBasicMaterial({ map: tex });
            var objLoader = new THREE.OBJLoader();
            objLoader.load(name + '.obj', function(obj) {
                var mesh = obj.children[0];
                mesh.material = material;
                _scene.add(mesh);
            });
        });
    };

    this.init = function () {
        if (_running)
            return;

        _running = true;

        _scene = new THREE.Scene();

        var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
        _scene.add(ambientLight);

        var canvas = document.getElementById('webgl');
        _renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        _renderer.setPixelRatio(1);
        _renderer.setSize(window.innerWidth, window.innerHeight, true);
        _renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        _renderer.setClearColor(0x000000, 0);
    };

};
