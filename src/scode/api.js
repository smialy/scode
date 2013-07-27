(function(__) {
    
    __.SCode = __.Class({
        init: function(dom, options) {
            this.options = __.ext({
                width:0,
                height:0,
                autosize:true,
                theme: {
                    font:'Monaco, "Courier New", Courier, monospace',
                    fontSize:14,
                    fontColor:'#fff',
                    backgroundColor:'#000',
                    borderBackgroundColor:'#ddd',
                    lineNumberColor:'#000'
                    
                }
            }, options);
            this.dom = dom;

            this.ui = new __.UI(this);
            this.model = new __.Model();

            this.setFocus(true);
            this.resize();
        },
        setFocus: function(focus) {
            this.ui.setFocus(focus);
        },
        refresh: function() {
            this.ui.refresh();
        },
        resize: function() {
            var width = this.options.autosize ? this.dom.offsetWidth : this.options.width;
            var height = this.options.autosize ? this.dom.offsetHeight : this.options.height;
            this.ui.setSize(width, height);
        },
        setSize: function(width, height) {
            this.options.width = width;
            this.options.height = height;
            this.ui.setSize(width, height);
            this.refresh();
        },
        setText: function(txt) {
            this.model.setText(txt);
            this.refresh();
        }
    });

})(scode);
