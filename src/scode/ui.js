(function(__) {
    
    
    __.UI = __.Class({
        init: function(api) {
            this.api = api;
            this.theme = api.options.theme;
            this.model = api.model;

            this.canvas = document.createElement('canvas');
            this.canvas.tabindex = -1;
            this.canvas.setAttribute('tabindex', -1);
            this.canvas.style.display = 'block';
            this.ctx = this.canvas.getContext('2d');

            this.fm = new __.FontMetric(this.theme.font, this.theme.fontSize);
            var dom = api.dom;
            dom.setAttribute('tabindex', 0);
            dom.appendChild(this.canvas);

            this.vscrollbar = new __.VScrollbar(this);
            this.hscrollbar = new __.HScrollbar(this);

            __.on(this.canvas, 'focus', function(e) {

            }, this);
            __.on(this.canvas, 'blur', function(e) {

            }, this);
            __.on(dom, 'mousewheel', this._wheel, this);
            __.on(dom, 'mousedown', this._mousedown, this);
            __.on(dom, 'keydown', this._keydown, this);

            this.SCROLL_WIDTH = 20;
            this.VIEW_MARGIN = 2;

            this.x = 0;
            this.y = 0;

        },
        dispose: function() {

        },
        _keydown: function(e) {
            var isDraw = true;
            switch(e.$key) {
                case 'up':
                    this.addY(this.lineHeight);
                    break;
                case 'down':
                    this.addY(-this.lineHeight);
                    break;
                case 'left':
                    this.addY(this.charWidth);
                    break;
                case 'right':
                    this.addY(-this.charWidth);
                    break;
                case 'pagedown':
                    this.addY(-this.viewHeight);
                    break;
                case 'pageup':
                    this.addY(this.viewHeight);
                    break;
                case 'home':
                    this.setY(0);
                    break;
                case 'end':
                    this.addY(-this.dy);
                    break;
            }
        },
        getCoords:function(){
            return __.position(this.api.dom);
        },
        _mousedown: function(e) {
            var pos = this.getCoords();
            var point = {
                x: e.$client.x-pos.x, 
                y: e.$client.y-pos.y
            };
            var scroll = null;
            if(this.vscrollbar.bound.contains(point)) {
               scroll = this.vscrollbar;
            } else if(this.hscrollbar.bound.contains(point)) {
               scroll = this.hscrollbar;
            }
            if(scroll) {
                scroll.mousedown(e);
                var hmove = __.on(document, 'mousemove', scroll.mousemove, scroll);
                var hup = __.on(document, 'mouseup', function() {
                    scroll.mouseup(e);
                    hmove.remove();
                    hup.remove();
                    
                }, this);
            }
        },
        addX:function(diff){
            this.setX(this.getX()+diff);
        },
        setX:function(x){
            
            if(x > 0) {
                x = 0;
            }
            if(x < -this.dx) {
                x = -this.dx;
            }
            if(this.x !== x){
                this.x = x;
                this.draw();
            }            
        },
        
        getX:function(){
            return this.x;
        },
        addY:function(diff){
            this.setY(this.getY()+diff);
        },
        setY:function(y){
            if(y > 0) {
                y = 0;
            }
            if(y < -this.dy) {
                y = -this.dy;
            }
            if(this.y !== y){
                this.y = y;
                this.draw();    
            }                        
        },
        getY:function(){
            return this.y;
        },
        _wheel: function(e) {
            e.$stop();
            if(e.shiftKey) {
                this.addX(e.$wheel*this.fm.getWidth()*2);
            } else {
                this.addY(e.$wheel*this.fm.getHeight());
            }
        },
        setFocus: function(focus) {
            //console.log('scode.Ui::setFocus('+focus+')');
            this._focus = focus;
            if(focus) {
                this.canvas.focus();
            }
        },
        setSize: function(width, height) {
            //console.log('scode.Ui::setSize('+width+','+height+')');
            this.width = width;
            this.height = height;
            this.refresh();
        },
        refresh: function() {
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.lineCount = this.model.getLineCount();
            var maxLineLength = this.model.getMaxLineLength();
            this.lineHeight = this.fm.getHeight();
            this.charWidth = this.fm.getWidth();

            var maxNumberSize = (''+this.lineCount).length;

            this.rulerWidth = (maxNumberSize+1)*this.charWidth;

            var contentWidth = this.contentWidth = maxLineLength*this.charWidth;
            var contentHeight = this.contentHeight = this.lineCount*this.lineHeight;
            

            var dx = this.dx = contentWidth+this.rulerWidth > this.width ? contentWidth+this.rulerWidth+this.SCROLL_WIDTH-this.width : 0;
            var dy = this.dy = contentHeight > this.height ? contentHeight+this.SCROLL_WIDTH-this.height : 0;

            this.viewWidth = this.width-this.rulerWidth-this.VIEW_MARGIN;
            if(dy > 0) {
                this.viewWidth -= this.SCROLL_WIDTH;
            }
            this.viewHeight = this.height;
            if(dx > 0) {
                this.viewHeight -= this.SCROLL_WIDTH;
            }
            this.hscrollbar.setBound(this.rulerWidth, this.viewHeight, this.viewWidth, this.SCROLL_WIDTH);
            this.vscrollbar.setBound(this.width-this.SCROLL_WIDTH, 0, this.SCROLL_WIDTH, this.viewHeight);
            if(dx !== 0){
                this.hscrollbar.setPosition(this.viewWidth/contentWidth);
            }            
            if(dy !== 0){
                this.vscrollbar.setPosition(this.viewHeight/contentHeight);
            }
            
            this.draw();
        },
        draw: function() {
            var cwidth = this.width;
            var cheight = this.height;
            var ctx = this.ctx;
            var theme = this.theme;
            var lineHeight = this.fm.getHeight();
            var charWidth = this.fm.getWidth();
            var pad = this.fm.getBaseLine()-lineHeight;
            var model = this.api.model;
            var vwidth = this.viewWidth;
            var vheight = this.viewHeight;

            
            var visibleLines = Math.ceil(vheight/lineHeight);
            var firstVisibleLine = Math.floor(Math.abs(this.y/lineHeight));
            var lastVisibleLine = firstVisibleLine+visibleLines;
            if(lastVisibleLine > model.getLineCount()) {
                lastVisibleLine = model.getLineCount();
            }

            var maxNumberSize = (''+model.getLineCount()).length;

            ctx.fillStyle = theme.backgroundColor;
            ctx.fillRect(0, 0, cwidth, cheight);

            ctx.fillStyle = theme.borderBackgroundColor;
            ctx.fillRect(0, 0, this.rulerWidth, cheight);

            ctx.save();
            ctx.translate(0, this.y);

            ctx.font = theme.fontSize+'px '+theme.font;

            // //console.log('firstVisibleLine',firstVisibleLine);
            // //console.log('lastVisibleLine',lastVisibleLine);
            // //console.log('visibleLines',visibleLines);

            //draw line numbers
            var x = 5, y = lineHeight*firstVisibleLine+lineHeight;
            ctx.fillStyle = theme.lineNumberColor;
            var currentLine;
            for(currentLine = firstVisibleLine;currentLine <= lastVisibleLine;++currentLine) {
                var line = currentLine+1;

                ctx.fillText(currentLine+1, x+((maxNumberSize-(''+line).length)*charWidth), y);
                y += lineHeight;
            }

            ctx.save();
            ctx.beginPath();
            ctx.rect(this.rulerWidth, -this.y, this.viewWidth, this.viewHeight);
            ctx.closePath();
            ctx.translate(0, 0);
            ctx.clip();

            var lines = model.getLines(firstVisibleLine, lastVisibleLine);
            ctx.fillStyle = theme.fontColor;
            y = lineHeight*firstVisibleLine+lineHeight;
            for(currentLine = 0;currentLine < lines.length;++currentLine) {
                ctx.fillText(lines[currentLine], this.rulerWidth+this.x+this.VIEW_MARGIN, y);
                y += lineHeight;
            }
            ctx.restore();

            ctx.restore();

            this.hscrollbar.draw(this.x/this.dx);
            this.vscrollbar.draw(this.y/this.dy);

        }
    });

})(scode);
