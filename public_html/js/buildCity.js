

/**
 * Konstruktor von der Klasse BuildCity
 * 
 * @class BuildCity
 * @constructor
 * @returns {BuildCity} liefert die generierte Stadt zurück
 */
function BuildCity() {
    this.scene, this.camera, this.renderer;
    this.light, this.controls;
    this.lastTime;
    this.buildings = 1000;
    this.streetWidth = 20;
    this.buildingPerLine;
    this.buildingWidth = 20;
    this.cityName = "mega City";
    this.skyboxColor = 0xd8e7ff;

    this.generateRenderer();
    this.generateCamera();
    this.generateControls();
    this.generateCity();
    
    // Füllt das Formular mit den Startwerten aus dem Code.
    $('#city-name').html(this.cityName);
    $('#cityName').val(this.cityName);
    $('#buildings').val(this.buildings);
    $('#streetWidth').val(this.streetWidth);
    $('#buildingWidth').val(this.buildingWidth);
}

/**
 * Erstellt die Steuerung der Kamera.
 *
 * @function generateControls
 * @memberOf BuildCity
 * @returns {Void} Funktion liefert keinen Rückgabewert.
 */
BuildCity.prototype.generateControls = function () {
    this.controls = new THREE.FirstPersonControls(this.camera);
    this.controls.movementSpeed = 200;
    this.controls.lookSpeed = 0.1;
    this.controls.lon = 1.0;
    this.controls.lookVertical = true;
};

/**
 * Erstellt die Kamera.
 * 
 * @function generateCamera
 * @memberOf BuildCity
 * @returns {Void} Funktion liefert keinen Rückgabewert.
 */
BuildCity.prototype.generateCamera = function () {
    this.camera = new THREE.PerspectiveCamera(40,
            window.innerWidth / window.innerHeight, 1, 3000);
    this.camera.position.y = 300;
    this.camera.position.z = 0;
    this.camera.position.x = -700;

};

/**
 * Erstellt den Renderer, welcher später die Scene und die Kamera zusammenführt,
 * um ein räumliches Modell zu generieren.
 * 
 * @function generateRenderer
 * @memberOf BuildCity
 * @returns {Void} Funktion liefert keinen Rückgabewert.
 */
BuildCity.prototype.generateRenderer = function () {
    this.renderer = new THREE.WebGLRenderer({antialias: false, alpha: false});
    // Farbe des Himmels
    this.renderer.setClearColor(this.skyboxColor);

    this.renderer.setSize(window.innerWidth, window.innerHeight);


//    this.renderer.domElement.onmouseover = function () {
//        document.activeElement.blur();
//    };
    document.body.appendChild(this.renderer.domElement);
};

/**
 * Belichtungsfarbe
 * 
 * @function generateLight
 * @memberOf BuildCity
 * @returns {Void} Funktion liefert keinen Rückgabewert.
 */
BuildCity.prototype.generateLight = function () {
    this.light = new THREE.HemisphereLight(0xfffff0, 0x101020, 1.25);
    this.light.position.set(0.75, 1, 0.25);
};

/**
 * Generierung der Stadt auf zufälliger Basis.
 * 
 * @function generateCity
 * @memberOf BuildCity
 * @returns {Void} Funktion liefert keinen Rückgabewert.
 */
BuildCity.prototype.generateCity = function () {
    this.scene = new THREE.Scene();
//    this.scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025);

    this.generateLight();
    this.scene.add(this.light);

    // Platten Farbe
    var planeColor = 0x000000;

    this.buildingPerLine = Math.sqrt(this.buildings);
    // Plattengrösse anpassen, damit alle Gebäude darauf passen.
    var planeLength = this.buildingPerLine * (this.buildingWidth + this.streetWidth);
    // Platte erstellen
    // PlaneGeometry: planeLength gibt die Höhe und Breite der Platte an.
    // Mesh: Drahtgittermodel der Platte.
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(planeLength, planeLength),
            new THREE.MeshBasicMaterial({color: planeColor}));
    // Platte wird um 90 Grad gedreht, damit sie horizontal ausgerichet ist.     
    plane.rotation.x = -90 * Math.PI / 180;

    // Platte der scene hinzufügen
    this.scene.add(plane);

    // Grundgebäude erstellen
    var geometry = new THREE.CubeGeometry(this.buildingWidth, this.buildingWidth, this.buildingWidth);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, this.buildingWidth / 2, 0));
    geometry.faces.splice(3, 1);
    geometry.faceVertexUvs[0].splice(3, 1);
    geometry.faceVertexUvs[0][2][0].set(0, 0);
    geometry.faceVertexUvs[0][2][1].set(0, 0);
    geometry.faceVertexUvs[0][2][2].set(0, 0);
    geometry.faceVertexUvs[0][2][3].set(0, 0);

    // Gebäude Geometrie und Gitternetz(Mesh)
    var building = new THREE.Mesh(geometry);
    var city = new THREE.Geometry();

    // Lichter
    var lightBuilding = new THREE.Color(0xffffff);
    var shadow = new THREE.Color(0x303050);

    // Wurzel von Anzahl Gebäude ist gleich Seitenlänge. Siehe Linie 115
    // Die Mitte errechnen wir anhand von Seitelänge geteilt durch 2.
    var x = -(planeLength / 2);
    var z = -(planeLength / 2);
    var line = 0;
    for (var i = 0; i < this.buildings; i++) {
        line++;
        // Zufälliger Farbwert
        var value = 1 - Math.random() * Math.random();
        // Farbe der Gebäudenbelichtung
        var color = new THREE.Color().setRGB(value + Math.random() * 0.1, value, value + Math.random() * 0.1);
        // Die Farbe des Gebäudes wird nach oben hin heller.
        var top = color.clone().multiply(lightBuilding);
        // Die Farbe des Gebäudes wird nach unthen hin dunkler,
        // um "Tiefe" zu erzeugen.
        var bottom = color.clone().multiply(shadow);

        building.position.x = x;
        building.position.z = z;

        if (line < this.buildingPerLine) {
            x += this.streetWidth + this.buildingWidth;
        } else {
            // neue Linie
            z += this.buildingWidth + this.streetWidth;
            x = -(planeLength / 2);
            line = 0;
        }

        var randomBuildingHeight = (Math.random() * Math.random()
                * Math.random() * building.scale.x) * 8 + 8;

        // Höhe der Gebäude setzten.
        building.scale.y = randomBuildingHeight;

        var geometry = building.geometry;

        // Textur erstellen
        for (var j = 0, jl = geometry.faces.length; j < jl; j++) {
            if (j === 2) {
                geometry.faces[ j ].vertexColors = [color, color, color, color];
            } else {
                geometry.faces[ j ].vertexColors = [top, bottom, bottom, top];
            }
        }
        // Führt die Geometrie und das Gitternetz der Gebäuden zusammen.
        THREE.GeometryUtils.merge(city, building);
    }
    var texture = new THREE.Texture(BuildCity.prototype.generateTexture());
    texture.anisotropy = this.renderer.getMaxAnisotropy();
    texture.needsUpdate = true;

    var mesh = new THREE.Mesh(city, new THREE.MeshLambertMaterial({map: texture,
        vertexColors: THREE.VertexColors}));
    this.scene.add(mesh);

    this.lastTime = performance.now();
};

/**
 * Generiert die Texturen für die Gebäude.
 * 
 * @function generateTexture
 * @memberOf BuildCity
 * @returns {buildCity.prototype.generateTexture.canvas|Element} Liefert 
 * die "Zeichenfläche" für den Browser zurück.
 */
BuildCity.prototype.generateTexture = function () {
    // "Zeichenfläche" für die Gebäudentextur
    var textureCanvas = document.createElement('canvas');
    var textureCanvasWidth = textureCanvas.width = 32;
    var textureCanvasHeight = textureCanvas.height = 64;

    // Gibt ein Objekt zurück, das es ermöglicht auf der "Zeichenfläche" zu
    // zeichnen.
    var context = textureCanvas.getContext('2d');

    //Farbe der Gebäudenwand
    context.fillStyle = '#ffffff';

    // Färbt die "Zeichenfläche" vom linken Rand der "Zeichenfläche" aus.
    context.fillRect(0, 0, textureCanvasWidth, textureCanvasHeight);

    // Ertsellen der Fensterfronttextur.
    // Abstände der Fensterfronttexturen auf der y-Achse(höhe).
    for (var y = 2; y < textureCanvasHeight; y += 2) {
        //Abstände der Fensterfronttexturen auf der x-Achse(breite).
        for (var x = 0; x < textureCanvasWidth; x += 2) {
            // Farbe der Fensterfront
            var value = Math.floor(Math.random() * 64);
            context.fillStyle = 'rgb(' + [value, value, value].join(',') + ')';
            context.fillRect(x, y, 2, 1);
        }
    }

    // "Zeichenfläche" für die ganze Szene.
    var canvas = document.createElement('canvas');
    var canvasWidth = canvas.width = 512;
    var canvasHeight = canvas.height = 1024;

    // Gibt ein Objekt zurück, das es ermöglicht auf der "Zeichenfläche" zu
    // zeichnen.
    var context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    // Zeichnet die Gebäudentextur auf die "Zeichenfläche"
    context.drawImage(textureCanvas, 0, 0, canvasWidth, canvasHeight);

    // liefert "Zeichenfläche" zurück
    return canvas;
};

/**
 * Rekursive Funktion, die animation erzeugt.
 * 
 * @function animate
 * @memberOf BuildCity
 * @returns {Void} Funktion liefert keinen Rückgabewert.
 */
BuildCity.prototype.animate = function () {
    requestAnimationFrame(this.animate.bind(this));

    var time = performance.now() / 2000;

    this.controls.update(time - this.lastTime);
    this.renderer.render(this.scene, this.camera);

    this.lastTime = time;
};

/**
 * Nachdem "Rebuild" geklickt wurde, wird diese Funktion aufgerufen, um die
 * entsprechenden Paramater anzupassen, damit die Änderung angewendet werden.
 * 
 * @funtion rebuild
 * @memberOf BuildCity
 * @returns {Void} Funktion liefert keinen Rückgabewert.
 */
BuildCity.prototype.rebuild = function () {
    this.cityName = $('#cityName').val();
    $('#city-name').html(this.cityName);
    this.buildings = parseInt($('#buildings').val());
    this.streetWidth = parseInt($('#streetWidth').val());
    this.buildingWidth = parseInt($('#buildingWidth').val());
    this.skyboxColor = $('#skybox').val();

//    this.renderer.setClearColor(this.skyboxColor);
    this.generateCity();
};

/**
 * Durch diese Funktion wird die Kamerabewegung, mit den Maustasten,
 * deaktiviert.
 * 
 * @funtion disableMouseControls
 * @memberOf BuildCity
 * @returns {Void} Funktion liefert keinen Rückgabewert.
 */
BuildCity.prototype.disableMouseControls = function () {
    this.controls.activeLook = false;
};

/**
 * Durch diese Funktion wird die Kamerabewegung, mit den Maustasten,
 * aktiviert.
 * 
 * @funtion enableMouseControls
 * @memberOf BuildCity
 * @returns {Void} Funktion liefert keinen Rückgabewert.
 */
BuildCity.prototype.enableMouseControls = function () {
    this.controls.activeLook = true;
};

/**
 * Durch diese Funktion wird die Kamerabewegung, mit der Tastatur,
 * deaktiviert.
 * 
 * @funtion disableKeyboardControls
 * @memberOf BuildCity
 * @returns {Void} Funktion liefert keinen Rückgabewert.
 */
BuildCity.prototype.disableKeyboardControls = function () {
    this.controls.keyboardMovement = false;
};

/**
 * Durch diese Funktion wird die Kamerabewegung, mit der Tastatur,
 * aktiviert.
 * 
 * @funtion enableKeyboardControls
 * @memberOf BuildCity
 * @returns {Void} Funktion liefert keinen Rückgabewert.
 */
BuildCity.prototype.enableKeyboardControls = function () {
    this.controls.keyboardMovement = false;
};