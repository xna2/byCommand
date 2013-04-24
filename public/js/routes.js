define(['angular', 'app'], function(angular, app) {
	'use strict';

	return app.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
		$routeProvider.when('/view1', {
			templateUrl: 'partial/1',
			controller: 'MyCtrl1'
		});
		$routeProvider.when('/view2', {
			templateUrl: 'partial/1',
			controller: 'MyCtrl2'
		});
		$routeProvider.otherwise({redirectTo: '/'});
		$locationProvider.html5Mode(true);
	}]);

});