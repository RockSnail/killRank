/**
 * 
 * @require js/rank.js
 * 	
 */

'use strict';
var vm;
var app = new Vue({
	el: '#app',
	data: {
		listData: []
	},
	mounted: function() {
		vm = this;
		init();
	},
	methods: {

	},
	components: {}
});

function init() {
	var rank;
	rankList = rankList.sort(objectSort('score','desc'));
	for(var i = 0; i < rankList.length; i++) {
		rank = rankList[i];
		if(rank.wolf.total === 0){
			rank.wolfRate = '100%';
		}
		else{
			rank.wolfRate = parseInt(rank.wolf.win / rank.wolf.total * 100) + '%';
		}
		if(rank.god.total === 0){
			rank.godRate = '100%';
		}
		else{
			rank.godRate = parseInt(rank.god.win / rank.god.total * 100) + '%';
		}
		if(rank.civilian.total === 0){
			rank.civilianRate = '100%';
		}
		else{
			rank.civilianRate = parseInt(rank.civilian.win / rank.civilian.total * 100) + '%';
		}
		
		if((rank.wolf.total + rank.god.total + rank.civilian.total) === 0){
			rank.totalRate = '100%';
		}
		else{
			rank.totalRate = parseInt( (rank.wolf.win + rank.god.win + rank.civilian.win) / (rank.wolf.total + rank.god.total + rank.civilian.total) * 100) + '%';
		}
	}

	vm.listData = rankList;
}

/**
 *  @description 对象数组排序
 *  @Date 20160106
 *  @author YouNoFish
 *  @param {propertyName} 进行排序的对象属性
 *  @return 
 */
function objectSort(propertyName, orderBy) {
	return function(object1, object2) {
		var value1 = object1[propertyName];
		var value2 = object2[propertyName];
		var oper = 1;
		if(orderBy == "desc") {
			oper = -1;
		} else if(orderBy == "asc") {
			oper = 1;
		}
		if(value2 < value1) {
			return oper;
		} else if(value2 > value1) {
			return -oper;
		} else {
			return 0;
		}
	}
}