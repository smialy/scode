(function(__) {
    var Scrollbar = __.Class({
        init:function(ui, width, length){
            this.ui = ui;
            this.pos = 0;
            this.width = width;
            this.length = length;
            
            this._canvas = document.createElement('canvas');
            this._ctx = this._canvas.getContext('2d');
        },
        setBound:function(x,y, width, height){
            console.debug('scode.ui.scrollbar.setSize(x='+x+', y='+y+', width='+width+', height='+height+')');
            this._x = x;
            this._y = y;
            this._canvas.width = this._width = width;
            this._canvas.height = this._height = height;
            return this;
        },
        setSize:function(view, content){
            console.debug('scode.ui.scrollbar.setMax('+view+','+content+')');

            
            this.draw();
            return this;
        },
        draw:function(x,y){
            
        }
    });

})(scode);
