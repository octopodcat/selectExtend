//下拉菜单扩展插件
//2016/11/22

(function ($) {
    //插件主函数
    $.selectExtend = function (element,options) {
        this.element = element;
        this.options = options || {};
        this.framework();
        this.inputClick();
        this.keydown();
    }
    var $selectExtend = $.selectExtend;

    //大小写转换
    $.expr[":"].searchContent = $.expr.createPseudo(function (text) {
        return function (element) {
            return $(element).text().toUpperCase().indexOf(text.toUpperCase()) >= 0 ||  $(element).attr('data-value').toUpperCase().indexOf(text.toUpperCase()) >= 0;
        };
    });

    //继承属性
    var select_content = '';
    $selectExtend.fn = $selectExtend.prototype = {
        framework : function () {
            this.selectFrame = $('<div class="select-frame"></div>');
            this.selectArrow = $('<span class="select-arrow"></span>');
            this.selectInput = $('<div class="select-input"></div>');
            this.select_input = $('<input type="text" value="" placeholder="">');
            this.selectSpread = $('<div class="select-spread"></div>');
            this.noResult = $('<p class="no-result select-hide">No result</p>');
            this.element.after(this.selectFrame);
            this.selectFrame.append(this.selectArrow);
            this.selectFrame.append(this.selectInput);
            this.selectFrame.append(this.selectSpread);
            this.selectInput.append(this.select_input);
            this.selectSpread.append(this.noResult);
            this.appendItems();
        },
        appendItems : function () {
            var _this = this;
            var firstOption;
            this.element.hide();
            this.element.find('option').each(function (index,element) {
                if($(element).css('display') != 'none'){
                    var item = $('<div class="select-item" data-value="'+$(element).attr('value')+'">'+$(element).text()+'</div>');
                    _this.selectSpread.append(item);
                    item.click(function (event) {
                        event.stopPropagation();
                        _this.selectSpread.addClass('select-hide');
                        _this.selectItem(item);
                    });
                    // _this.inputChange(item);
                    _this.mousePass(item);   
                } else if ($(element).css('display') == 'none') {
                    var placeholder = element.value;
                    _this.select_input.attr('placeholder',placeholder);
                    firstOption = false;
                }
                if(firstOption != false){
                    _this.selectItem($(_this.selectSpread.find('div')[0]));
                } 
            })
        },
        selectItem : function (item) {
            item.addClass('selected');
            item.siblings().removeClass('selected');
            this.element.val($(item).attr('data-value'));
            select_content = $(item).text();
            this.select_input.val(select_content);
            this.selectSpread.addClass('select-hide');
            return select_content;
        },
        inputClick : function () {
            var _this = this;
            this.selectSpread.addClass('select-hide');
            this.select_input.click(function (event) {
                event.stopPropagation();
                _this.select_input.val('');
                _this.selectSpread.removeClass('select-hide');
                $(_this.selectSpread.find('div')).removeClass('select-hide');
                _this.selectSpread.scrollTop(0);
                _this.noResult.addClass('select-hide');
            });
            this.docClick();
            this.hoverItem($(_this.selectSpread.find('div')[0]));
        },
        filterItem : function () {
            var _this = this;
            var text = this.select_input.val();
            this.selectSpread.find('.select-item').addClass('select-hide');
            this.selectSpread.find('.select-item:searchContent('+text+')').removeClass('select-hide');
            if(_this.selectSpread.find('.select-item:searchContent('+text+')').length <= 0){
                _this.noResult.removeClass('select-hide');
            } else {
                _this.noResult.addClass('select-hide');
            }
        },
        docClick : function () {
            var _this = this;
            $(document).click(function (event) {
                event.stopPropagation();
                _this.selectSpread.addClass('select-hide');
                _this.select_input.val(select_content);
            })
        },
        mousePass : function (item) {
            var _this = this;
            item.on('mouseenter', function () {
                _this.hoverItem($(this));
                $(this).siblings().removeClass('select-itemHover');
            }).on('mouseleave', function () {
                $(this).removeClass('select-itemHover');
            })
        },
        hoverItem : function (item) {
            if(item.position().top + item.outerHeight() > this.selectSpread.height()){
                this.selectSpread.scrollTop(this.selectSpread.scrollTop() + item.outerHeight() + item.position().top - this.selectSpread.height());
            } else if (item.position().top < 0) {
                this.selectSpread.scrollTop(this.selectSpread.scrollTop() - item.height())
            }
            item.addClass('select-itemHover');
            return hoverItem = item;
        },
        keydown : function () {
            var _this = this;
            this.select_input.on('keydown', function (event) {
                if(event.which === 13){
                    _this.selectHoverItem();
                    _this.select_input.blur();
                } else if (event.which === 40){
                    _this.hoverNextItem();
                } else if (event.which === 38){
                    _this.hoverPreviousItem();
                }
            }).on('keyup', function (event) {
                if(event.which != 13 && event.which != 27 && event.which != 38 && event.which != 40)
                    _this.filterItem();
            })
        },
        selectHoverItem : function () {
            if(!hoverItem.hasClass('select-hide')){
                this.selectItem(hoverItem);
            }
        },
        hoverNextItem : function () {
            var nextItem = $(hoverItem).nextAll('.select-item:not(.select-hide):first');
            if(nextItem.length > 0){
                this.hoverItem(nextItem);
                $(nextItem).siblings().removeClass('select-itemHover');
            }
        },
        hoverPreviousItem : function () {
            var previousItem = $(hoverItem).prevAll('.select-item:not(.select-hide):first');
            if(previousItem.length > 0){
                this.hoverItem(previousItem);
                $(previousItem).siblings().removeClass('select-itemHover');
            }
        }
    }
    //插件入口
    $.fn.selectExtend = function(options) {
        return this.each(function () {
            var selectExtend = new $selectExtend($(this),options)
        });
    }

})(jQuery);