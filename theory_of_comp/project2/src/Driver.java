/* 
 * Adrian Rios
 * CS453
 * Project 2
 */

package project2.src;


import java.io.IOException;

public class Driver {
    private static String filename;
    private static String flag;
    private static PDA machine;
    private static String input;
    private static int moveLimit;
    private static int lengthLimit;
    private static int derivLimit;
    private static String outfilename;

    public static void main(String[] args) {
        if(args.length < 1) {
            System.out.println("ERROR | Provide arguments");
            System.exit(1);
        }
        switch(args[0]) {
            case "--info-pda" : {
                if(args.length < 2) {
                    System.out.println("ERROR | USAGE: Driver --info-pda <FILENAME>");
                    System.exit(1);
                }
                else {
                    try {
                        infoPDA(args[1]);
                    } catch(IOException e) {
                        System.out.println("ERROR | IOException");
                        System.exit(1);
                    }
                }
                break;
            }
            case "--run" : {
                if(args.length < 4) {
                    System.out.println("ERROR | USAGE: Driver --run <FILENAME> <INPUT> <MOVELIMIT>");
                    System.exit(1);
                }
                else {
                    try {
                        runPDA(args[1], args[2], Integer.parseInt(args[3]));
                    }
                    catch(IOException e) {
                        System.out.println("ERROR | IOException");
                        System.exit(1);
                    }
                }
                break;
            }
            case "--language" : {
                if(args.length < 4) {
                    System.out.println("ERROR | USAGE: Driver --run <FILENAME> <LENGTHLIMIT> <MOVELIMIT>");
                    System.exit(1);
                }
                else {
                    try {
                        languagePDA(args[1], Integer.parseInt(args[2]), Integer.parseInt(args[3]));
                    }
                    catch(IOException e) {
                        System.out.println("ERROR | IOException");
                        System.exit(1);
                    }
                }
                break;
            }
            case "--info-cfg" : {
                if(args.length < 2) {
                    System.out.println("ERROR | USAGE: Driver --info-cfg <FILENAME>");
                    System.exit(1);
                }
                else {
                    try {
                        infoCFG(args[1]);
                    } catch(IOException e) {
                        System.out.println("ERROR | IOException");
                        System.exit(1);
                    }
                }
                break;
            }
            case "--derivations" : {
                if(args.length < 3) {
                    System.out.println("ERROR | USAGE: Driver --derivations <FILENAME> <DERIVLIMIT>");
                    System.exit(1);
                }
                else {
                    try {
                        derivationsCFG(args[1], Integer.parseInt(args[2]));
                    } catch(IOException e) {
                        System.out.println("ERROR | IOException");
                        System.exit(1);
                    }
                }
                break;
            }
            case "--sentences" : {
                if(args.length < 3) {
                    System.out.println("ERROR | USAGE: Driver --sentences <FILENAME> <DERIVLIMIT>");
                    System.exit(1);
                }
                else {
                    try {
                        sentencesCFG(args[1], Integer.parseInt(args[2]));
                    } catch(IOException e) {
                        System.out.println("ERROR | IOException");
                        System.exit(1);
                    }
                }
            }
            case "--to-pda" : {
                if(args.length < 2) {
                    System.out.println("ERROR | USAGE: Driver --to-pda <FILENAME> [-o <OUTPUTFILENAME>]");
                    System.exit(1);
                }
                else if (args.length == 2) {
                    try {
                        toPDA(args[1]);
                    } catch(IOException e) {
                        System.out.println("ERROR | IOException");
                        System.exit(1);
                    }
                }
                else if(args.length == 4) {
                    try {
                        toPDA(args[1], args[3]);
                    } catch(IOException e) {
                        System.out.println("ERROR | IOException");
                        System.exit(1);
                    }
                }
            }
        }
    }

    private static void infoPDA(String filename) throws IOException {
        machine = new PDA(filename);
        System.out.println(machine.info());
    }

    private static void runPDA(String filename, String input, int moveLimit) throws IOException {
        if(input.equals("\"\"")) input = ""; // Can't test on windows

        machine = new PDA(filename);
        System.out.printf("Running on input [%s] with limit %d:\n", input, moveLimit);
        int result = machine.run(input, moveLimit, true);

        if(result == 1) {
            System.out.println("ACCEPT");
        }
        else if(result == -1) {
            System.out.println("REJECT");
        }
        else {
            System.out.println("LIMIT");
        }
    }

    private static void languagePDA(String filename, int lengthLimit, int moveLimit) throws IOException{
        machine = new PDA(filename);

        System.out.println(machine.language(lengthLimit, moveLimit));
    }

    private static void infoCFG(String filename) throws IOException {
        CFG grammar = new CFG(filename);
        System.out.println(grammar.info());
    }

    private static void derivationsCFG(String filename, int derivLimit) throws IOException {
        CFG grammar = new CFG(filename);
        System.out.println("Derivations:");
        grammar.derivations(derivLimit);
    }

    private static void sentencesCFG(String filename, int derivLimit) throws IOException {
        CFG grammar = new CFG(filename);
        System.out.println(grammar.sentences(derivLimit));
    }

    private static void toPDA(String filename) throws IOException {
        CFG grammar = new CFG(filename);
        PDA machine = grammar.toPDA();
        System.out.println(machine.info());
    }

    private static void toPDA(String filename, String outfile) throws IOException {
        CFG grammar = new CFG(filename);
        PDA machine = grammar.toPDA();
        machine.writeDescriptionToFile(outfile);
    }
}
