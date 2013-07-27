var scode = {};

(function(__) {
    
    __.ext = function(){
        var buff = {}, arg;
        for(var i=0,j=arguments.length; i<j; i++){
            arg = arguments[i];
            if(arg){
                for(var a in arg){
                    buff[a] = typeof arg[a] === 'object' ? __.ext(buff[a], arg[a]) : arg[a];
                }
            }
        }
        return buff;
    };
    
    
    
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
