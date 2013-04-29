define(['angular', 'services'], function (angular) {


	'use strict';

	/* Controllers */

	return angular.module('myApp.controllers', ['myApp.services'])

		.controller('AppCtrl', ['$scope', '$http', function ($scope, $http) {
		$scope.placeholder = 'login username password';
		var isLoggedIn = false;

		if (localStorage.auth && localStorage.user) {
			$scope.result = '检测账户安全中⋯⋯';
			var user = JSON.parse(localStorage.user);
			var postData = {user:user};
			$http({method:'POST', url:'/bc/api/login', data:postData}).
				success(function (data, status, headers, config) {
					console.log(data);
					list = data.collection;
					$scope.result = '欢迎回来！' + (user.nickname || '');
					isLoggedIn = true;
					$scope.placeholder = "kandao xxx 01";
				}).
				error(function (data, status, headers, config) {
					$scope.result = '啊咧咧，出错了';
				});

			isLoggedIn = true;
		}
		else {
			$scope.result = '请先按照上面的格式登陆';
		}


		var selected;
		var list = [];
		var counter = 0;
		var historyCounter = 0;
		var history = [];
		var avaliableCmds = ['logout', 'login', 'kandao'];

		function getGuess(input) {
			var cmd = input;
			var candidates = [];
			for (var i = 0; i < avaliableCmds.length; i++) {
				if (avaliableCmds[i].substring(0, cmd.length) === cmd) {
					candidates.push(avaliableCmds[i]);
				}
			}
			if (candidates.length === 1) {
				return candidates[0];
			}
			else {
				return null;
			}


		}

		function getATitle() {

			if (counter === list.length) {
				counter = 0;
			}
			if (!list[counter])return '';
			var t = list[counter].name;
			selected = list[counter];
			counter++;

			return t + ' ';

		}

		function prevHistory() {
			if (history.length > 0) {

				if (historyCounter === 0) historyCounter = history.length - 1;
				else {
					historyCounter--;
				}
				return history[historyCounter];

			}


		}

		function nextHistory() {
			if (history.length > 0) {
				if (historyCounter === history.length - 1) historyCounter = 0;
				else {
					historyCounter++;
				}
				return history[historyCounter];

			}
		}


		$scope.handleKeypress = function (e) {
			if (e.which == 9) {
				e.preventDefault();
				e.stopPropagation();
				if ($scope.command.indexOf("kandao") !== -1) {
					$scope.command = 'kandao ' + getATitle();

				}
				else {
					var guess = getGuess($scope.command);
					if (guess) $scope.command = guess;
				}
			}
			else if (e.which === 38) {
				//up
				e.preventDefault();
				e.stopPropagation();
				$scope.command = prevHistory();
			}
			else if (e.which === 40) {
				//down
				e.preventDefault();
				e.stopPropagation();
				$scope.command = nextHistory();
			}
			$scope.$apply();
		};

		$scope.onSubmit = function () {
			var c = $scope.command.split(' ');

			if (c && c.length > 0) {
				var command = c[0];
				switch (command) {
					case 'login':
						$scope.result = '请稍后，B娘抠脚中...';
						if (c.length === 3) {
							var postData = {username:c[1], password:c[2]};
							postData = JSON.stringify(postData);
							$http({method:'POST', url:'/bc/api/login', data:postData}).
								success(function (data, status, headers, config) {
									if (data && data.status && data.status === "error") {
										$scope.result = '啊咧咧，出错了: ' + data.message;
									}
									else {
										list = data.collection;
										$scope.result = '登陆成功！ 请参照上面的格式标记收视进度，记得使用Tab键哦！';
										isLoggedIn = true;
										localStorage.user = JSON.stringify(data.user);
										localStorage.auth = data.user.auth;
										$scope.placeholder = "kandao xxx 01";
									}

								}).
								error(function (data, status, headers, config) {
									$scope.result = '啊咧咧，出错了';
								});

						}
						else {
							$scope.result = '请检查命令格式！';
						}
						break;
					//fall to default
					case 'logout':
						localStorage.removeItem('auth');
						localStorage.removeItem('user');
						$scope.result = " 已成功登出！";
						$scope.placeholder = 'login username password';
						break;

					case 'kandao':
						$scope.result = '正在更新收视记录，请稍后⋯⋯';
						if (!localStorage.auth) {
							$scope.result = '请先登陆！';
							isLoggedIn = false;
							break;
						}
						if (c.length === 3) {
							debugger;
							var postData;
							if (!selected || c[1] !== selected.subject.name) {
								postData = {id:0, ep:parseInt(c[2]), auth:localStorage.auth, name:c[1]};
							}
							else {
								postData = {id:selected.subject.id, ep:parseInt(c[2]), auth:localStorage.auth, name:selected.subject.name};
							}
							postData = JSON.stringify(postData);
							$http({method:'POST', url:'/bc/api/update', data:postData}).
								success(function (data, status, headers, config) {
									if (data && data.status && data.status === "error") {
										$scope.result = '啊咧咧，出错了: ' + data.message;
									}
									else {
										if (data.name){
											$scope.result = '更新成功！看到了 ' + data.name + ' 第 ' + parseInt(c[2]) + ' 话';
										}
										else{
											$scope.result = '更新成功！看到了 ' + selected.subject.name + ' 第 ' + parseInt(c[2]) + ' 话';
										}

										$scope.placeholder = "kandao xxx 01";
									}

								}).
								error(function (data, status, headers, config) {
									$scope.result = '啊咧咧，出错了';
								});
						}
						else {
							$scope.result = '请检查命令格式！';
						}
						break;

					default:
						$scope.result = 'UNKNOWN COMMAND: ' + command;

				}
				if ($scope.command.indexOf('login') === -1) {
					history.push($scope.command);
				}

				historyCounter = 0;
				$scope.command = "";


			}

			return false;


		}


	}])


});

