# ngMapUtils
Map utils to use OpenLayers(v4.2.0) in AngularJS way

# Dependencies 
The ngMapUtils project has the following dependencies: openlayers(v4.2.0), ol3-layerswitcher(v1.1.0), AngularJS(v1.6.4), javascript-detect-element-resize (v0.5.3) and spin.js (v2.3.2). You can import them in your html file as the follow example:

```html
<link rel="stylesheet" type="text/css" href="../bower_components/openlayers/ol.css">
<link rel="stylesheet" type="text/css" href="../bower_components/ol3-layerswitcher/src/ol3-layerswitcher.css">
<script src="../bower_components/angular/angular.min.js" type="application/javascript"></script>
<script src="../bower_components/openlayers/ol.js" type="application/javascript"></script>
<script src="../bower_components/ol3-layerswitcher/src/ol3-layerswitcher.js" type="application/javascript"></script>
<script src="../bower_components/javascript-detect-element-resize/detect-element-resize.js" type="application/javascript"></script>
<script src="../bower_components/spin.js/spin.min.js" type="application/javascript"></script>
 ```
# Basic Usage
First off all, you need to insert 'ngMapUtils' module into your app as the example below:

```javascript
var app = angular.module('myApp', ['ngMapUtils']);
```

After this you can use the <map> directive into your html file:

```html
<map width="100%" heigth="100%" model="map" resize="true" />
```
If you use frameworks like bootstrap it’s reasonable to set the resize attribute to ‘true’.
Don't forget to initialize the 'model' attribute in your controller:

```javascript
app.controller('myController', ['$scope', function($scope) {
    $scope.map = {}
}]);
```
Please check the examples/example01.html file to a better understanding