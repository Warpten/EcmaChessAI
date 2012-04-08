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
                this.initBoard(this.context, this.getCellSize());

                return this;
            },
            
            switchSide: function() {
                this._playerSide *= ChessEnums.Turn.TURN_BLACK;  
                this.initBoard(this.context, this.getCellSize());
                $(this.DOMelement).css({
                   'background-position': (this._playerSide == ChessEnums.Turn.TURN_BLACK ? this.getCellSize() + 'px 0' : '0px 0px')
                });
            },
            
            initBoard: function(drawingContext, cellSize) {
                this.cleanBoard();
                
                var tileID = this._playerSide == ChessEnums.Turn.TURN_WHITE ? Tiles.TILE_WHITE_KING : Tiles.TILE_BLACK_KING;
                var initPosition = function(cellSize, coords, ref) {
                    var tile = new Image();
                    tile.src = Tiles.getTile(tileID);
                    ref.context.drawImage(tile, cellSize * coords[0], cellSize * (7 - coords[1]), cellSize, cellSize);
                    var secondTile = new Image();
                    secondTile.src = Tiles.getTile(tileID - 6 * ref._playerSide);
                    ref.context.drawImage(secondTile, cellSize * coords[0], cellSize * coords[1], cellSize, cellSize);
                };

                // Kings
                initPosition(this.getCellSize(), [4, 0], this);

                // Queen
                ++tileID;
                initPosition(this.getCellSize(), [3, 0], this);
                
                // Bishops
                ++tileID;
                initPosition(this.getCellSize(), [2, 0], this);
                initPosition(this.getCellSize(), [5, 0], this);
                
                // Knights
                ++tileID;
                initPosition(this.getCellSize(), [1, 0], this);
                initPosition(this.getCellSize(), [6, 0], this);
                
                // Rooks
                ++tileID;
                initPosition(this.getCellSize(), [0, 0], this);
                initPosition(this.getCellSize(), [7, 0], this);
                
                // Pawns
                ++tileID;
                for (var i = 0; i < 8; i++)
                    initPosition(this.getCellSize(), [i, 1], this);
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

