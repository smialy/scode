(function(__) {
    __.Model = __.Class({
        init: function(txt) {
            this.setText(txt || '');
        },
        setText:function(txt){
            this._lines = txt.split(/\n/);
            this._length = txt.length;
            var len = 0, max = 0;
            for(var i = 0, j = this._lines.length;i < j;i++) {
                len = this._lines[i].length;
                if(len > max) {
                    max = len;
                }
            }
            this._maxLineLength = max;
        },
        length:function(){
            return this._length;
        },
        getLine: function(number) {
            return this._lines[number];
        },
        getLines:function(first, last){
            return this._lines.slice(first, last);
        },
        getLineCount: function() {
            return this._lines.length;
        },
        charAt: function(line, column) {
            var row = this._lines[line];
            return row ? row[column] : '';
        },
        getMaxLineLength: function() {
            return this._maxLineLength;
        }
    });
})(scode)
