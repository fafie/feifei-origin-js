    /**
     * Created by Administrator on 2016/11/18.
     */
    (function (global) {
        var init,
            document=global.document;
        var feifei=function(selector) {
            //工厂函数
            return new feifei.fn.init(selector);
        };
        feifei.fn=feifei.prototype={
            constructor:feifei,
            length:0,
            get:function (index) {
                index=index-0;
                index=index<0?index+this.length:index;
                return this[index];
            },
            first:function () {
                return this.eq(0);
            },
            eq:function (index) {
                return itcast(this.get(index));
            },
            last:function () {
                return this.eq(-1);
            }
        };
        //构造函数
        init=feifei.fn.init=function (selector) {
            if(!selector) return this;
            if(feifei.isString(selector)){
                if(feifei.isHTML(selector)){
                    Array.prototype.push.apply(this,feifei.parseHtml(selector));
                }else{
                    var nodeList=document.querySelectorAll(selector);
                    // var ret=Array.prototype.slice.call(nodeList);
                    Array.prototype.push.apply(this,nodeList);
                }
            }else if(feifei.isDOM(selector)){
                this[0]=selector;
                this.length=1;
            }else if(feifei.isFunction(selector)){
                if(feifei.isReady){
                    selector();
                }else {
                    if(document.addEventListener){
                        document.addEventListener("DOMContentLoaded",function () {
                            selector();
                            feifei.isReady=true;
                        })  
                    }else {
                        document.attachEvent('onreadystatechange',function () {
                            if(document.readyState==='complete'){
                                selector();
                                feifei.isReady=true;
                            }
                        });
                    }
                    
                }
            }else if(feifei.isArrayLike(selector)){
                var _type=Object.prototype.toString.call(selector).slice(8,-1).toLowerCase();
                if(_type!=='array'){
                    selector=Array.prototype.slice.call(selector);
                }
                Array.prototype.push.apply(this,selector);
            }
        };
        init.prototype=feifei.fn;
        
        //工具方法扩展
        feifei.extend=feifei.fn.extend=function (source,target) {
            target = target || this;
            var k;
            for (k in source) {
                target[k] = source[k];
            }
        };
        feifei.extend({
            isReady:false,
            parseHtml:function (html) {
                var div=document.createElement("div");
                var ret=[];
                div.innerHTML=html;
                 var elem=div.firstChild;
                for(;elem;elem=elem.nextSibling){
                    if(elem.nodeType===1) ret.push(elem);
                }
                return ret;
            },
            each:function (obj,callback) {
                var i=0,
                    l=obj.length;
                for(;i<l;i++){
                    if(callback.call(obj[i],obj[i],i)===false) break;
                }
            }
        });
        //类型判断
        feifei.extend({
            isString:function (obj) {
                return !!obj&&typeof obj==='string';
            },
            isHTML:function (obj) {
                return !!obj&&obj.charAt(0)==='<'//如果是一个html字符串，以<开头
                    &&obj.charAt(obj.length-1)==='>'//以>结束
                    &&obj.length>=3;//obj的长度大于等于3，最小的情况  '<p>'
            },
            isDOM:function (obj) {
                return !!obj&&!!obj.nodeType  //只有dom元素具有nodeType属性
            },
            isFunction:function (obj) {
                return !!obj&&typeof obj==='function';
            },
            isGlobal:function (obj) {
                return !!obj&&obj.window===obj;
            },
            isArrayLike:function (obj) {
                var _type=Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
                var length=!!obj&&'length' in obj&&obj.length;
                //过滤全局对象window和函数，因为全局对象和函数也有length属性
                if(feifei.isGlobal(obj)||feifei.isFunction(obj))return false;
                return _type==='array'||length===0||typeof length==='number'&&length>0&&(length-1) in obj;
            }

        });
        // css样式模块
        feifei.fn.extend({
            each:function (callback) {
                feifei.each(this,callback);
                return this;
            }
        });
        feifei.fn.extend({
            css:function (name,value) {
                if(value==='undefined'){
                    if(typeof name==='object'){
                        this.each(function (v) {
                            var k;
                            for(k in name){
                                v.style[k]=name[k];
                            }
                        })
                    }else {
                        if(!this[0]) return null;
                        return global.getComputedStyle?global.getComputedStyle(this[0][name]):this[0].currentStyle[name];
                    }
                }else{
                    this.each(function (v) {
                        v.style[name]=value;
                    });
                }
                return this;
            },
            hasClass:function (className) {
                var ret=false;
                this.each(function (v) {
                    if((' '+v.className+' ').indexOf(' '+className+' ')!==-1){
                        ret=true;
                        return false;
                    }
                });
                return ret;
            },
            addClass:function (className) {
                return this.each(function (v) {
                    if(!feifei(v).hasClass(className)){
                        v.className+=' '+className;
                    }
                });
            },
            removeClass:function (className) {
                return this.each(function (v) {
                   v.className=(' '+v.className+' ').replace(' '+className+' ',' ');
                })
            },
            toggleClass:function (className) {
                return this.each(function (v) {
                    if($(v).hasClass(className)){
                        $(v).removeClass(className);
                    }else{
                        $(v).addClass(className);
                    }
                })
            }
        });
        //属性模块
        feifei.propFix={
            'for':'htmlfor',
            'class':'className'
        };
        feifei.each([
            'tabIndex',
            'readOnly',
            'maxLength',
            'cellSpacing',
            'cellPadding',
            'rowSpan',
            'colSpan',
            'useMap',
            'frameBordere',
            'contentEditable'
        ],function () {
            feifei.propFix[this.toLowerCase()]=this;
        });
        feifei.fn.extend({
            attr:function (name,value) {
                if(value==undefined){
                    if(typeof name==='object'){
                        this.each(function (v) {
                            for(var k in name){
                                v.setAttribute(k,name[k]);
                            }
                        })
                    }else{
                        if(!this[0]) return null;
                        return this[0].getAttribute(name);
                    }
                }else{
                    this.each(function (v) {
                        v.setAttribute(name,value);
                    })
                }
            },
            html:function(html){
                //判断用户是否输入内容
                if(html==undefined){
                    //如果没有输入内容，判断是否存在第一个dom元素，如果存在返回第一个dom元素的innerHTML，如果不存在返回一个空字符串
                    return this[0]?this[0].innerHTML:'';
                }else{
                    //如果用户传入值，遍历每一个dom元素将传进来的值赋值给每一个dom元素并返回this实现链式编程
                    return this.each(function(v) {
                        v.innerHTML=html;   
                    });
                }
            },
            text:function (text) {
                //判断用户有没有传值，如果没有传值为获取你文本，如果传值了表示设置文本
                if(text==undefined){//如果结果为true，表示没有传值
                    //定义一个变量存储每一个dom元素的文本值
                    var ret='';
                    //遍历每一个dom元素
                    this.each(function (v) {
                        //获取每一个dom元素的文本内容并存储在ret当中
                        ret+='textContent' in document? v.textContent:
                            v.innerText.replace(/\r\n/g,'');//将获取的文本中的回车和换行替换成空字符串
                    });
                    return ret;
                }else {
                    //如果用户传入了值，给dom元素设置文本
                    this.each(function () {
                        'textContent' in document?this.textContent=text: this.innerText=text;
                    });
                }
            },
            val:function (val) {
                //如果没有传值或群第一个dom元素的value值，如果传值了表示给每一个dom元素设置value属性
                if(val==undefined){
                    //如果feifei对象上没有任何元素，返回空字符
                    return this[0]?this[0].value:'';
                }else {//如果传入值表示给每一个dom元素设置value值
                    this.each(function () {
                        this.value=val;
                    })
                }
            },
            prop:function (name,value) {
                //如果传入两个值表示给dom元素设置单个属性值，
                // 如果传入一个值name如果name类型为对象表示给每一个dom元素添加多个属性，
                // 如果name值为字符串表示获取单个属性
                if(value==undefined){
                    var prop;
                    if(typeof name==='object'){
                        for(var k in name){
                            prop=feifei.propFix[k]?feifei.propFix[k]:k;
                            //遍历dom元素给每一个dom元素添加属性
                            this.each(function () {
                                this[prop]=name[k];
                            });
                        }
                    }else {//如果只传入一个字符串name表示给第一个dom元素设置属性
                        prop=feifei.propFix[name]?feifei.propFix[name]:name;
                        return this.length>0?this[0][name]=name:'';
                    }
                }else {//如果传入两个参数表示给每一个dom元素设置属性和对应的属性值
                    prop=feifei.propFix[name]?feifei.propFix[name]:name;
                    this.each(function () {
                        this[name]=value;
                    });
                }
                return this;//实现链式编程
            },
        });
        //dom操作模块
        feifei.extend({
             //数组去重，数组元素可能是一个对象
            unique:function(arr){
                var ret=[];//存储去重后的结果
                feifei.each(arr,function() {
                    if(ret.indexOf(this)===-1) ret.push(this);
                 });
                return ret;
            }
        });
        feifei.fn.extend({
            appendTo:function (target) {
                 var node,ret=[];
             // $('<p>123</p>').appendTo('div').css("backgroundColor","red");
             // this:$('<p>123</p>')
             // target:div
                //统一target
                target=feifei(target);
                //遍历this上的每一个dom元素
                this.each(function (v) {
                    //遍历目标上的每一个dom元素
                    target.each(function (t,i) {
                        node=i===0?v:v.cloneNode(true);
                        ret.push(node);
                        t.appendChild(node);
                    });
                });
                return feifei(ret);
            },
            append:function(source){
                source=feifei(source);
                source.appendTo(this);
                return this;
            },
            prependTo:function(target){
                var firstChild,
                node,
                ret=[],
                that=this;
                //统一target类型
                target=feifei(target);
                //遍历目标dom元素
                target.each(function(elem, i) {
                    //取到目标dom元素的第一个子元素
                    firstChild=elem.firstChild;
                    that.each(function(d) {
                        node=i===0?d:d.cloneNode(true);
                        ret.push(node);
                        elem.insertBefore(node,firstChild);
                    });
                });
                return feifei(ret);
            },
            prepend:function (source) {
                source=feifei(source);
                source.prependTo(this);
                return this;
            },
            next:function(){
                // 定义ret数组，存储所有dom的下一个兄弟元素
                var ret=[];
                //  遍历this上的所有dom元素
                this.each(function() {
                    for (var node = this.nextSibling; node; node=node.nextSibling) {
                        //  遍历当前dom元素下面的所有兄弟，如果类型为 元素，将此元素存储ret内，结束循环。
                        if(node.nodeType===1){
                            ret.push(node);
                            break;
                        }
                    }
                });
                //  两层循环结束，将ret转换成itcast对象，作为next方法的返回值。
                return feifei(ret);
            },
            nextAll:function(){
                var ret=[];
                this.each(function() {
                    for (var node=this.nextSibling; node; node=node.nextSibling) {
                        if(node.nodeType===1){
                            ret.push(node);
                        }
                    }
                });
                return feifei(feifei.unique(ret));
            },
            before:function(source){
                var node;
                //统一source类型为feifei对象
                source=feifei(source);
                //遍历目标元素
                this.each(function(dom, i) {
                    //遍历source
                    source.each(function(elem) {
                        //如果当前遍历的目标元素为第一个目标元素就不用克隆要添加的元素
                        //如果当前遍历的目标元素不是第一个就克隆要添加的元素
                        node=i===0?elem:elem.cloneNode(true);
                        //给目标元素前面添加指定的元素，利用insertBefore方法来实现
                        dom.parentNode.insertBefore(node, dom);
                    });
                });
                return this;
            },
            after:function(source){
                var node;
                //统一source类型为feifei对象
                source=feifei(source);
                this.each(function(dom,i) {
                    source.each(function(elem) {
                        node=i===0?elem:elem.cloneNode(true);
                        //给目标元素后面添加指定的元素，利用insertBefore结合nextSibling方法来实现
                        dom.parentNode.insertBefore(node,dom.nextSibling);
                    });
                });
                return this;
            },
            prev:function(){
                var ret=[];
                this.each(function() {
                    for (var elem=this.previousSibling; elem;elem=elem.previousSibling) {
                        if(elem.nodeType===1){
                            ret.push(elem);
                            break;
                        }
                    }
                });
                return feifei(ret);
            },
            prevAll:function(){
                var ret=[];
                this.each(function() {
                    for (var elem=this.previousSibling; elem;elem=elem.previousSibling) {
                        if(elem.nodeType===1){
                            ret.push(elem);
                        }
                    }
                });
                return feifei(  ret);
            },
            empty:function () {//清空某一节点的内容（包括文本内容和标签内容）
                return this.each(function () {
                    this.innerHTML='';
                })
            },
            remove:function () {//移出某一指定的元素
                //返回this实现链式编程
                return this.each(function () {//遍历当前this的每一项
                    //找到遍历到的this的父节点移出对应的this
                    this.parentNode.removeChild(this);
                })
            }
        });
        
        
    //实现indexOf的浏览器兼容问题
    (function(){
        //如果浏览器不支持indexOf方法就给数组的原型添加indexOf方法
        if(!Array.prototype.indexOf){
            Array.prototype.indexOf=function(val){
                //遍历this对象
                for(var i=0,l=this.length;i<l;i++){
                    //判断传入的值是否在this中，如果存在就返回当前this的索引
                    if(this[i]==val) return i;
                }
                //如果this不具有指定val值返回-1
                return -1
            }
        }
    }());

        //提前返回(浏览器兼容事件绑定)
        var addEvent=function () {
          if(global.addEventListener){//判断浏览器是否支持addEventListener
              return function (elem,type,callback,useCapture) {
                  elem.addEventListener(type,callback,useCapture||false);
              }
          } else {}
            return function (elem,type,callback) {
                elem.attachEvent('on'+type,callback);
            }
        }();
        var removeEvent=function () {
            if(global.addEventListener){
                return function (elem,type,callback) {
                    elem.removeEventListener(type,callback);
                }
            }else {
                return function (elem,type,callback) {
                    elem.detachEvent('on'+type,callback)
                }
            }
        }();

        //事件模块
        feifei.fn.extend({
            on:function (type,callback,useCapture) {
                return this.each(function () {
                    addEvent(this,type,callback,useCapture);
                })
            },
            off:function (type,callback) {
                return this.each(function () {
                    removeEvent(this,type,callback);
                })
            }
            // click:function (callback,useCapture) {
            //     return this.each(function () {
            //         addEvent(this,'click',callback,useCapture);
            //     })
            // },
            // mouseover:function (callback,useCapture) {
            //     return this.each(function () {
            //         addEvent(this,'mouseover',callback,useCapture);
            //     })
            // },
            // mouseenter:function (callback,useCapture) {
            //     return this.each(function () {
            //         addEvent(this,'mouseenter',callback,useCapture);
            //     })
            // },
            // mousemove:function (callback,useCapture) {
            //     return this.each(function () {
            //         addEvent(this,'mousemove',callback,useCapture);
            //     })
            // },
            // mouseout:function (callback,useCapture) {
            //     return this.each(function () {
            //         addEvent(this,'mouseout',callback,useCapture);
            //     })
            // }
        });
        feifei.each([
            'click',
            'dblclick',
            'keypress',
            'keydown',
            'keyup',
            'mouseover',
            'mouseout',
            'mousemove',
            'mouseenter',
            'mouseenter',
            'mouseleave',
            'mouseup',
            'mousedown'],function (type) {
            feifei.fn[type]=function (callback,useCaputre) {
                return this.on(type,callback,useCaputre);
            }
        });
        //动画模块
        var easing = {      
            linear: function(x, t, b, c, d) {
                return (c - b) * t / d;
            },
            minusspeed: function(x, t, b, c, d) {
                return 2 * (c - b) * t / d - (c - b) * t * t / (d * d);
            },
            easeInQuad: function (x, t, b, c, d) {
            return c * (t /= d) * t + b;
            },
            easeOutQuad: function (x, t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOutQuad: function (x, t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            },
            easeInCubic: function (x, t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOutCubic: function (x, t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOutCubic: function (x, t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            },
            easeInQuart: function (x, t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOutQuart: function (x, t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOutQuart: function (x, t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            },
            easeInQuint: function (x, t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOutQuint: function (x, t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOutQuint: function (x, t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            },
            easeInSine: function (x, t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOutSine: function (x, t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOutSine: function (x, t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            },
            easeInExpo: function (x, t, b, c, d) {
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOutExpo: function (x, t, b, c, d) {
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOutExpo: function (x, t, b, c, d) {
                if (t == 0) return b;
                if (t == d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            },
            easeInCirc: function (x, t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOutCirc: function (x, t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOutCirc: function (x, t, b, c, d) {
                if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            },
            easeInElastic: function (x, t, b, c, d) {
                var s = 1.70158;
                var p = 0;
                var a = c;
                if (t == 0) return b;
                if ((t /= d) == 1) return b + c;
                if (!p) p = d * .3;
                if (a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                } else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOutElastic: function (x, t, b, c, d) {
                var s = 1.70158;
                var p = 0;
                var a = c;
                if (t == 0) return b;
                if ((t /= d) == 1) return b + c;
                if (!p) p = d * .3;
                if (a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                } else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
            },
            easeInOutElastic: function (x, t, b, c, d) {
                var s = 1.70158;
                var p = 0;
                var a = c;
                if (t == 0) return b;
                if ((t /= d / 2) == 2) return b + c;
                if (!p) p = d * (.3 * 1.5);
                if (a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                } else var s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            },
            easeInBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            },
            easeOutBounce: function (x, t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            }
        };
        var kv={
            'left':'offsetLeft',
            'top':'offsetTop',
            'width':'offsetWidth',
            'height':'offsetHeight'
        }
        function getLocation(elem,target) {
            var obj={};
            for(var k in target){
                obj[k]=elem[kv[k]];
            }
            return obj;
        };
        function getDistance(location,target){
            var obj={};
            for(var k in target){
                obj[k]=parseFloat(target[k]-location[k]);
            }
            return obj;
        };
        function getTween(time,location,target,duration,easingName){
            var obj={};
            for(var k in target){
                obj[k]=easing[easingName](null,time,location[k],target[k],duration);
            }
            return obj;
        };
        function setStyle(elem,location,tween){
            for(var k in location){
                elem.style[k]=location[k]+tween[k]+'px';
            }
        }
             var animate=function (elem,target,duration,easingName) {
                var timer,//定时器
                    tween,//单位时间间隔的位移
                    location,//起始位置
                    distance,//动画总距离
                    startTime,//动画开始时间
                    currentTime,//动画当前运动时间
                    time;//动画当前经过总的时间间隔
                    location=getLocation(elem,target);
                    distance=getDistance(location,target);
                    startTime=+new Date();//转换毫秒值
                    var render=function(){
                        currentTime=+new Date();
                        time=currentTime-startTime;
                        if(time>duration){
                            tween=distance;
                            clearInterval(timer);
                            delete elem.timerId;
                        }else{
                            tween=getTween(time,location,target,duration,easingName);
                        }
                        setStyle(elem,location,tween);
                    }
                    timer=setInterval(render,1000/60);
                    elem.timerId=timer;
             };
             feifei.fn.extend({
                animate:function(target,duration,easingName){
                    easingName=easingName||'linear';
                    duration=duration || 1000;
                    return this.each(function() {
                        if(!('timerId' in this)){
                            animate(this,target,duration,easingName);
                        }
                    });
                    return this;
                },
                stop:function(){
                    return this.each(function() {
                        if('timerId' in this){
                            clearInterval(this.timerId);
                            delete this.timerId;
                        }
                    });
                }
             });
        global.$=global.feifei=feifei;
    }(window))