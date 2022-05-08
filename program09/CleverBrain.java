import student.tetris.*;          
//---------------------------------------------------------------------         
/**          
 *  Writing a brain class called cleverBrain that is smarter
 *  then lame brain         
 *  @author Joshua Annor (906390831)          
 *  @version (2022.04.01)          
 */

public class CleverBrain implements Brain

{          
    //~ Fields ................................................          

    //~ Constructor ....................................                    
    // ----------------------------------------------------------          
    /**          
     * Initializes a newly created CleverBrain object.          
     */
    public CleverBrain()

    {     
        super();

        /*# Do any work to initialize your class here. */      
    }          
    //~ Methods ...................................          
    /**          
     * Initializes a newly created CleverBrain object.  
     * @param board is a Board    
     * @return totalWidth          
     */          
    public double rateColumn(Board board)

    {          
        double totalHeight = 0.0;          
        int[] colHeight = board.getColumnHeights();          
        for (int i = 0; i < colHeight.length; i++)

        {          
            totalHeight += colHeight[i];          

        }
        return totalHeight;
    }      
    /**          
     * Initializes a newly created CleverBrain object.          
     * @param board is a Board           
     * @return totalWidth          
     */          
    public double rateRow(Board board)
    {          
        double totalWidth = 0.0;          
        int[] rowWidth = board.getBlocksInAllRows();          
        for (int i = 0; i < rowWidth.length; i++)

        {          
            totalWidth += rowWidth[i];          

        }
        return totalWidth;
    }          
    /**          
     * Initializes a newly created CleverBrain object.          
     * @param board is a Board           
     * @param piece is a Peice          
     * @param heightLimit is a int          
     * @return Move          
     */
    public Move bestMove(Board board, Piece piece, int heightLimit)

    {          
        int rotationCount = 0;

        double bestRate = 1000;

        Point bestPoint = new Point(0, 0);

        Piece basePiece = Piece.getPiece(Piece.SQUARE, 0);          

        for (Piece p: piece.getRotations())

        {
            for (int i = 0; i < board.getWidth(); i++)

            {          
                if (p.getWidth() + i <= board.getWidth() )          
                {          
                    int sp = board.rowAfterDrop(p, i);      
                    Point pnt = new Point(i, sp);          
                    int newSpot = board.place(p, pnt);
                    board.clearRows();
                    double rating = rateBoard(board);
                    if ( rating < bestRate)

                    {

                        bestRate = rating;
                        basePiece = p;
                        bestPoint = pnt;
                    }

                    board.undo();
                }

            }
        }
        Move move = new Move(basePiece);
        move.setLocation(bestPoint);     
        move.setScore(bestRate);
        return move;

    }
    /**          
     * Initializes a newly created CleverBrain object.                  
     * @param board         
     * @return rating          
     */
    public double rateBoard(Board board)          
    {     
        double rating = rateColumn(board) + rateRow(board);                
        return rating;

    }

}