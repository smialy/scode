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
        init: function(ui) {
            this.ui = ui;
            this.pos = this.y = this.x = this.delta = this.barLength = 0;

            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
        },
        setBound: function(x, y, width, height) {
            console.debug('scode.ui.scrollbar.setBound(x='+x+', y='+y+', width='+width+', height='+height+')');
            this.bound = new Rect(x, y, width, height);
            this.canvas.width = width;
            this.canvas.height = height;
            return this;
        },

        draw: function(x, y) {

        }
    });
    var HScrollbar = __.Class(Scrollbar, {
        setSize: function(max, length) {
            console.debug('scode.ui.scrollbar.setSize(max='+max+', length='+length+')');
            this.barLength = max/length*this.bound.width;
            this.delta = this.bound.width-this.barLength;
            this.barLength -= this.bound.height;
            return this;
        },
        draw: function(pos) {
            this.pos = -pos*this.delta;
            var half = this.bound.height/2;
            var ctx = this.ctx;
            ctx.clearRect(0, 0, this.bound.width, this.bound.height);
            ctx.save();

            ctx.strokeStyle = 'rgba(128,128,128,0.5)';
            ctx.lineWidth = 16;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(half, half);
            ctx.lineTo(this.bound.width-half, this.bound.height-half);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 16;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(this.pos+half, half);
            ctx.lineTo(this.pos+half+this.barLength, half);
            ctx.stroke();

            ctx.restore();

            this.ui.ctx.drawImage(this.canvas, this.bound.x, this.bound.y);
        }
    });
    var VScrollbar = __.Class(Scrollbar, {
        setSize: function(max, length) {
            console.debug('scode.ui.scrollbar.setSize(max='+max+', length='+length+')');
            this.barLength = max/length*this.bound.height;
            this.delta = this.bound.height-this.barLength;
            this.barLength -= this.bound.width;
            return this;
        },
        draw: function(pos) {
            this.pos = -pos*this.delta;
            var half = this.bound.width/2;
            var ctx = this.ctx;
            ctx.clearRect(0, 0, this.bound.width, this.bound.height);
            ctx.save();

            ctx.strokeStyle = 'rgba(128,128,128,0.5)';
            ctx.lineWidth = 16;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(half, half);
            ctx.lineTo(half, this.bound.height-half);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 16;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(half, this.pos+half);
            ctx.lineTo(half, this.pos+half+this.barLength);
            ctx.stroke();

            ctx.restore();

            this.ui.ctx.drawImage(this.canvas, this.bound.x, this.bound.y);
        }
    });

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

            this.vscrollbar = new VScrollbar(this);
            this.hscrollbar = new HScrollbar(this);

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
                    this.y+=this.lineHeight;
                    break;
                case 'down':
                    this.y-=this.lineHeight;
                    break;
                case 'left':
                    this.x+=this.charWidth;
                    break;
                case 'right':
                    this.x-=this.charWidth;
                    break;
                case 'pagedown':
                    this.y-=this.viewHeight;
                        break;
                case 'pageup':
                    this.y+=this.viewHeight;
                        break;
                case 'home':
                    this.y = 0;
                    break;
                case 'end':
                    this.y = -this.dy;
                    break;
                default:
                    isDraw = false;
            }
            if(isDraw){
                this.draw();
            }
        },
        _mousedown: function(e) {
            
        },
        _wheel: function(e) {
            e.$stop();
            if(e.shiftKey) {
                this.x += e.$wheel*this.fm.getWidth()*2;
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

            this.rulerWidth = (maxNumberSize+1)*this.charWidth;

            var contentWidth = this.contentWidth = maxLineLength*this.charWidth;
            var contentHeight = this.contentHeight = this.lineCount*this.lineHeight;

            var dx = this.dx = contentWidth+this.rulerWidth > this.width ? contentWidth+this.rulerWidth+this.SCROLL_WIDTH-this.width : 0;
            var dy = this.dy = contentHeight > this.height ? contentHeight+this.SCROLL_WIDTH-this.height : 0;

            this.viewWidth = this.width-this.rulerWidth-this.VIEW_MARGIN;
            if(dx > 0) {
                this.viewWidth -= this.SCROLL_WIDTH;
            }
            this.viewHeight = this.height;
            if(dy > 0) {
                this.viewHeight -= this.SCROLL_WIDTH;
            }
            
            this.vscrollbar.setBound(this.width-this.SCROLL_WIDTH, 0, this.SCROLL_WIDTH, this.viewHeight).setSize(dy, contentHeight);
            this.hscrollbar.setBound(this.rulerWidth, this.viewHeight, this.viewWidth, this.SCROLL_WIDTH).setSize(dx, contentWidth);
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
            ctx.rect(this.rulerWidth, -this.y, this.viewWidth, this.viewHeight);
            ctx.closePath();
            ctx.translate(0, 0);
            ctx.clip();

            var lines = model.getLines(firstVisibleLine, lastVisibleLine);
            ctx.fillStyle = theme.fontColor;
            y = lineHeight*firstVisibleLine+lineHeight;
            for(var currentLine = 0;currentLine < lines.length;++currentLine) {
                ctx.fillText(lines[currentLine], this.rulerWidth+this.x+this.VIEW_MARGIN, y);
                y += lineHeight;
            }
            ctx.restore();

            ctx.restore();

            this.hscrollbar.draw(this.x/vwidth);
            this.vscrollbar.draw(this.y/vheight);

        }
    });

})(scode);
