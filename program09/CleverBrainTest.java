import student.micro.*;          
import static org.assertj.core.api.Assertions.*;          
import student.tetris.*;                    
// ----------------------------------------------------          
/**
 * testing the Clever class
 *  @author Joshua Annor (906390831)
 *  @version (2022.04.05)
 */
public class CleverBrainTest extends TestCase
{
    //~ Fields ......................................................
    private CleverBrain brain;

    //~ Constructor ...................................................

    // ----------------------------------------------------------
    /**
     * Creates a new CleverBrainTest test object.
     */
    public CleverBrainTest()
    {
        // The constructor is usually empty in unit tests, since it runs
        // once for the whole class, not once for each test method.
        // Per-test initialization should be placed in setUp() instead.
    }

    //~ Methods ...............................................................
    // ----------------------------------------------------------
    /**
     * Sets up the test fixture.
     * Called before every test case method.
     */
    public void setUp()
    {
        /*# Insert your own setup code here */
        brain = new CleverBrain();
        

        
    }
    /**
     * Sets up the test fixture.
     * Called before every test case method testRateBoard.
     */
    public void testRateBoardOnRow0()
    {
        // myBrain is initialized in setUp()          
        // First, set up board to use in this test          
        Board start2 = new Board(10, 24,          
                "# # # # # ",          
                " # # # # #"          
            );          

        // Now call the brain          
        double score = brain.rateBoard(start2);          

        // Use your own expected score instead          
        assertThat(score).isEqualTo(25.0, within(0.001));
    }
    /**
     * Sets up the test fixture.
     * Called before every test case method bestMove.
     */
    public void testLonRow0()
    {
        Board board = new Board(10, 24,

                "#### #####"          
            );          
        Piece piece  = Piece.getPiece(Piece.RIGHT_L, 0);          

        // Now call the brain          
        Move move = brain.bestMove(board, piece, 20);          

        // Expect the lower left destination is where the hole is          
        assertThat(move.getLocation()).isEqualTo(new Point(4, 0));          
        // Expect the piece is rotated counter-clockwise 3 times          
        assertThat(move.getPiece()).isEqualTo(          
            Piece.getPiece(Piece.RIGHT_L, 3));          
    }
    // ----------------------------------------------------------
    /*# Insert your own test methods here */

}
