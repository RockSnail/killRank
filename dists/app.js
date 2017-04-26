var express = require('express');
var app = express();


app.use(express.static("./"));

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