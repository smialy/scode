(function(__) {
    __.FontMetric = __.Class({
        init: function(family, size) {
            this._family = family||'monospace';
            this._size = parseInt(size, 10)||14;

            var line = document.createElement('div');
            with(line.style) {
                font = this._size+'px normal '+this._family;
                whiteSpace = 'nowrap';
                position = 'absolute';
            }
            var txt = 'testy';
            line.innerHTML = txt;
            document.body.appendChild(line);

            this._width = line.offsetWidth/txt.length;
            this._height = line.offsetHeight;

            var span = document.createElement('span');
            with(span.style) {
                display = 'inline-block';
                overflow = 'hidden';
                width = '1px';
                height = '1px';
            }
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