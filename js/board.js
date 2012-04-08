(function () {
    var chessBoard = (function() {
        var chessBoard = function(DOMElement) {
            DOMElement.width = DOMElement.height = chessBoard.fn.getCellSize() * 8;
            // Append click handler
            $(DOMElement).click(function(eventData) {
                chessBoard.fn.onClick(eventData);
            });

            return new chessBoard.fn.init(DOMElement);
        };

        chessBoard.fn = chessBoard.prototype = {
            // DOM node
            domNode: null,
            context: null,

            // Defines the size of a cell, can be scaled up or down.
            cellSize: 60,

            //! Bitboard containing pieces. Each field will have an instance of
            //! the piece-related class and a flag describing the piece (faster
            //! than instanceof calls).
            _bitBoard: [[], [], [], [], [], [], [], []],

            //! Whose turn is it to play
            _whoseTurnIsIt: ChessEnums.Turn.TURN_WHITE,

            //! Side chosen by the player - White per default
            _playerSide: ChessEnums.Turn.TURN_WHITE,
            
            // Controls if tiles have already been loaded to image datas
            _tilesReady: false,
            
            // Controls castling allowing
            _canCastle: [true, true],

            constructor: chessBoard,

            /*
             * @description Class constructor
             * @returns     Instance of the object, or false if an invalid
             *              DOM element has been passed as a parameter.
             */
            init: function(DOMElement) {
                this.domNode = DOMElement;
                this.context = this.domNode.getContext('2d');

                // Load and draw data
                this.scaleDOMNode();
                Tiles.initTiles();
                this.initBoard();

                return this;
            },
            
            initBoard: function() {
                this.cleanBoard();
                var sideBottom = (this._playerSide == ChessEnums.Turn.TURN_BLACK ? Tiles.TILE_WHITE_PAWN : Tiles.TILE_BLACK_PAWN);
                for (var i = 0; i < 8; i++) {
                    var tile = new Image(),
                        ctx = this;
                    $(tile).load(function() {
                        ctx.context.drawImage(tile, ctx.getCellSize() * i, ctx.getCellSize())
                    });
					tile.src = Tiles.getTile(sideBottom);
				}
            },

            getCellSize: function() { return this.cellSize; },
            setCellSize: function(size) { this.cellSize = size; this.scaleDOMNode(); },
            
            /*
             * @description Updates board display style
             */
            scaleDOMNode: function() {
                $(this.domNode).css({
                    'width':  this.getCellSize() * 8 + 'px',
                    'height': this.getCellSize() * 8 + 'px',
                    'border': '1px solid black',
                    'background-image': 'url(./imgs/boardbg.png)',
                    'background-size': '100%'
                });
            },

            /*
             * @description Erases the canvas' content
             */
            cleanBoard: function() {
                this.context.clearRect(0, 0, this.getCellSize() * 8, this.getCellSize() * 8);
            },

            /*
             * @description Erase a cell [x, y]
             */
            eraseCell: function(x, y) {
                this.context.clearRect(x, y, x + this.getCellSize(), y + this.getCellSize());
            },

            /*
             * @description Draws tiles after a complete context erasing
             */
            drawTiles: function() {
                this.cleanBoard();
            },

            /*
             * @description Draws a tile provided by its ID to a specific cell [x, y]
             */
            drawTileToCell: function(tileId, x, y) {
                if (tileId > Tiles.MAX_TILE_NUMBER || tileId < 0)
                    return;

                this.eraseCell(x, y);
                this.context.putImageData(this.imageDataTiles[tileId], x * this.getCellSize(), y * this.getCellSize());
            },

            /*
             * @description Determines wether the player can move
             */
            canPlayerMove: function() { return this._whoseTurnIsIt == this._playerSide; },

            /*
             * @description Switches turn state
             */
            toggleTurn: function() { this._whoseTurnIsIt *= ChessEnums.Turn.TURN_BLACK; },

            /*
             * @description Handles click interaction with the canvas
             */
            onClick: function(eventData) {
                var clickX = eventData.offsetX,
                    clickY = eventData.offsetY;
            },
        };

        return chessBoard;
    })();

    // Give the init function the chessBoard prototype for later instantiation
    chessBoard.fn.init.prototype = chessBoard.fn;

    // Expose chessBoard to the global scope
    window.chessBoard = chessBoard;
})(window);
