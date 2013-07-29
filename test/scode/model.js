(function() {

    TestCase("scode.model", {
        'test init empty model': function() {
            var model = new scode.Model();

            assertEquals(0, model.length());
            assertEquals(1,model.getLineCount());
            assertEquals(0,model.getMaxLineLength(1));
            assertEquals('',model.charAt(0, 0));
            assertEquals('',model.charAt(0, 1));
            assertEquals('', model.getLine(0));
            assertEquals([''],model.getLines(0,1));
            assertEquals([],model.getLines(1,2));
        },
        'test init model with single line text': function() {
            var txt = 'Text';
            var model = new scode.Model(txt);

            assertEquals(txt.length, model.length());
            assertEquals(1,model.getLineCount());
            assertEquals(4,model.getMaxLineLength(1));
            assertEquals('T',model.charAt(0, 0));
            assertEquals('',model.charAt(1, 1));
            assertEquals('Text', model.getLine(0));
            assertEquals(['Text'],model.getLines(0,1));
            assertEquals([],model.getLines(1,3));
        },
        'test init model with text': function() {
            var txt = 'Some\nmulitline\ntext\nexample';
            var model = new scode.Model(txt);

            assertEquals(txt.length, model.length());
            assertEquals(4,model.getLineCount());
            assertEquals(9,model.getMaxLineLength(1));
            assertEquals('S',model.charAt(0, 0));
            assertEquals('u',model.charAt(1, 1));
            assertEquals('Some', model.getLine(0));
            assertEquals(['Some'],model.getLines(0,1));
            assertEquals(['mulitline','text'],model.getLines(1,3));
        }
    });
})();
