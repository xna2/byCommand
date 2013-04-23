/*
 * Serve JSON to our AngularJS client
 */

var Bangumi = require('bangumi');
var bgm = new Bangumi({
	app_id: "byCommand"
});

exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};

exports.login = function (req, res) {
	var data = req.body;
	if (data.user){
		var user = data.user;
		var username = data.user.username;
		bgm.collectionByUser(username,{cat:"watching"},function(err,data){
			var result = {user:user,collection:data};
			res.json(result);
		})
	}
	else{
		bgm.auth(data,function(err,json){
			var user = json;
			var username = json.username;
			bgm.collectionByUser(username,{cat:"watching"},function(err,data){
				var result = {user:user,collection:data};
				res.json(result);
			})
		});
	}


};

exports.update = function (req, res) {
	var data = req.body;
	bgm.updateEps(data.id,{watched_eps:data.ep,auth:data.auth},function(err,data){
		res.json(data);
	})

};