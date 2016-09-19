var crypto = require('crypto'),
    User = require('../models/user.js');

module.exports = function(app) {
    
    // 首页
    app.get('/', function(req, res) {
        
        // render(模板名，数据)
        res.render('index', {
            title: '主页',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    // 用户登录
    app.get('/login', checkNotLogin);
    app.get('/login', function(req, res){
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/login', checkNotLogin);
    app.post('/login', function(req, res){
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        
        User.get(req.body.name, function(err, user){
            if(!user){
                req.flash('error', '用户不存在!');
                return res.redirect('/login');
            }
            if(user.password != password){
                req.flash('error', '密码错误!');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success', '登录成功！');
            res.redirect('/');
        });
    });
    
    // 用户注册
    app.get('/reg', checkNotLogin);
    app.get('/reg', function(req, res){
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/reg', checkNotLogin);
    app.post('/reg', function(req, res){
        console.log('post reg');
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        
        if(password_re != password){
            req.flash('error', '两次输入密码不一致！');
            return res.redirect('/reg');
        }
        
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: name,
            password: password,
            email: req.body.email
        });
        
        User.get(newUser.name, function(err, user){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            if(user){
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');
            }
            
            newUser.save(function(err, user){
                if(err){
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                req.session.user = newUser;
                req.flash('success', '注册成功！');
                res.redirect('/');
            });
        });
    });
    
    // 发表文章
    app.get('/post', checkLogin);
    app.get('/post', function(req, res){
        res.render('post', {title: '发表'});
    });
    app.post('/post', checkLogin);
    app.post('/post', function(req, res){ });
    
    // 登出
    app.get('/logout', checkLogin);
    app.get('/logout', function(req, res){
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');
    });
    
    
    function checkLogin(req, res, next) {
        if(!req.session.user){
            req.flash('error', '未登录!');
            res.redirect('/login');
        }
        next();
    }
    
    function checkNotLogin(req, res, next) {
        if(req.session.user){
            req.flash('error', '已登录!');
            res.redirect('back');
        }
        next();
    }
    
};

/*

req.query

// GET /search?q=tobi+ferret  
req.query.q  
// => "tobi ferret"  

// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse  
req.query.order  
// => "desc"  

req.query.shoe.color  
// => "blue"  

req.query.shoe.type  
// => "converse"  

*/




/*

req.body

// POST user[name]=tobi&user[email]=tobi@learnboost.com  
req.body.user.name  
// => "tobi"  

req.body.user.email  
// => "tobi@learnboost.com"  

// POST { "name": "tobi" }  
req.body.name  
// => "tobi"  

*/





/*

req.params

// GET /user/tj  
req.params.name  
// => "tj"  

// GET /file/javascripts/jquery.js  
req.params[0]  
// => "javascripts/jquery.js"  

*/



/*

req.param(name)

// ?name=tobi  
req.param('name')  
// => "tobi"  

// POST name=tobi  
req.param('name')  
// => "tobi"  

// /user/tobi for /user/:name   
req.param('name')  
// => "tobi"  

*/