(function(__) {

    var Scrollbar = __.Class({
        init: function(ui) {
            this.ui = ui;
            this.pos = this.y = this.x = this.delta = this.barLength = 0;

            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
        },

        setBound: function(x, y, width, height) {
            //console.debug('scode.ui.scrollbar.setBound(x='+x+', y='+y+',
            // width='+width+', height='+height+')');
            this.bound = new __.Rect(x, y, width, height);
            this.canvas.width = width;
            this.canvas.height = height;
            return this;
        },
        setPosition: function(fraction) {
            //console.debug('scode.ui.scrollbar.setPosition(fraction='+fraction+')');
            var size = this.getSize();
            this.barLength = Math.max(fraction*size.length, size.width);
            this.delta = size.length-this.barLength-size.width;
            
            return this;
        },
        getSize: function() {
            return {
                width:this.bound.width,
                length:this.bound.height
            };
        },
        draw: function(x, y) {

        }
    });
    __.HScrollbar = __.Class(Scrollbar, {
        getSize: function() {
            //need revert values
            return {
                width:this.bound.height,
                length:this.bound.width
            };
        },
        mousedown: function(e) {
            var pos = this.ui.getCoords();
            var cx = e.$client.x-pos.x-this.bound.x;
            //click in handler
            if(this.pos <= cx&&cx <= this.pos+this.barLength+this.getSize().width) {
                this.mouseposition = e.$client.x;
                this.mousedownpos = this.pos;
            } else {
                if(cx < this.pos) {
                    this.ui.addX(this.ui.viewWidth);
                } else if(cx > this.pos+this.barLength) {
                    this.ui.addX(-this.ui.viewWidth);
                }
            }

        },
        mousemove: function(e) {
            if(this.mouseposition) {
                var diff = e.$client.x-this.mouseposition;
                this.ui.setX(-this.ui.dx*(diff+this.mousedownpos)/this.delta);
            }
        },
        mouseup: function(e) {
            this.mouseposition = null;
        },
        draw: function(pos) {
            if(!this.delta) {
                return;
            }
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
    __.VScrollbar = __.Class(Scrollbar, {
        mousedown: function(e) {
            e.$stop();
            var pos = this.ui.getCoords();
            var cy = e.$client.y-pos.y;
            //click in handler
            if(this.pos <= cy&&cy <= this.pos+this.barLength+this.getSize().width) {
                this.mouseposition = e.$client.y;
                this.mousedownpos = this.pos;
            } else {
                if(cy < this.pos) {
                    this.ui.addY(this.ui.viewHeight);
                } else if(cy > this.pos+this.barLength) {
                    this.ui.addY(-this.ui.viewHeight);
                }
            }

        },
        mousemove: function(e) {
            e.$stop();
            if(this.mouseposition) {
                var diff = e.$client.y-this.mouseposition;
                this.ui.setY(-this.ui.dy*(diff+this.mousedownpos)/this.delta);
            }
        },
        mouseup: function(e) {
            this.mouseposition = null;
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

})(scode);
