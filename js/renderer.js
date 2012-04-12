(function () {
    var ChessRenderer = (function() {
        var ChessRenderer = function(DOMElement) {
            return new ChessRenderer.fn.init(DOMElement);
        };

        ChessRenderer.fn = ChessRenderer.prototype = {
            constructor: ChessRenderer,
            
            cellSize: 60,
            domNode: null,
            ctx: null,
            offset: null,
            
            init: function(domNode) {
                this.domNode = domNode;
                this.ctx = domNode.getContext('2d');
                
                $(domNode).css({
                    'border': '1px solid black',
                    'background-image': 'url(./imgs/boardbg.png)',
                    'background-size': '100%',
                    'width': (this.getCellSize() * 8) + 'px',
                    'height': (this.getCellSize() * 8) + 'px',
                    'background-position': '0 0',
                });
                
                this.offset = $(domNode).offset();
                
                domNode.width = domNode.height = this.getCellSize() * 8;
                
                return this;
            },
            
            rotate: function() {
                if ($(this.domNode).css('background-position') == '60px 0px')
                    $(this.domNode).css('background-position', '0 0');
                else
                    $(this.domNode).css('background-position', '60px 0');
            },
            
            getOffset: function() {
                return this.offset;
            },
            
            getCellSize: function() { return this.cellSize; },
            setCellSize: function(size) { this.rescaleDOMNode().cellSize = size; },
            
            rescaleDOMNode: function() {
                $(domNode).css({
                    'width': (this.getCellSize() * 8) + 'px',
                    'height': (this.getCellSize() * 8) + 'px',
                });
                return this;
            },
            
            drawTileAt: function(x, y, imageUrl) {
                this.eraseTile(x, y);
            
                var imageObj = new Image(),
                    referer = this;
                
                $(imageObj).load(function() {
                    referer.ctx.drawImage(this,
                                            referer.getCellSize() * x,
                                            referer.getCellSize() * y,
                                            referer.getCellSize(),
                                            referer.getCellSize());
                });
                
                imageObj.src = './imgs/' + imageUrl + '.png';
            },
            
            eraseTile: function(x, y) {
                this.ctx.clearRect(x * this.getCellSize(), y * this.getCellSize(), this.getCellSize(), this.getCellSize());
            },
        };

        return ChessRenderer;
    })();

    // Give the init function the ChessRenderer prototype for later instantiation
    ChessRenderer.fn.init.prototype = ChessRenderer.fn;

    // Expose ChessRenderer to the global scope
    window.ChessRenderer = ChessRenderer;
})(window);
