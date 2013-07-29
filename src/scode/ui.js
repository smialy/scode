(function(__) {
    var Rect = __.Class({
       init:function(x, y, width, height){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.x2 = x+width;
            this.y2 = y+height;
       },
       contains:function(point){
           return this.x<=point.x && this.x2 >= point.x && this.y <= point.y && this.y2 >= point.y;
       }
    });
    var Scrollbar = __.Class({
        init:function(ui, type){
            this.ui = ui;
            this._type = type;
            
            this._canvas = document.createElement('canvas');
            this._ctx = this._canvas.getContext('2d');
        },
        setBound:function(x,y, width, height){
            console.debug('scode.ui.scrollbar.setSize(x='+x+', y='+y+', width='+width+', height+'+height+')');
            this._x = x;
            this._y = x;
            this._canvas.width = this._width = width;
            this._canvas.height = this._height = height;
        },
        setMax:function(max){
            console.debug('scode.ui.scrollbar.setMax('+max+')');
            this._max = max;
            this.draw();
        },
        draw:function(x,y){
            
        }
    });
    var HScrollbar = __.Class(Scrollbar,{
        init:function(ui){
            this.$base(ui,'horizontal');
        },
        draw:function(x,y){
            
            var ctx = this._ctx;
            ctx.clearRect(0,0,this._width,this._height);
            ctx.save();
            
            ctx.strokeStyle = '#f00';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(5,2);
            ctx.lineTo(this._width-15,2);
            ctx.stroke();
            
            ctx.restore();
            this.ui.ctx.drawImage(this._canvas, this._x, this._y);
        }
    });
    var VScrollbar = __.Class(Scrollbar,{
        init:function(ui){
            this.$base(ui,'vertical');
        },
        draw:function(){
            var ctx = this._ctx;
            ctx.clearRect(0,0,this._width,this._height);
            ctx.save();
            
            ctx.strokeStyle = '#f00';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(2,5);
            ctx.lineTo(2,this._height-15);
            ctx.stroke();
            
            ctx.restore();
            
            this.ui.ctx.drawImage(this._canvas, this._x, this._y);
        }
    });
    
    
    __.UI = __.Class({
        init: function(api) {
            this.api = api;
            this.theme = api.options.theme;
            this._model = api.model;
            
            this._canvas = document.createElement('canvas');
            this._canvas.tabindex = -1;
            this._canvas.style.display = 'block';
            this.ctx = this._canvas.getContext('2d');

            this.fm = new __.FontMetric(this.theme.font, this.theme.fontSize);
            var dom = api.dom;
            dom.appendChild(this._canvas);
            
            this.vscrollbar = new VScrollbar(this);
            this.hscrollbar = new HScrollbar(this);
            
            __.on(dom,'mousewheel',this._wheel, this);
            
            this.x = 0;
            this.y = 0;

        },
        dispose:function(){
            
        },
        _wheel:function(e){
            if(e.shiftKey){
                this.x+=e.$wheel*this.fm.getWidth();
            }else{
                this.y+=e.$wheel*this.fm.getHeight();    
            }
            this.draw();
        },
        setFocus: function(focus) {
            console.log('scode.Ui::setFocus('+focus+')');
            this._focus = focus;
            if(focus) {
                this._canvas.focus();
            }
        },
        setSize: function(width, height) {
            console.log('scode.Ui::setSize('+width+','+height+')');
            this._width =  width;
            this._height = height;
            this.refresh();
        },
        refresh: function() {
            var width = this._width;
            var height = this._height;
            this._canvas.width = width;
            this._canvas.height = height;
            this._viewWidth = this._model.getMaxLineLength()*this.fm.getWidth()-width;
            this._viewHeight = this._model.getLineCount()*this.fm.getHeight()-height;
            var size = 20;
            this.vscrollbar.setBound(width-size,0, size, height-20);
            this.hscrollbar.setBound(0,height-size,width-20,size);
            this.draw();
        },
        draw: function() {
            var cwidth = this._width;
            var cheight = this._height;
            var ctx = this.ctx;
            var theme = this.theme;
            var lineHeight = this.fm.getHeight();
            var charWidth = this.fm.getWidth();
            var pad = this.fm.getBaseLine()-lineHeight;
            var model = this.api.model;
            var vwidth = this._viewWidth;
            var vheight = this._viewHeight;
            
            
            if(this.x > 0){
                this.x = 0;
            }
            if(this.x < -vwidth){
                this.x = -vwidth
            }
            if(this.y > 0){
                this.y = 0;
            }
            if(this.y < -vheight){
                this.y = -vheight+pad
            }
            var visibleLines = Math.ceil(cheight/lineHeight);
            var firstVisibleLine = Math.floor(Math.abs(this.y/lineHeight));
            var lastVisibleLine = firstVisibleLine+visibleLines;
            if(lastVisibleLine > model.getLineCount()) {
                lastVisibleLine = model.getLineCount();
            }
            
            
            var maxNumberSize = (''+model.getLineCount()).length; 
            var border = 10+maxNumberSize*charWidth;
            

            ctx.fillStyle = theme.backgroundColor;
            ctx.fillRect(0, 0, cwidth, cheight);

            ctx.fillStyle = theme.borderBackgroundColor;
            ctx.fillRect(0, 0, border, cheight);

            ctx.save();
            ctx.translate(0, this.y);

            ctx.font = theme.fontSize+'px '+theme.font;
            
            // console.log('firstVisibleLine',firstVisibleLine);
            // console.log('lastVisibleLine',lastVisibleLine);
            // console.log('visibleLines',visibleLines);
            
            //draw line numbers
            var x = 5, y = lineHeight*firstVisibleLine+lineHeight;
            ctx.fillStyle = theme.lineNumberColor;
            for(var currentLine = firstVisibleLine;currentLine <= lastVisibleLine;++currentLine) {
                var line = currentLine+1;
                 
                ctx.fillText(currentLine+1, x+((maxNumberSize-(''+line).length)*charWidth), y);
                y += lineHeight;
            }

            ctx.save();
            ctx.beginPath();
            ctx.rect(border, -this.y, cwidth-border, cheight);
            ctx.closePath();
            ctx.translate(0, 0);
            ctx.clip();

            var lines = model.getLines(firstVisibleLine, lastVisibleLine);
            ctx.fillStyle = theme.fontColor;
            y = lineHeight*firstVisibleLine+lineHeight;
            for(var currentLine = 0;currentLine < lines.length;++currentLine) {
                ctx.fillText(lines[currentLine], border+10+this.x, y);
                y += lineHeight;
            }
            ctx.restore();

            ctx.restore();
            
            this.vscrollbar.draw();
            this.hscrollbar.draw();

        }
    });

})(scode);
