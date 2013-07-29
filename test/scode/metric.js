(function() {

    TestCase("scode.metric", {
        'test init': function() {
            var fm = new scode.FontMetric();

            assertNotNull(fm.getWidth());
            assertNotNull(fm.getHeight());
            assertNotNull(fm.getBaseLine());
            
        }
    });
})();
