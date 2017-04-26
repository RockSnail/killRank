var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var userDao = require('./dao/userDao.js');
var userService= require('./service/userService.js');
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();

app.use(express.static("./"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded

/**
 * 监听用户访问 返回对应的mock信息
 */
app.get('*', function(req, res) {
	
	console.log("...");
	res.redirect('/index.html');
});

app.listen(1026, function(req, res) {
	console.log('app is running at port 1026');
});


//查询列表
app.post('/werewolves/getUserList', function(req, res) {
	var userList = userDao.find(function(err, result) {
		if(err) {
			res.json({
				status: -1,
				data: null,
				msg:"查询列表失败，请联系管理员！"
			});
		} else {
			var list = userService.getUserList(result);
			res.json({
				status: 0,
				data: list,
				msg:"查询列表成功！"
			});
		}
	});
});

//获取用户详情
app.post('/werewolves/getUserDetails', function(req, res) {
	var userCode = req.body.userCode;
	userDao.findOne({
		'_id': userCode
	}, function(err, user) {
		if(err) {
			res.send({
				status: -1,
				data: {},
				msg: "查询详情失败！"
			});
		} else {
			console.log(user);
			var detal = userService.getUsetDetail(user);
			res.send({
				status: 0,
				data: detal,
				msg: "查询详情成功！"
			});
		}
	});
});


//新增用户
app.post('/werewolves/addUser', function(req, res) {
	var _userName = req.body.userName;
	var _nickName = req.body.nickName;
	if(!_userName){
		res.send({
			status: -1,
			data: {},
			msg: "新增失败，请输入用户姓名！"
		});
		return false;
	}
	if(!_nickName){
		res.send({
			status: -1,
			data: {},
			msg: "新增失败，请输入用户昵称！"
		});
		return false;
	}
	userDao.findOne({
		'userName': _userName
	}, function(findErr, userData) {
		if(findErr) {
			res.send({
				status: -1,
				data: {},
				msg: "新增用户失败！"
			});
		} else {
			if(userData) {
				res.send({
					status: -1,
					data: {},
					msg: "该名称的用户已存在！"
				});
			} else {
				//存储mongodb
				var user = new userDao({
					userName: _userName,
					nickName: _nickName,
					score:0,
					prophetWin:0,
					prophetTotal:0,
					witchWin:0,
					witchTotal:0,
					huntsmanWin:0,
					huntsmanTotal:0,
					idiotWin:0,
					idiotTotal:0,
					guardWin:0,
					guardTotal:0,
					civilianWin:0,
					civilianTotal:0,
					wolfWin:0,
					wolfTotal:0
				});

				user.save(function(err, saveRes) {
					if(err) {
						res.send({
							status: -1,
							data: {},
							msg: "新增失败！"
						});
						console.log('新增失败');
						console.log(err);
					} else {
						res.send({
							status: 0,
							data: {},
							msg: "新增成功！"
						});
					}
				});
			}
		}
	});
});



//更新比赛结果
// user代表比赛人列表  type表示游戏角色， 0预言家  1女巫  2猎人 3白痴 4守卫 5平民 6狼人
// winner代表比赛获胜方  0好人  1狼人
/*
{
    "user": [
        {
            "userCode": "1",
            "type": "0"
        },
        {
            "userCode": "2",
            "type": "0"
        },
        {
            "userCode": "3",
            "type": "0"
        },
        {
            "userCode": "4",
            "type": "0"
        }
    ],
    "winner": "0"
}*/

// {
//     "user": [
//         {
//             "userCode": "58e393b8c381540f492d72c3",
//             "type": "0"
//         },
//         {
//             "userCode": "58e393ebc381540f492d72c4",
//             "type": "6"
//         }
//     ],
//     "winner": "0"
// }

var updateLen = 0;

app.post('/werewolves/updateMatchResult', function(req, res) {
	let _user =  req.body.user;
	let _winner = req.body.winner;
	let ids = [];
	//let ids = '58e393b8c381540f492d72c3';
	 
	for(let item of _user){
		ids.push(item.userCode);
	}
	  //let ids = ['58e393b8c381540f492d72c3','58e393ebc381540f492d72c4'];
	  userDao.find({ _id: ids }, function (err, userList) {
        if (err) {
            res.send({
				status: -1,
				data: {},
				msg: "更新比赛信息失败！"
			});
        }
        else{
        		userService.updateMatchResult(userList,_user,_winner);
				// userList.update(function(err, data){
				// 	if(err){
				// 		res.send({
				// 			status: -1,
				// 			data: {},
				// 			msg: "更新比赛信息失败！"
				// 		});
				// 	}
				// 	else{
				// 		res.send({
				// 			status: 0,
				// 			data: {},
				// 			msg: "更新比赛信息成功！"
				// 		});
				// 	}
				// });

				for(let i = 0; i < userList.length; i++){
					userList[i].save(function (err, data) {
						// 更新的回调
						if (err) {
							res.send({
								status: -1,
								data: {},
								msg: "更新比赛信息失败！"
							});
						}
						else{
							if(i == userList.length - 1){
								//event.emit('some_event');
								res.send({
									status: 0,
									data: {},
									msg: "更新比赛成功！"
								});	
							}
						}
					});	
				}

        		
			// event.on('some_event',function() {
			// 	console.log('some_event 事件触发');
			// });
			// setTimeout(function() {
			// 	event.emit('some_event');
			// }, 1000);
        		
        }
    });
	
	
});




