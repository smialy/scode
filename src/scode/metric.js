(function(__) {
    __.FontMetric = __.Class({
        init: function(family, size) {
            this._family = family||'monospace';
            this._size = parseInt(size, 10)||14;

            var line = document.createElement('div');
            var s = line.style;
            s.font = this._size+'px normal '+this._family;
            s.whiteSpace = 'nowrap';
            s.position = 'absolute';
            var txt = 'testy';
            line.innerHTML = txt;
            document.body.appendChild(line);

            this._width = line.offsetWidth/txt.length;
            this._height = line.offsetHeight;

            var span = document.createElement('span');
            s = span.style;
            s.display = 'inline-block';
            s.overflow = 'hidden';
            s.width = '1px';
            s.height = '1px';
            line.appendChild(span);
            this._baseline = span.offsetTop+span.offsetHeight;
            line.parentNode.removeChild(line);
        },
        getFamily: function() {
            return this._family;
        },
        getSize: function() {
            return this._size;
        },
        getWidth: function() {
            return this._width;
        },
        getHeight: function() {
            return this._height;
        },
        getBaseLine: function() {
            return this._baseline;
        },
        toString: function() {
            return '[FontMetric width='+this._width+' height='+this._height+' baseline='+this._baseline+']';
        }
    });

})(scode); 