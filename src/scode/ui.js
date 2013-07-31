(function(__) {
    var Rect = __.Class({
        init: function(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.x2 = x+width;
            this.y2 = y+height;
        },
        contains: function(point) {
            return this.x <= point.x&&this.x2 >= point.x&&this.y <= point.y&&this.y2 >= point.y;
        }
    });
    var Scrollbar = __.Class({
        init: function(ui, type) {
            this.ui = ui;
            this._type = type;
            this.pos = 0;

            this._canvas = document.createElement('canvas');
            this._ctx = this._canvas.getContext('2d');
        },
        setBound: function(x, y, width, height) {
            console.debug('scode.ui.scrollbar.setBound(x='+x+', y='+y+', width='+width+', height='+height+')');
            this._x = x;
            this._y = y;
            this._canvas.width = this._width = width;
            this._canvas.height = this._height = height;
            return this;
        },
        setSize: function(view, content) {

        },
        draw: function(x, y) {

        }
    });
    var HScrollbar = __.Class(Scrollbar, {
        init: function(ui) {
            this.$base(ui, 'horizontal');
        },
        setSize: function(offset, length) {
            console.debug('scode.ui.scrollbar.setSize('+offset+','+length+')');
            //this.barSize = dx/content*this._width;
            //this.delta = this._width-this.barSize;
            this.delta = 0;
            return this;
        },
        draw: function(pos) {
            this.pos = -pos*this.delta;
            var half = this._height/2;
            var ctx = this._ctx;
            ctx.clearRect(0, 0, this._width, this._height);
            ctx.save();

            ctx.strokeStyle = 'rgba(128,128,128,0.5)';
            ctx.lineWidth = 16;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(half, half);
            ctx.lineTo(this._width-4-half, half);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 16;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(this.pos+half, half);
            ctx.lineTo(this.pos+this.barSize-half, half);
            ctx.stroke();

            ctx.restore();

            this.ui.ctx.drawImage(this._canvas, this._x, this._y);
        }
    });
    var VScrollbar = __.Class(Scrollbar, {
        init: function(ui) {
            this.$base(ui, 'vertical');
        },
        setSize: function(offset, length) {
            console.debug('scode.ui.scrollbar.setSize('+offset+','+length+')');
            this.delta = 0
            return this;
        },
        draw: function(pos) {
            this.pos = -pos*this.delta;
            var half = this._width/2;
            var ctx = this._ctx;
            ctx.clearRect(0, 0, this._width, this._height);
            ctx.save();

            ctx.strokeStyle = 'rgba(128,128,128,0.5)';
            ctx.lineWidth = 16;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(half, half);
            ctx.lineTo(half, this._height-4-half);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 16;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(half, this.pos+half);
            ctx.lineTo(half, this.pos+this.barSize-half);
            ctx.stroke();

            ctx.restore();

            this.ui.ctx.drawImage(this._canvas, this._x, this._y);
        }
    });

    __.UI = __.Class({
        init: function(api) {
            this.api = api;
            this.theme = api.options.theme;
            this.model = api.model;

            this.canvas = document.createElement('canvas');
            this.canvas.tabindex = -1;
            this.canvas.style.display = 'block';
            this.ctx = this.canvas.getContext('2d');

            this.fm = new __.FontMetric(this.theme.font, this.theme.fontSize);
            var dom = api.dom;
            dom.appendChild(this.canvas);

            this.vscrollbar = new VScrollbar(this);
            this.hscrollbar = new HScrollbar(this);

            __.on(dom, 'mousewheel', this._wheel, this);

            this.x = 0;
            this.y = 0;

        },
        dispose: function() {

        },
        _wheel: function(e) {
            e.$stop();
            if(e.shiftKey) {
                this.x += e.$wheel*this.fm.getWidth();
            } else {
                this.y += e.$wheel*this.fm.getHeight();
            }
            this.draw();
        },
        setFocus: function(focus) {
            console.log('scode.Ui::setFocus('+focus+')');
            this._focus = focus;
            if(focus) {
                this.canvas.focus();
            }
        },
        setSize: function(width, height) {
            console.log('scode.Ui::setSize('+width+','+height+')');
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
            
            this.rulerWidth = 10+maxNumberSize*this.charWidth;
            this.scrollWidth = 20;
            
            var contentWidth = maxLineLength*this.charWidth;
            var contentHeight = this.lineCount*this.lineHeight;
            
            
            
            var dx = contentWidth+this.rulerWidth > this.width ? contentWidth+this.rulerWidth+this.scrollWidth-this.width : 0;
            var dy = contentHeight > this.height ? contentHeight+this.scrollWidth-this.height : 0;
            console.log(contentWidth, contentHeight);
            console.log(dx, dy);
            
            this.viewWidth = this.width-this.rulerWidth;
            if(dx > 0){
                this.viewWidth-=this.scrollWidth;
            }
            this.viewHeight = this.height;
            if(dy > 0){
                this.viewHeight-=this.scrollWidth;
            }
            this.vscrollbar.setBound(this.viewWidth, 0, this.scrollWidth, this.viewHeight).setSize(dy, contentHeight);
            this.hscrollbar.setBound(0, this.viewHeight, this.viewWidth, this.scrollWidth).setSize(dx, contentWidth);
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

            if(this.x > 0) {
                this.x = 0;
            }
            if(this.x < -vwidth) {
                this.x = -vwidth
            }
            if(this.y > 0) {
                this.y = 0;
            }
            if(this.y < -vheight) {
                this.y = -vheight;
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
            ctx.fillRect(0, 0, this.rulerWidth, cheight);

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
            ctx.rect(border, -this.y, this.viewWidth, this.viewHeight);
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

            this.hscrollbar.draw(this.x/vwidth);
            this.vscrollbar.draw(this.y/vheight);

        }
    });

})(scode);
