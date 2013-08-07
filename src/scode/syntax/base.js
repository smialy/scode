(function(__) {

    var engines = {};
    var syntax = __.syntax = {
        getSyntaxStyle: function(line, language) {
            if( language in engines) {
                return engines[language].highlight(line, language);
            }
            throw new Error('Not found syntax engine for language: '+language);
        },
        getSyntaxStyles: function(lines, language) {
            var buff = [];
            for(var i = 0, j = lines.length;i < j;i++) {
                buff.push(this.getSyntaxStyle(lines[i], language));
            }
            return buff;

        },
        register: function(engine) {
            engines[engine.language] = engine;
        }
    };

    syntax.Engine = __.Class({
        init: function(language) {
            this.language = language;
        },
        getstylePerLine: function(text, lineNumber) {
            return [];
        }
    });

    var PlainEngine = __.Class(syntax.Engine, {
        init: function() {
            this.$base('plain');
        },
        highlight: function(line) {
            return [{
                type:'plain',
                start:0,
                stop:line.length,
                text:line
            }];
        }
    });

    var JavaScriptEngine = __.Class(syntax.Engine, {
        init: function() {
            this.$base('javascript');
            this.keywords = ['break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'finally', 'for', 'function', 'if', 'in', 'instanceof', 'new', 'return', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while'];
        },
        highlight: function(line) {

        }
    });
    syntax.register(new PlainEngine());
    syntax.register(new JavaScriptEngine());
    __.syntax = syntax;
})(scode);
