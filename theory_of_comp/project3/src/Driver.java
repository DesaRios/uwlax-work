/* 
 * Adrian Rios
 * Project 3
 * Introduction to Theory of Computation
 * Spring 2025
 * 
 */

import java.io.IOException;

class Driver {
    public static void main(String[] args) {
        // No args were given
        if(args.length < 1) {
            System.out.println("USAGE: --info <FILENAME> | --run <FILENAME> <INPUT> <MOVELIMIT> | --language <FILENAME> <LENGTHLIMIT> <MOVELIMIT>");
            System.exit(1);
        }

        switch (args[0]) {
            case "--info" : {
                // no filename given
                if(args.length != 2) {
                    System.out.println("USAGE: --info <FILENAME>");
                    System.exit(1);
                }

                try {
                    info(args[1]);
                } catch(IOException e) {
                    System.out.println("IOException");
                    System.exit(1);
                }
                break;
            }
            case "--run" : {
                if(args.length != 4) {
                    System.out.println("USAGE: --run <FILENAME> <INPUT> <MOVELIMIT>");
                    System.exit(1);
                }

                try {
                    run(args[1], args[2], Integer.parseInt(args[3]));
                } catch(IOException e) {
                    System.out.println("IOException");
                    System.exit(1);
                }
                break;
            }
            case "--language" : {
                if(args.length != 4) {
                    System.out.println("USAGE: --language <FILENAME> <INPUT> <MOVELIMIT>");
                    System.exit(1);
                }

                try {
                    language(args[1], Integer.parseInt(args[2]), Integer.parseInt(args[3]));
                } catch(IOException e) {
                    System.out.println("IOException");
                    System.exit(1);
                }
                break;
            }
            default: {
                System.out.println("USAGE: --info <FILENAME> | --run <FILENAME> <INPUT> <MOVELIMIT> | --language <FILENAME> <LENGTHLIMIT> <MOVELIMIT>");
                System.exit(1);
            }
        }
    }

    public static void info(String filename) throws IOException{
        TM machine = new TM(filename);
        System.out.println(machine.info());
    }

    public static void run(String filename, String input, int moveLimit) throws IOException {
        TM machine = new TM(filename);
        if(input.equals("\"\"") || input.equals("emptystring")) input = ""; /* included emptystring use case so i could test on windows */
        System.out.printf("Running on input [%s] with limit %d:\n", input, moveLimit);
        machine.run(input, moveLimit, true);
    }

    public static void language(String filename, int lengthLimit, int moveLimit) throws IOException {
        TM machine = new TM(filename);
        System.out.println(machine.language(lengthLimit, moveLimit));
    }
}