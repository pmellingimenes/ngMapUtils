angular.module('ngMapUtils', [])
    .factory('mapUtils', [function() {
        var mapUtils = {
            format: 'image/png',
            bounds: [-89.6, -57.3259, -29.3333, 16.9247],
            projection: new ol.proj.Projection({
                code: 'EPSG:4326',
                units: 'degrees',
                axisOrientation: 'neu'
            }),
            setProjection: function(code, units, axisOrientation) {
                this.projection = new ol.proj.Projection({
                    'code': code,
                    'units': units,
                    'axisOrientation': axisOrientation
                })
            },
            createMap: function(element, layers) {
                var mousePositionControl = new ol.control.MousePosition({
                    className: 'custom-mouse-position',
                    target: document.getElementById('location'),
                    coordinateFormat: ol.coordinate.createStringXY(5),
                    undefinedHTML: '&nbsp;'
                });
                var baseMap = new ol.layer.Group({
                    'title': 'Base maps',
                    layers: [
                        new ol.layer.Tile({
                            title: 'None',
                            type: 'base',
                            visible: false
                        }),
                        new ol.layer.Tile({
                            title: 'Stamen - Terrain',
                            type: 'base',
                            visible: false,
                            source: new ol.source.Stamen({
                                layer: 'terrain'
                            })
                        }),
                        new ol.layer.Tile({
                            title: 'OSM',
                            type: 'base',
                            visible: true,
                            source: new ol.source.OSM()
                        })
                    ]
                });
                var layerSwitcher = new ol.control.LayerSwitcher();
                var baseLayer = [baseMap];
                if (layers) {
                    baseLayer = baseLayer.concat(layers);
                }
                return new ol.Map({
                    controls: ol.control.defaults({
                        attribution: false
                    }).extend([mousePositionControl, layerSwitcher]),
                    target: element,
                    layers: baseLayer,
                    view: new ol.View({
                        projection: this.projection
                    })
                });
            },
            createLayer: function(type, url, layer) {
                if (type == 'wms') {
                    return new ol.layer.Image({
                        source: new ol.source.ImageWMS({
                            ratio: 1,
                            url: url,
                            params: {
                                'FORMAT': this.format,
                                'VERSION': '1.1.1',
                                STYLES: '',
                                LAYERS: layer,
                            }
                        })
                    })
                }
            },
            createOverlay: function(container) {
                return new ol.Overlay( /** @type {olx.OverlayOptions} */ ({
                    element: container,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                }));
            },
            addOverlay: function(map, overlay) {
                map.addOverlay(overlay);
            },
            resizeMap: function(element, map) {
                var resizeElement = document.getElementById(element),
                    resizeCallback = function() {
                        map.updateSize();
                    };
                addResizeListener(resizeElement, resizeCallback);
            },
            fitMap: function(map) {
                map.getView().fit(this.bounds, map.getSize());
            },
            scaleView: function(map) {
                map.getView().on('change:resolution', function(evt) {
                    var resolution = evt.target.get('resolution');
                    var units = map.getView().getProjection().getUnits();
                    var dpi = 25.4 / 0.28;
                    var mpu = ol.proj.METERS_PER_UNIT[units];
                    var scale = resolution * mpu * 39.37 * dpi;
                    if (scale >= 9500 && scale <= 950000) {
                        scale = Math.round(scale / 1000) + "K";
                    } else if (scale >= 950000) {
                        scale = Math.round(scale / 1000000) + "M";
                    } else {
                        scale = Math.round(scale);
                    }
                    document.getElementById('scale').innerHTML = "Scale = 1 : " + scale;
                });
            },
            addLoading: function(layer, mapId) {
                var source = layer.getSource();
                var target = document.getElementById(mapId);
                var spinner = new Spinner().spin(target);
                source.on('imageloadstart', function() {
                    spinner = spinner.spin(target);
                });
                source.on('imageloadend', function() {
                    spinner.stop(target);
                });
                source.on('imageloaderror', function() {
                    spinner.stop(target);
                });
            },
            cqlFilter: function(layer, filter) {
                var filterParams = {
                    'FILTER': filter,
                    'CQL_FILTER': null,
                    'FEATUREID': null
                };
                layer.getSource().updateParams(filterParams);
            }
        };
        return mapUtils;
    }])
    .directive('map', function() {
        var directive = {};
        directive.scope = {
            width: '@',
            height: '@',
            resize: '@',
            addLayer: '&',
            model: '=',
            addLayers: '='
        };
        directive.template = '<div id="map"></div>' +
            '<div id="wrapper"><div id="location"></div><div id="scale"></div></div>';
        directive.link = function(scope, el, attrs, ctrl) {};
        directive.controller = ['$scope', 'mapUtils', function($scope, mapUtils) {
            angular.element(document.querySelector("#map")).css('width', $scope.width);
            angular.element(document.querySelector("#map")).css('height', $scope.height);
            if ($scope.addLayers) {
                var n = $scope.addLayers.length;
                var layers = [];
                for (i = 0; i < n; i++) {
                    var layer = mapUtils.createLayer($scope.addLayers[i].type, $scope.addLayers[i].url, $scope.addLayers[i].layer);
                    if ($scope.addLayers[i].loadingSignal) {
                        mapUtils.addLoading(layer, 'map');
                    }
                    layers.push(layer);
                }
                $scope.model = mapUtils.createMap("map", layers);
            } else {
                $scope.model = mapUtils.createMap("map");
            }
            mapUtils.fitMap($scope.model);
            if ($scope.resize) {
                mapUtils.resizeMap("map", $scope.model);
            }
        }];
        return directive;
    });