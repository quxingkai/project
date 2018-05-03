define(['jquery','storage','jsonp','getRequest','base64'],function($,storage,jsonp,getRequest,base64){
    var article = function(){
        // 获取fiction_id 和 chapter_id 
        var fiction_id = getRequest().fiction_id;
        var chapter_id = getRequest().chapter_id;

        // 背景
        var _setBg = storage.get('style_bg') || '#f7eee5' ; 
        var chooseBg; // 初始化背景
        // 字大小
        var _setSize = storage.get('style_size') || 14 / 37.5 * 1 + 'rem'; 
        // 字颜色
        var _sizeBg = storage.get('style_sizeBg')||'#000';
        var top_set = $('.top-set'); // 顶部返回
        var bot_set = $('.bot-set'); // 底部设置
        var set_style = $('.set-style'); // 字体样式
        var mask = $('.mask');
        var isLight = true; // 默认是白天

        // 页面初始化设置
        initStyle()
        function initStyle(){
            getJson(fiction_id,chapter_id);
            $('.details').css('background-color',_setBg);
            $('p').css('font-size',_setSize);
            $('.details').find('p').css('color',_sizeBg);
        }

        // 点击读书内容页面显示出设置栏
        $('.details').on('click',function(){
            top_set.show();
            bot_set.show();
            mask.show();
        });

        // 点击遮罩层隐藏
        mask.on('click',function(){
            top_set.hide();
            bot_set.hide();
            set_style.hide();
            mask.hide();
        });

        // 点击显示出设置面板
        $('.size').on('click',function(){
            set_style.toggle();
            $(this).toggleClass("active");
        });

        // 点击变大字体
        var initSize = storage.get("fz") || 14; 
        $('.large-btn').on('click',function(){
            if(initSize<24){
                initSize+=2;
            }
            _setSize = initSize / 37.5 * 1 + 'rem'
            storage.set('style_size',_setSize);
            $('p').css('font-size', _setSize);
        });

        // 点击变小字体
        $('.small-btn').on('click',function(){
            if(initSize>12){
                initSize-=2;
            }
            _setSize = initSize / 37.5 * 1 + 'rem'
            storage.set('style_size',_setSize);
            $('p').css('font-size', _setSize);
        });

        // 切换背景图片
        $('.bg-list').on('click','li',function(){
            _setBg = $(this).attr('bg-color');
            chooseBg= _setBg;
            storage.set('style_bg',_setBg);
            $('.details').css('background-color',_setBg);
        });

        // 点击切换下一章
        $('.nextBtn').on('click',function(){
            if(chapter_id<4){
                chapter_id ++;
                console.log(chapter_id);
            }
            getJson(fiction_id,chapter_id);
            storage.set("chapter_id", chapter_id);
            initStyle();
        });

        // 返回
        $('.back').on('click',function(){
            location.href = 'readbook.html?fiction_id='+fiction_id;
        })

        // 点击切换上一章
        $('.prveBtn').on('click',function(){
            if(chapter_id > 1){
                chapter_id --;
            }
            getJson(fiction_id,chapter_id);
            storage.set("chapter_id", chapter_id);
            initStyle();
        });
        // day切换
        $('.day').on('click',function(){
            $(this).toggleClass("change");
            var status = $(this).find('dd').text() == '白天'?'晚上' : '白天';;
            $(this).find('dd').text(status);
            isLight = status == '白天';
            if(!isLight){
                $('.artical').css('background',chooseBg);
            }
        });
        
        // 点击目录进入跳转
        $('.chapter').on('click',function(){
            location.href = 'Catalog.html?fiction_id='+fiction_id;
        });
        
        // 获取书的内容jsonp获取
        function getJson(fiction_id,chapter_id){
            $.ajax({
                url:"/api/articleUrl/?fiction_id="+fiction_id+'&chapter_id='+chapter_id,
                dataType: 'json',
                success: function(data){
                    getJSONP(data.jsonp);
                }
            });
        }

        function getJSONP(url){
            jsonp({
                url:url,
                cache: true, // true的话会读缓存而且真的到服务器上
                callback: "duokan_fiction_chapter",
                success:function(data){
                    var data = base64.decode(data);
                    var articalJson = decodeURIComponent(escape(data));
                    var parseArtical = JSON.parse(articalJson);
                    var oP = '<h1>'+parseArtical.t+'</h1>';
                    parseArtical.p.forEach(function(v,i){
                        oP += '<p>'+v+'</p>';
                    });
                    $('.details').html(oP);
                    initStyle();
                }
            })
        }
         
    }
    return article;
});