var scode = {};

(function(__) {

    __.ext = function() {
        var buff = {}, arg;
        for(var i = 0, j = arguments.length;i < j;i++) {
            arg = arguments[i];
            if(arg) {
                for(var a in arg) {
                    buff[a] = typeof arg[a] === 'object' ? __.ext(buff[a], arg[a]) : arg[a];
                }
            }
        }
        return buff;
    };
    (function() {

        var el = document.createElement('div');
        var isEventSupport = function(name) {
            var el = window
            var ename = 'on'+name.toLowerCase();
            if( ename in el) {
                return true;
            }
            var isSupport = false;
            if(el.setAttribute) {
                el.setAttribute(ename, 'return;');
                isSupport = typeof el[ename] === 'function';
                el.removeAttribute(ename);
            }
            return isSupport;
        }
        var listeners = {
            items:[],
            get: function(type, callback, bind, create) {
                var item;
                for(var i = 0, j = this.items.length;i < j;i++) {
                    var item = this.items[i];
                    if(item&&item[1] === type&&item[2] === callback&&item[2] === bind) {
                        return item[0];
                    }
                }
                if(create) {
                    var listener = function(e) {
                        var e = window.event||e;

                        if(e.type === 'mousewheel') {
                            e.$wheel = Math.abs(e.wheelDelta)/e.wheelDelta;

                        } else if(e.type === 'DOMMouseScroll') {
                            e.$wheel = -Math.abs(e.detail)/e.detail;
                            if(e.axis) {
                                if(e.axis == e.HORIZONTAL_AXIS) {
                                    e.$axis = "horizontal";
                                } else {
                                    e.$axis = "vertical";
                                }
                            } else if(e.wheelDeltaX&&e.wheelDeltaX === e.wheelDelta) {
                                e.$axis = "horizontal";
                            } else {
                                e.$axis = "vertical";
                            }
                        }
                        callback.call(bind, e);
                    };
                    this.items.push([listener, type, callback, bind]);
                    return listener;
                }
                return null;
            }
        };
        __.on = function(target, type, callback, bind) {
            if(type === 'mousewheel') {
                if(!isEventSupport('mousewheel')) {
                    type = 'DOMMouseScroll';
                }
            }

            bind = bind||null;
            var listener = listeners.get(type, callback, bind, true);
            if(target.addEventListener) {
                target.addEventListener(type, listener, false);
                return {
                    remove: function() {
                        target.removeEventListener(type, listener, false);
                    }
                };
            }
        };
        __.off = function(target, type, callback, bind) {
            bind = bind||null;
            var listener = listeners.get(type, callback, bind);
            if(listener&&target.addEventListener) {
                target.removeEventListener(type, listener, false);
            }
        }
    })();

    var isArray = function(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };
    var isFn = function(o) {
        return typeof o === 'function';
    };
    var $merge = function(prev, cur) {
        if(prev&&prev !== cur) {
            var ct = typeof cur;
            var pt = typeof prev;
            if(ct === pt) {
                if(ct === 'function') {
                    var m = function() {
                        this.$base = prev;
                        return cur.apply(this, arguments);
                    };
                    return m;
                }
            }
        }
        return cur;
    };

    var $proto = function(f) {
        f.$proto = true;
        var proto = new f();
        delete f.$proto;
        return proto;
    };
    var Class = function() {
        if(Class.$proto) {
            return;
        }
        if(this instanceof Class) {
            throw Error('Incorect using component Class');
        }
        var _p = $proto(Class);
        var _a = {};

        var _ext = function(obj) {
            if(isFn(obj)) {
                obj = $proto(obj);
            }
            var ii = null;
            for(var i in obj) {
                if(isFn(obj[i])) {
                    ii = i === 'init' ? '__init__' : i;
                    _p[ii] = $merge(_p[ii], obj[i]);
                } else {
                    _a[i] = obj[i];
                }
            }
        };
        //base wraper
        var klass = function() {
            for(var i in _a) {
                this[i] = sjs.clone(_a[i]);
            }
            if(!klass.$proto) {
                if(isFn(this.__init__)) {
                    return this.__init__.apply(this, arguments);
                }
            }
            return this;
        };
        var args = Array.prototype.slice.call(arguments);
        var pos = 0, next, i, l;
        while(args.length) {
            next = args.shift();
            if(!next) {
                continue;
            }
            var type = typeof next;
            if(type === 'function'&&pos === 0) {
                //extend
                _p = $proto(next);

                //find variable
                for(i in _p) {
                    if(!isFn(_p[i])) {
                        _a[i] = _p[i];
                        delete _p[i];
                    }
                }
                continue;
            } else if(type === 'object') {
                if(isArray(next)) {
                    //implement
                    for( i = 0, l = next.length;i < l;i++) {
                        _ext(next[i]);
                    }
                } else {
                    //instance
                    _ext(next);

                    //static
                    next = args.shift()|| {};
                    for(i in next) {
                        klass[i] = next[i];
                    }
                    break;
                }
            }
        }
        klass.prototype = _p;
        klass.constructor = Class;
        return klass;
    };
    __.Class = Class;

})(scode);
