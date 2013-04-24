define(['angular', 'services'], function(angular, services) {
	'use strict';

	/* Directives */
	angular.module('myApp.directives', ['myApp.services'])
		.directive('onKeydown', function ($parse) {
			return function (scope, elm, attrs) {
				//Evaluate the variable that was passed
				//In this case we're just passing a variable that points
				//to a function we'll call each keyup
				var keydownFn = $parse(attrs.onKeydown);
				elm.bind('keydown', function (evt) {
					//$apply makes sure that angular knows
					//we're changing something
					//scope.$apply(function() {
					keydownFn(scope, {$event:evt});
					//});
				});
			};
		});

});