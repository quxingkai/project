define(['jquery','text!lrstorybook','render','Handlebars','text!tblist','header','BScroll','storage'],function($,lrstorybook,render,Handlebars,tblist,header,BScroll,storage){
    var Catalog = function(){
        var chapter_id =storage.get('chapter_id');
        var scroll = new BScroll($('section')[0]);
        var fiction_id = location.search;
        console.log(fiction_id);
        $.ajax({
            url:'/api/catalog'+fiction_id,
            dataType:'json',
            success: function(res){
                // 渲染头部 把标题引入hander中
                header({title:res.item.title});
                console.log(res.item.toc);
                // 目录
                var data = res.item.toc;
                var oLi = '';
                $.each(data,function(i,v){
                    oLi+=`<li>${v.title}</li>`;
                });
                $('.bookCatalog').html(oLi);
                // 引入scroll;

                // scroll滚动到具体位置
                scroll.refresh();

                var num = $('.bookCatalog').find('li').eq(chapter_id)[0];
                $('.bookCatalog').find('li').eq(chapter_id).addClass('bg');
                scroll.scrollToElement(num);
            }
        });

        $('.bookCatalog').on('touchstart','li',function(){
            var ind = $(this).index();
            if(ind<4){          
            window.location.href = "article.html"+fiction_id + "&chapter_id=" + ind;
            }
        });

    }
    return Catalog
})