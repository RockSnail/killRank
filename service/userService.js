
let RoleEnum = require('../enum/RoleEnum.js');

let UserService = {
	//获取用户列表
	getUserList:function(result){
		let list = [];
		let user;
		for(let item of result){
			user = {};
			user.userCode = item._id;
			user.userName = item.userName;
			user.nickName = item.nickName;
			user.score = item.score;
			
			let godWin = item.prophetWin + item.witchWin + item.huntsmanWin + item.idiotWin + item.guardWin;  //神民胜利总数
			let godTotal = item.prophetTotal + item.witchTotal + item.huntsmanTotal + item.idiotTotal + item.guardTotal;  //神民总场数
			
			let wolfWin = item.wolfWin;  // 狼人胜场
			let wolfTotal = item.wolfTotal; //狼人总场
			
			let civilianWin = item.civilianWin; //平民胜场
			let civilianTotal = item.civilianTotal; //平民总场
			
			if(wolfTotal === 0){
				user.wolfRate = '-';
			}
			else{
				user.wolfRate = parseInt(wolfWin / wolfTotal * 100) + '%';
			}
			if(godTotal === 0){
				user.godRate = '-';
			}
			else{
				user.godRate = parseInt(godWin / godTotal * 100) + '%';
			}
			if(civilianTotal === 0){
				user.civilianRate = '-';
			}
			else{
				user.civilianRate = parseInt(civilianWin / civilianTotal * 100) + '%';
			}
			
			if((wolfTotal + godTotal + civilianTotal) === 0){
				user.totalRate = '-';
			}
			else{
				user.totalRate = parseInt( (wolfWin + godWin + civilianWin) / (wolfTotal + godTotal + civilianTotal) * 100) + '%';
			}
			list.push(user);
		}
		return list;
	},
	//获取用户详情
	getUsetDetail:function(item){
		let user = {};
		user.userCode = item._id;
		user.userName = item.userName;
		user.nickName = item.nickName;
		user.score = item.score;
		
		let prophetRate = item.prophetTotal === 0 ? '-' :  parseInt(item.prophetWin / item.prophetTotal * 100) + '%';
		let prophet = {
			win:item.prophetWin,
			total:item.prophetTotal,
			rate:prophetRate
		}
		user.prophet = prophet;
		
		let witchRate = item.witchTotal === 0 ? '-' : parseInt(item.witchWin / item.witchTotal * 100) + '%';
		let witch = {
			win: item.witchWin,
			total: item.witchTotal,
			rate:witchRate
		}
		user.witch = witch;
		
		let huntsmanRate  = item.huntsmanTotal === 0 ? '-' : parseInt(item.huntsmanWin / item.huntsmanTotal * 100) + '%';
		let huntsman = {
			win:item.huntsmanWin,
			total:item.huntsmanTotal,
			rate:huntsmanRate
		}
		user.huntsman = huntsman;
		
		let idiotRate = item.idiotTotal === 0 ? '-' : parseInt(item.idiotWin / item.idiotTotal * 100) + '%';
		let idiot = {
			win:item.idiotWin,
			total:item.idiotTotal,
			rate:idiotRate
		}
		user.idiot = idiot;
		
		let guardRate = item.guardTotal === 0 ? '-' : parseInt(item.guardWin / item.guardTotal * 100) + '%';
		let guard = {
			win:item.guardWin,
			total:item.guardTotal,
			rate:guardRate
		}
		user.guard = guard;

		let civilianRate = item.civilianTotal === 0 ? '-' : parseInt(item.civilianWin / item.civilianTotal * 100) + '%';
		let civilian = {
			win:item.civilianWin,
			total:item.civilianTotal,
			rate:civilianRate
		}
		user.civilian = civilian;

		let wolfRate = item.civilianTotal === 0 ? '-' : parseInt(item.wolfWin / item.wolfTotal * 100) + '%';
		let wolf = {
			win:item.wolfWin,
			total:item.wolfTotal,
			rate:wolfRate
		}
		user.wolf = wolf;
		
		return user;
	},
	
	//更新游戏结果
	updateMatchResult:function(userList,roleList,winner){
		let user; 
		for(let role of roleList){
			user = this.filterUserById(userList,role.userCode);
			console.log(user);
			if(user){
				this.updateUserByMatchRoleWin(user,role.type,winner);
			}
		}
	},
	//通过id查找user对象
	filterUserById:function(userList,_id){
		for(let user of userList){
			if(user._id == _id){
				return user;
			}
		}
	},
	//通过比赛角色结果更新用户信息
	updateUserByMatchRoleWin:function(user,role,winner){
		let score = 0; //分数
		//计算增加的分数
		let camp = 0;  //阵营  0神  1平民  2狼人
		let win = 0; // 增加的胜利场数
		let total = 1; //增加一次总场数
		if(role == RoleEnum.Prophet || role == RoleEnum.Witch || role == RoleEnum.Huntsman || role == RoleEnum.Idiot || role == RoleEnum.Guard){
			camp = 0;
			//好人胜利 神加2分   好人输 神扣2分
			if(winner == 0){
				score = 2;
				win = 1;
			}
			else{
				score = -2;
				win = 0;
			}
		}
		else if(role == RoleEnum.Civilian){
			camp = 1;
			//好人胜利，平民加1  好人输 平民扣1
			if(winner == 0){
				score = 1;
				win = 1;
			}
			else{
				score = -1;
				win = 0;
			}
		}
		else{
			camp = 2;
			//狼人胜利，狼队加2  狼人输 狼队扣1
			if(winner == 1){
				score = 2;
				win = 1;
			}
			else{
				score = -1;
				win = 0;
			}
		}
		//更新分数
		user.score = user.score + score;
		//更新比赛历史记录
		role = parseInt(role);
		switch (role){
			case RoleEnum.Prophet:
				user.prophetWin += win;
				user.prophetTotal += total;
				break;
			case RoleEnum.Witch:
				user.witchWin += win;
				user.witchTotal += total;
				break;
			case RoleEnum.Huntsman:
				user.huntsmanWin += win;
				user.huntsmanTotal += total;
				break;
			case RoleEnum.Idiot:
				user.idiotWin += win;
				user.idiotTotal += total;
				break;
			case RoleEnum.Guard:
				user.guardWin += win;
				user.guardTotal += total;
				break;
			case RoleEnum.Civilian:
				user.civilianWin += win;
				user.civilianTotal += total;
				break;
			case RoleEnum.Wolf:
				user.wolfWin += win;
				user.wolfTotal += total;
				break;
			default:
				break;
		}
	}
	
	
	
	
	
}


module.exports = UserService;
