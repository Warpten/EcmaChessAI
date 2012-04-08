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

            // Bitboard containing pieces. Each field will have an instance of
            // the piece-related class and a flag describing the piece (faster
            // than instanceof calls).
            _bitBoard: [[], [], [], [], [], [], [], []],

            // Whose turn is it to play
            _whoseTurnIsIt: ChessEnums.Turn.TURN_WHITE,

            // Side chosen by the player - White per default
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
            
            /*
             * @description Handles diagram rotation when the player chooses to switch sides.
             *              Warning, resets the game to the starting position
             */
            switchSide: function() {
                this._playerSide *= ChessEnums.Turn.TURN_BLACK;
                this.initBoard(this.context, this.getCellSize());
                if (this._playerSide == ChessEnums.Turn.TURN_BLACK)
                    $(this.domNode).css('background-position', this.getCellSize() + 'px 0px');
                else $(this.domNode).css('background-position', '0px 0px');
            },
            
            /*
             * @description Fills the diagram's inital state
             */
            initBoard: function(drawingContext, cellSize) {
                this.cleanBoard();
                
                var tileID = this._playerSide == ChessEnums.Turn.TURN_WHITE ? Tiles.TILE_WHITE_KING : Tiles.TILE_BLACK_KING;
                var initPosition = function(coords, ref) {
                    var tile = new Image();
                    $(tile).load(function() {
                        ref.context.drawImage(this, ref.getCellSize() * coords[0], ref.getCellSize() * (7 - coords[1]), ref.getCellSize(), ref.getCellSize());
                    });
                    tile.src = Tiles.getTile(tileID);
                    
                    //            y         x
                    ref._bitBoard[7 - coords[1]][coords[0]] = new Piece(coords, tileID);
                    
                    var secondTile = new Image();
                    $(secondTile).load(function() {
                        ref.context.drawImage(secondTile, ref.getCellSize() * coords[0], ref.getCellSize() * coords[1], ref.getCellSize(), ref.getCellSize());
                    });
                    secondTile.src = Tiles.getTile(tileID - 6 * ref._playerSide);
                    
                    //            y         x
                    ref._bitBoard[coords[1]][coords[0]] = new Piece(coords, tileID - 6 * ref._playerSide);
                };

                // Kings
                initPosition([4, 0], this);

                // Queen
                ++tileID;
                initPosition([3, 0], this);
                
                // Bishops
                ++tileID;
                initPosition([2, 0], this);
                initPosition([5, 0], this);
                
                // Knights
                ++tileID;
                initPosition([1, 0], this);
                initPosition([6, 0], this);
                
                // Rooks
                ++tileID;
                initPosition([0, 0], this);
                initPosition([7, 0], this);
                
                // Pawns
                ++tileID;
                for (var i = 0; i < 8; i++)
                    initPosition([i, 1], this);
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
             * @about       Non-implemented yet
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
             * @description Switches turn state to determine if the player can move.
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
