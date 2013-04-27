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
			if (!data){
				res.json({status:"error",message:"该用户没有任何在看的条目"}) ;
			}
			else{
				var result = {status:"success",user:user,collection:data};
				res.json(result);
			}
		})
	}
	else{
		bgm.auth(data,function(err,json){
			if (err){
				res.json({status:"error",message:"和服务器的通讯出现问题"}) ;
			}
			else{
				if (json && json.code && json.code === 401) {
					res.json({status:"error",message:"用户名或密码不正确"}) ;
				}
				else{
					console.log(json);
					var user = json;
					var username = json.username;
					bgm.collectionByUser(username,{cat:"watching"},function(err,data){
						if (!data){
							res.json({status:"error",message:"该用户没有任何在看的条目"}) ;
						}
						else{
							var result = {status:"success",user:user,collection:data};
							res.json(result);
						}

					})
				}

			}

		});
	}


};

exports.update = function (req, res) {
	var data = req.body;
	console.log(data);
	if (data && data.ep && data.ep<0){
		res.json({status:"error",message:"目前不支持负数ep"}) ;
	}
	else if (data && (data.ep === null || (isNaN(data.ep) || data.ep > 10000 ))   ){
		res.json({status:"error",message:"请输入正确的ep数"}) ;
	}
	else{
		bgm.updateEps(data.id,{watched_eps:data.ep,auth:data.auth},function(err,data){
			if (err || !data){
				res.json({status:"error",message:"和服务器的通讯出现问题"}) ;
			}
			else{

				if (data && data.code && data.code !== 202){
					res.json({status:"error",message:"指令不正确，请重试"}) ;
				}
				else{
					data.status = "success";
					res.json(data);
					console.log(data);
				}


			}

		})
	}


};