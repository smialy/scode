(function(__) {
    __.UI = __.Class({
        init: function(api) {
            this.api = api;
            this.theme = api.options.theme;
            this.canvas = document.createElement('canvas');
            this.canvas.tabindex = -1;
            this.canvas.style.display = 'block';
            this.ctx = this.canvas.getContext('2d');

            this.fm = new __.FontMetric(this.theme.font, this.theme.fontSize);
            api.dom.appendChild(this.canvas);

            this.x = 0;
            this.y = -10;

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
            this._width = this.canvas.width = width;
            this._height = this.canvas.height = height;
        },
        refresh: function() {
            this.paint();
        },
        paint: function() {
            var cwidth = this._width;
            var cheight = this._height;
            var ctx = this.ctx;
            var theme = this.theme;
            var lineHeight = this.fm.getHeight();
            var charWidth = this.fm.getWidth();
            var baseLine = this.fm.getBaseLine();

            var visibleLines = Math.ceil(cheight/lineHeight);
            var firstVisibleLine = Math.floor(Math.abs(this.y/lineHeight));
            var lastVisibleLine = firstVisibleLine+visibleLines;
            if(lastVisibleLine > this.api.model.getLineCount()) {
                lastVisibleLine = this.api.model.getLineCount();
            }

            var border = 10+(''+lastVisibleLine).length*charWidth;

            ctx.fillStyle = theme.backgroundColor;
            ctx.fillRect(0, 0, cwidth, cheight);

            ctx.fillStyle = theme.borderBackgroundColor;
            ctx.fillRect(0, 0, border, cheight);

            ctx.save();
            ctx.translate(0, this.y);

            ctx.font = theme.fontSize+'px '+theme.font;
            console.log('firstVisibleLine',firstVisibleLine);
            console.log('lastVisibleLine',lastVisibleLine);
            console.log('visibleLines',visibleLines);
            //draw line numbers
            var x = 5, y = lineHeight*firstVisibleLine+lineHeight;
            ctx.fillStyle = theme.lineNumberColor;
            for(var currentLine = firstVisibleLine;currentLine <= lastVisibleLine;++currentLine) {
                ctx.fillText(currentLine+1, x, y);
                y += lineHeight;
            }

            ctx.save();
            ctx.beginPath();
            ctx.rect(border, -this.y, cwidth-border, cheight);
            ctx.closePath();
            ctx.translate(0, 0);
            ctx.clip();

            var lines = this.api.model.getLines(firstVisibleLine, lastVisibleLine);
            console.log(lines);
            ctx.fillStyle = theme.fontColor;
            y = lineHeight*firstVisibleLine+lineHeight;
            for(var currentLine = 0;currentLine < lines.length;++currentLine) {
                ctx.fillText(lines[currentLine], border+10, y);
                y += lineHeight;
            }
            ctx.restore();

            ctx.restore();

        }
    });

})(scode);
