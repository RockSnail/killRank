var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://'); //连接admin数据库

var Schema = mongoose.Schema; //创建模型
var userSchema = new Schema({
	userName: String,  //用户名称
	nickName: String, //昵称
	score:Number, //总分数
	prophetWin:Number,  //预言家胜场
	prophetTotal:Number,//预言家总场数
	witchWin:Number, //女巫胜场
	witchTotal:Number, //女巫总场
	huntsmanWin:Number, //猎人胜场
	huntsmanTotal:Number, //猎人总场
	idiotWin:Number, //白痴胜场
	idiotTotal:Number, //白痴总场
	guardWin:Number, //守卫胜场
	guardTotal:Number, //守卫总场
	civilianWin:Number, //平民胜场
	civilianTotal:Number, //平民总场
	wolfWin:Number, //狼人胜场
	wolfTotal:Number //狼人总场
}, {
	collection: "t_werewolves_user"
});


//mockSchema.methods.addMock = function(mock, callback) {
//	this.url = mock.url;
//	this.text = mock.text;
//	this.save(callback);
//}

var mock = db.model('mock', userSchema);
//exports.student=mock;
module.exports = mock;