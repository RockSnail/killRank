// 通过set project.files对象指定需要编译的文件夹和引用的资源  顺序很重要, 决定依赖顺序

// JS代码验证
var jshintConfig = {
  i18n: 'zh-CN',

  quotmark: 'single', // 单引号
  immed   : true, // (function(){})(); => (function(){}());
  undef   : true, // 禁止使用不在全局变量列表中的未定义的变量
  unused  : false, // 禁止定义变量却不使用

  bitwise  : true, // 禁用位运算符(如^，|，&)
  camelcase: 'camelCase', // 使用驼峰命名(camelCase)或全大写下划线命名(UPPER_CASE)
  curly    : true, // if和while等语句中使用{}来明确代码块
  noempty  : true, // 禁止出现空的代码块
  trailing : true, // 禁止行尾空格
  latedef  : false, // 变量定义前禁止使用
  evil     : true, // 允许使用eval

  validthis: true, // 允许严格模式下在非构造函数中使用this, 当为false, 添加注释以绕过验证 /* jshint validthis: true */
  loopfunc : false, // 允许循环中定义函数
  expr     : true, // 允许应该出现赋值或函数调用的地方使用表达式
  asi      : true, // 省略分号
  eqnull   : true, // 允许==null
  eqeqeq   : false, // 使用===和!==替代==和!=

  // 下面是全局对象定义
  browser   : true,
  devel     : true,
  browserify: true,
  jquery    : true,
  globals   : {
    Inkey   : true,
    Swiper   : true,
    angular  : true,
    _        : true,
    xScroll  : true,
    wx       : true,
    TDAPP    : true,
    FastClick: true,
    __uri    : true,
    __inline : true,
    deny     : true // 首页闪屏广告定义的方法, 该方法用于在闪屏结束后移除监听
  }
};

/*************************配置*****************************/
// 项目名

var app = 'killRank';

fis
  .set('dist', './dists') // 发布目录
  .set('baseURL', '') // 发布目录
  .set('assets', '/assets');// 静态目录


/*************************目录规范*****************************/

fis.match('*.png', {
    // 压缩图片
    optimizer: fis.plugin('png-compressor', {
      type: 'pngquant'
    })
  })
  .match('::package', {
    postpackager: fis.plugin('loader', {
    allInOne: false
  })
  });
 
// fis.match('*.html', {
//  useMap: true
//});

//fis.hook('commonjs')

//开启自动模块化包装
fis.match('/js/**.js', {
	isMod: true
})

fis.match('::packager', { 
	postpackager: fis.plugin('loader', {
		resourceType : "mod"
	})
});


/**********************测试环境*****************/

fis
    .media('test')
    .match('**', {
      domain: fis.get('baseURL'),
      deploy: [
        fis.plugin('local-deliver', {
          to: fis.get('dist')
        })
      ]
    });

/**********************生产环境*****************/

fis
    .media('pro')
    .match("**/*", {
      release: '${assets}/$&'
    })
    .match(/\.html$/i, {
      release : '$1'
    })
    .match('demo.{css,html}', {
      release: false
    })
  // 合并 lib.css
  // 这里不需要关心依赖关系(比如: rest.css 应该在其最前面导入)
  // 依赖关系已经在程序入口定义好了, 这里只要合并就好了
    .match('/{lib,styls}/**.{styl,css}', {
      packTo: 'css/a.css'
    })
  // 合并 app.css
    .match('/page/**.{styl,css}', {
      packTo: 'css/b.css'
    })
    .match('*.css', {
      // 压缩CSS
      optimizer: fis.plugin('clean-css'),
      // 开启图片合并
      useSprite: true
    })
  // 合并 lib.js
    .match('/lib/**.js', {
      packTo: 'js/a.js'
    })
  // 合并 app.js
    .match('/js/**.js', {
      packTo: 'js/b.js'
    })
    .match('**.js', {
      // 压缩JS
      optimizer   : fis.plugin('uglify-js', {
        compress: {
          drop_console: true // 自动去除console.log等调试信息
        }
      })
    })
  // 添加hash {...,css} 逗号之间不能有空格
    .match('**.{css,js,png,jpg,gif,eot,svg,ttf,woff}', {
      useHash: true
    })
    .match('**', {
      domain: fis.get('baseURL'),
      deploy: [
        // 将打包好的zip, 输出到dist目录
        fis.plugin('local-deliver', {
          to: fis.get('dist')
        })
      ]
    });