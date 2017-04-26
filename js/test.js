'use strict';
var vm;
var app = new Vue({
	el: '#app',
	data: {
		//url: "http://localhost:1026/werewolves/getUserList",
		url: "http://localhost:1026/werewolves/updateMatchResult",
		text: ''
	},
	mounted: function() {
		vm = this;
	},
	methods: {
		initData: initData
	},
	components: {}
});


//获取详情数据
function initData() {
	//var _data = vm.text;

	//更新比赛结果
	/*var _data = {
		"user": [
		{
			"userCode": "58e393b8c381540f492d72c3",
			"type": "1"
		},
		{
			"userCode": "58e393ebc381540f492d72c4",
			"type": "5"
		}
		],
		"winner": "0"
	}*/

	//详情
	// var _data = {
	// 	"userCode":"58e393b8c381540f492d72c3"
	// }
	var dataArr =  vm.text.split('-');
	var _data = {
  		"userName": dataArr[1],
 		 "nickName": dataArr[0],
	}
	
	
	$.ajax({
		type: "post",
		url:  trim(vm.url),
		data: JSON.stringify(_data),
		dataType: "json",
		contentType: "application/json",
		success: function(data) {
			if(data.status == 0) {
				vm.text = data.data;
			} else {
				alert(data.msg);
			}
		},
		error: function() {
			alert("网络错误");
		}
	});
}


//删除左右两端的空格
function trim(str) {
	return (str+'').replace(/(^\s*)|(\s*$)/g, "");
}
