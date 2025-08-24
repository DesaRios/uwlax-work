package project2.src;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class PDA {
    private ArrayList<State> states;
    private ArrayList<Character> inputAlphabet;
    private ArrayList<Character> stackAlphabet;
    private TransitionTable transitionTable;
    private State startState;
    private ArrayList<State> acceptStates;
    public static final char EPSILON = ' ';

    public PDA(String filename) throws IOException {
        // Instantiate input and stack alphabet lists
        inputAlphabet = new ArrayList<>();
        stackAlphabet = new ArrayList<>();

        // Instantiate states and transition table
        states = new ArrayList<>();
        acceptStates = new ArrayList<>();
        startState = null;
        transitionTable = new TransitionTable();

        readFromFile(filename);
    }

    public PDA() {
        inputAlphabet = new ArrayList<>();
        stackAlphabet = new ArrayList<>();

        states = new ArrayList<>();
        acceptStates = new ArrayList<>();
        startState = null;
        transitionTable = new TransitionTable();
    }

    private void readFromFile(String filename) throws IOException {
        // Upper level scanner
        Scanner s1 = new Scanner(new File(filename));

        // Booleans to check if the header files have been processed yet.
        // Once processed, every other non-empty, non-comment line should
        // be treated the same.

        boolean iaHeader = false; // input alphabet header
        boolean saHeader = false; // stack alphabet header

        // Since all of the states must be discovered before creating the transition table,
        // save the state/transition lines to be processed after all states have been instantiated.
        ArrayList<String> transitions = new ArrayList<>();

        // Read the file until eof
        while(s1.hasNextLine()) {
            String line = s1.nextLine();

            // Lower level scanner : per line of upper level
            Scanner s2 = new Scanner(line);
            // Skip empty lines and comment lines
            if(!s2.hasNext() || s2.hasNext("#")) {
                continue;
            }

            // Process input alphabet header when found. Skip if already processed.
            if(!iaHeader) {
                s2.findInLine("|");
                s2.next();
                // Collect input alphabet
                while(s2.hasNext()) {
                    Character toAdd;
                    if(s2.hasNext("epsilon")) {
                        toAdd = ' ';
                        // System.out.println("Adding " + toAdd); /* Testing */
                        inputAlphabet.add(toAdd);
                        break;
                    }
                    toAdd = s2.next().charAt(0);
                    // System.out.println("Adding " + toAdd); /* Testing */
                    inputAlphabet.add(toAdd);
                }
                iaHeader = true;
                continue;
            }

            // Process stack alphabet header when found. Skip if already processed
            if(!saHeader) {
                s2.findInLine("|");
                s2.next();
                // Collect stack alphabet
                while(s2.hasNext()) {
                    Character toAdd;
                    if(s2.hasNext("epsilon")) {
                        toAdd = ' ';
                        stackAlphabet.add(toAdd);
                        break;
                    }
                    toAdd = s2.next().charAt(0);
                    stackAlphabet.add(toAdd);
                }
                saHeader = true;
                continue;
            }

            // Save the line for post-processing
            transitions.add(line);

            /* Process state/transition lines (1) */
            boolean isStart = false;
            boolean isAccept = false;

            // Check for markers
            // Assumes that the start marker comes first, if present
            if(s2.hasNext("->")) {
                // System.out.println("Found start state"); /* Testing */
                isStart = true;
                s2.next();
            }
            if(s2.hasNext("\\*")) {
                isAccept = true;
                s2.next();
            }
            

            // After checking for markers, the next token should be a state name
            String stateName = s2.next();
            State newState = new State(stateName, isAccept, isStart);
            if(isStart) this.startState = newState; 
            states.add(newState);

            // if(isStart) System.out.printf("Start state is %s\n", stateName); /* Testing */

            if(newState.isAccept()) this.acceptStates.add(newState);
            if(newState.isStart()) this.startState = newState;

            s2.close();
        }

        /* Process state/transition lines (2) */
        
        // Loop through all lines
        for(String line : transitions) {
            // System.out.println("Processing this line: " + line);
            Scanner s2 = new Scanner(line);
            char inputRead;
            char stackRead;
            
            // Skip markers
            if(s2.hasNext("\\->")) s2.next();
            if(s2.hasNext("\\*")) s2.next();

            // Getting transitions for this state
            State current = getState(s2.next());

            // Skip the vertical bar '|'
            s2.next();

            // For each character in the input alphabet plus epsilon,
            // for each stack symbol plus epsilon,
            // add the transition

            // System.out.println(inputAlphabet.toString()); /* Testing */
            // System.out.println(stackAlphabet.toString());

            for(int i = 0; i < inputAlphabet.size(); i++) {
                for(int j = 0; j < stackAlphabet.size(); j++) {
                    // Has no transition for this case
                    if(s2.hasNext("\\{\\}")) {
                        s2.next();
                        continue;
                    } 
                   
                    // Has transition for this case
                    // String s = s2.next();
                    // s = s.replaceAll("\\{|\\}|\\(|\\)", "");

                    // // System.out.println("s is: " + s); /* Testing */
                    // // Format should be 
                    // // nextStateName, stackWrite
                    // String[] sArray = s.split(",");

                    // // Build transition components
                    // nextState = getState(sArray[0]);
                    
                    inputRead = inputAlphabet.get(i);
                    // System.out.println("Input Read is : " + inputRead); /* Testing */

                    stackRead = stackAlphabet.get(j);

                    ArrayList<Value> values = new ArrayList<>();

                    // // System.out.println(Arrays.toString(sArray)); /* Testing */
                    // if(sArray.length < 2) stackWrite = EPSILON;
                    // else if(sArray[1].equals("epsilon")) stackWrite = EPSILON;
                    // else stackWrite = sArray[1].charAt(0);
                    // // System.out.println("Stack Write is : " + stackWrite); /* Testing */
                    // transitionTable.addTransition(current, inputRead, stackRead, stackWrite, nextState);

                    // Has transitions for this case
                    String s = s2.next();
                    // System.out.printf("Giving orderpair: %s\n", s); /* Testing */
                    ArrayList<String[]> pairs = getOrderedPairs(s);

                    // System.out.print("orderpair gives: ["); /* Testing */
                    // for(String[] pair : pairs) {
                    //     System.out.printf("(%s,%s)", pair[0], pair[1]);
                    // }
                    // System.out.println("]\n");              /* Testing */

                    // Next Value(s)
                    for(String[] pair : pairs) {
                        Character stackWrite;
                        if(pair[1].equals("epsilon") || pair[1].equals("")) stackWrite = ' ';
                        else stackWrite = pair[1].charAt(0);
                        values.add(new Value(getState(pair[0]), stackWrite));
                    }

                    transitionTable.addTransitions(current, inputRead, stackRead, values);
                }
            }
            s2.close();
        }

        s1.close();
    }

    private ArrayList<String[]> getOrderedPairs(String s) {
        // Find all pairs using regex
        Pattern pattern = Pattern.compile("\\(([^,]*),([^)]*)\\)");
        Matcher matcher = pattern.matcher(s);

        // Store results in a list of string pairs
        ArrayList<String[]> pairs = new ArrayList<>();
        while(matcher.find()) {
            String first = matcher.group(1).trim();
            String second = matcher.group(2).trim();
            pairs.add(new String[] { first, second });
        }

        return pairs;
    }

    public String info() {
        StringBuilder sb = new StringBuilder();
        
        // States, input alphabet, and stack alphabet
        sb.append("States: ").append(states.stream().map(s -> s.getName()).collect(Collectors.joining(",", "{", "}\n")));
    
        ArrayList<Character> copy = new ArrayList<>(inputAlphabet.subList(0, inputAlphabet.size() - 1));
        // System.out.println(copy.toString()); /* Testing */
        sb.append("Input alphabet: ").append(copy.stream().map(c -> String.valueOf(c)).collect(Collectors.joining(",", "{", "}\n")));

        copy = new ArrayList<>(stackAlphabet.subList(0, stackAlphabet.size() - 1));
        sb.append("Stack alphabet: ").append(copy.stream().map(c -> String.valueOf(c)).collect(Collectors.joining(",", "{", "}\n")));
        // <Transition Table 
        sb.append("Transition Table:\n");

        // Input alphabet header
        int spacing;
        sb.append(String.format("%10s", "| "));
        for(Character c : inputAlphabet) {
            spacing = stackAlphabet.size() * 2 + 10; // Leave enough space for stack alphabet to fit under each character in input alphabet
            if(c == ' '){ 
                sb.append(String.format("%" + -spacing + "s", "epsilon"));
                break;
            }
            // Modify spacing based on transitions
            int spacemult = 0;
            for(Character s : stackAlphabet) {
                if(s != ' ' && transitionTable.hasTransitionAnyState(c, s)) {
                    spacemult++;
                }
            }
            if(spacemult > 0) spacing += (7*spacemult);
            sb.append(String.format("%" + -spacing + "s", String.valueOf(c)));
        }

        // Stack alphabet header
        spacing = 3;

        sb.append(String.format("\n%10s", "| "));

        // System.out.println(inputAlphabet.toString()); /* Testing */
        for(int i = 0; i < inputAlphabet.size(); i++) {
            for(Character c : stackAlphabet) {
                // Alter spacing if there is a transition at inputAlphabet[i] and stackAlphabet character c
                if(transitionTable.hasTransitionAnyState(inputAlphabet.get(i), c) && c != ' ')
                    spacing = 10;
                if(c == ' '){ 
                    sb.append(String.format("%" + (-(spacing+7)) + "s", "epsilon"));
                    break;
                }
                sb.append(String.format("%" + -spacing + "s", String.valueOf(c)));
                spacing = 3;
            }
        }
        sb.append("\n");

        // Transitions
        // System.out.println(transitionTable.toString()); /* Testing */
        for(State s : states) {
            // System.out.printf("-----------------\nState: %s\n", s.getName()); /* Testing */
            if(s.isStart() && !s.isAccept())
                sb.append(String.format("->   %s | ", s.getName()));
            else if(!s.isStart() && s.isAccept()) 
                sb.append(String.format("   * %s | ", s.getName()));
            else if(s.isStart() && s.isAccept()) 
                sb.append(String.format("-> * %s | ", s.getName()));
            else 
                sb.append(String.format("     %s | ", s.getName()));

            for(Character ia : inputAlphabet) {
                spacing = 4;
                // System.out.printf("Input character: %s\n", ia); /* Testing */
                for(Character sa : stackAlphabet) {
                    // System.out.printf("Stack character: %s\n", sa); /* Testing */
                    // System.out.printf("looking for transition: [%s, %s, %s, %s]\n", s.getName(), ia, sa, stackAlphabet.get(i)); /* Testing */
                    List<Value> values = transitionTable.getTransitions(s, ia, sa);
                    if(values != null) {
                        spacing = spacing * values.size();
                        // System.out.println(next.toString()); /* Testing */
                        sb.append("{");
                        for(Value v : values) {
                            sb.append(String.format("(%s,%s)", v.getNextState().getName(), v.getStackWrite() != ' ' ? v.getStackWrite() : ""));
                        }
                        sb.append(String.format("%-" + spacing + "s", "}  "));
                    } else {
                        spacing = 1;
                        if(transitionTable.hasTransitionAnyState(ia, sa)) spacing = 8;
                        sb.append("{").append("}").append(String.format("%-" + spacing + "s", ""));
                        if(sa == ' ' && spacing == 1) sb.append("       ");
                    }
                }
            }
            sb.append("\n");           
        }

        sb.append(String.format("Initial State: %s\n", startState.getName()));
        sb.append("Accept States: ").append(acceptStates.stream().map(s -> s.getName()).collect(Collectors.joining(",", "{", "}")));
        return sb.toString();
    }

    public void writeDescriptionToFile(String filename) throws IOException {
        // Try-with-resources will auto-close the writer
        try (BufferedWriter w = new BufferedWriter(new FileWriter(filename))) {
            // 1) input-alphabet header
            w.write("| ");
            for (Character c : inputAlphabet) {
                if (c == EPSILON) w.write("epsilon ");
                else w.write(c + " ");
            }
            w.newLine();

            // 2) stack-alphabet header
            w.write("| ");
            for (Character c : stackAlphabet) {
                if (c == EPSILON) w.write("epsilon ");
                else w.write(c + " ");
            }
            w.newLine();

            // 3) each state and its transitions
            for (State s : states) {
                // markers
                if (s.isStart())  w.write("-> ");
                if (s.isAccept()) w.write("* ");

                // state name and separator
                w.write(s.getName());
                w.write(" | ");

                // for every input × stack symbol
                for (Character ia : inputAlphabet) {
                    for (Character sa : stackAlphabet) {
                        List<Value> vals = transitionTable.getTransitions(s, ia, sa);
                        if (vals != null) {
                            w.write("{");
                            for (Value v : vals) {
                                w.write("(");
                                w.write(v.getNextState().getName());
                                w.write(",");
                                char writeSym = v.getStackWrite();
                                w.write(writeSym == EPSILON ? "epsilon" : String.valueOf(writeSym));
                                w.write(")");
                            }
                            w.write("} ");
                        } else {
                            w.write("{} ");
                        }
                    }
                }
                w.newLine();
            }
        }
    }
    
    // Return 1 if accepted
    // Return -1 if rejected
    // Return 0 if move limit reached
    public int run(String input, int moveLimit, boolean print) {
        return runID(startState, input, "", moveLimit, 3, print, new HashSet<>());

    }

    private int runID(State cur, String input, String stack, int moveLimit, int spacing, boolean print, Set<String> visited) {
        // Avoid stack overflow
        String config = cur.getName() + "|" + input + "|" + stack;
        if (visited.contains(config)) return -1;
        visited.add(config);
        
        if(input.equals("") && cur.isAccept()) {
            if(print) {
                System.out.printf("%" + spacing + "s", "ID ");
                System.out.printf("%s Accept!\n", getID(cur, input, stack));
            }
            return 1;
        }
        if(moveLimit == 0) {
            if(print) {
                System.out.printf("%" + spacing + "s", "ID ");
                System.out.printf("%s LIMIT - no more moves allowed\n", getID(cur, input, stack));
            }
            return 0;
        }

        int toReturn = -1;

        if(print) {
            System.out.printf("%" + spacing + "s", "ID ");
            System.out.printf("%s checking for moves...\n", getID(cur, input, stack));
        }
        // Get each possible option of reading input symbol and/or stack symbol
        boolean[] options = new boolean[4];

        // Reading just an input symbol
        options[0] = (!input.equals("") && transitionTable.getTransitions(cur, input.charAt(0), EPSILON) != null) ? true : false;

        // Reading both an input symbol and a stack symbol
        options[1] = (!input.equals("") && !stack.equals("") && transitionTable.getTransitions(cur, input.charAt(0), stack.charAt(0)) != null) ? true : false;

        // Reading just a stack symbol
        options[2] = (!stack.equals("") && transitionTable.getTransitions(cur, EPSILON, stack.charAt(0)) != null) ? true : false;

        // Reading neither an input symbol nor a stack symbol
        options[3] = (transitionTable.getTransitions(cur, EPSILON, EPSILON) != null) ? true : false;

        for(int i = 0; i < options.length; i++) {
            // For each possible option
            if(options[i] == true) {
                char inputRead;
                char stackRead;
                String inputPrime;
                String stackPrime;

                // Consume input and/or pop stack if needed
                if(i == 0) {
                    // Read just an input symbol, consume input
                    inputRead = input.charAt(0);
                    inputPrime = input.substring(1);

                    stackRead = EPSILON;
                    stackPrime = stack;
                }
                else if(i == 1) {
                    // Read both an input symbol and a stack symbol, consume input and pop stack
                    inputRead = input.charAt(0);
                    inputPrime = input.substring(1);
                    
                    stackRead = stack.charAt(0);
                    stackPrime = stack.substring(1);
                }
                else if(i == 2) {
                    // Read just a stack symbol, pop stack
                    stackRead = stack.charAt(0);
                    stackPrime = stack.substring(1);

                    inputRead = EPSILON;
                    inputPrime = input;
                }
                else {
                    // Read neither an input symbol nor a stack symbol
                    inputRead = EPSILON;
                    inputPrime = input;

                    stackRead = EPSILON;
                    stackPrime = stack;
                }


                List<Value> values = transitionTable.getTransitions(cur, inputRead, stackRead);
                for (Value v : values) {
                    String newStack = stackPrime;
                    if (v.getStackWrite() != EPSILON) {
                        newStack = v.getStackWrite() + newStack;
                    }

                    int subResult = runID(v.getNextState(), inputPrime, newStack, moveLimit - 1, spacing + 2, print, visited);

                    if (subResult == 1) {
                        toReturn = 1;  // Found accepting path
                    } else if (toReturn != 1 && subResult == 0) {
                        toReturn = 0;  // Found non-accepting path, remember in case no 1 found
                    }
                }
            }
        }

        return toReturn;
    }
    
    public String language(int lengthLimit, int moveLimit) {
        List<String> strings = generateStrings(lengthLimit);
        List<String> accepted = new ArrayList<>();
        List<String> undetermined = new ArrayList<>();
        // System.out.println(strings.stream().collect(Collectors.joining(",", "{", "}"))); /* Testing */
        for(String s : strings) {
            if(run(s, moveLimit, false) == 1) {
                if(s.equals("")) accepted.add("\"\"");
                else accepted.add(s);
            }
            else if(run(s, moveLimit, false) == 0) undetermined.add(s);
        }

        sortStrings(accepted);
        sortStrings(undetermined);

        StringBuilder sb = new StringBuilder();

        sb.append("L(P) = ");
        sb.append(accepted.stream().map(s -> s).collect(Collectors.joining(",\n", "{\n", ",\n...\n}")));

        if(!undetermined.isEmpty()) {
            sb.append("\nUndetermined strings (due to limit):\n");
            sb.append(undetermined.stream().map(s -> s).collect(Collectors.joining("\n")));
        }

        return sb.toString();
    }

    private void sortStrings(List<String> strings) {
        Collections.sort(strings, (a, b) -> {
            if (a.length() != b.length()) {
                return Integer.compare(a.length(), b.length());
            }
            return a.compareTo(b); // lexicographic comparison
        });
    }

    private List<String> generateStrings(int lengthLimit) {
        List<String> result = new ArrayList<>();
        generate("", lengthLimit, result);
        return result;
    }

    private void generate(String cur, int lengthLimit, List<String> result) {
        result.add(cur);
        if(cur.length() == lengthLimit) return;

        for(char c : inputAlphabet) {
            if(c != ' ') generate(cur + c, lengthLimit, result);
        }
    }
    // Return a state object whose name attribute is equal to 
    // the given arguemnt. Returns null if no such state exists.
    private State getState(String name) {
        State toReturn = null;
        for(State s : states) {
            if(s.getName().equals(name)) toReturn = s;
        }

        return toReturn;
    }

    // Add a state to the pda
    // returns true if added and false if state already is in the list
    public boolean addState(String name, boolean accept, boolean start) {
        State toAdd = new State(name, accept, start);
        for(State s : states) {
            if(s.getName().equals(name)) return false;
        }
        states.add(toAdd);
        if(toAdd.isStart()) startState = toAdd;
        if(toAdd.isAccept()) acceptStates.add(toAdd);
        return true;
    }

    public void addStackSymbol(Character c) {
        if(!stackAlphabet.contains(c)) stackAlphabet.add(c);
    }

    public void addInputSymbol(Character c) {
        if(!inputAlphabet.contains(c)) inputAlphabet.add(c);
    }

    public void addTransition(String currentState, Character inputRead, Character stackRead, String nextValues) {
        State cur = getState(currentState);
        Scanner scan = new Scanner(nextValues);
        List<Value> values = new ArrayList<>();
        while(scan.hasNext()) {
            String[] parts = scan.next().split(",");
            Character sw;
            if(parts.length < 2) sw = ' ';
            else sw = parts[1].charAt(0);
            Value val = new Value(getState(parts[0]), sw);
            values.add(val);
        }
        scan.close();

        transitionTable.addTransitions(cur, inputRead, stackRead, values);
    }
    /* A method to construct the instantaneous description of the PDA via a String */
    private String getID(State cur, String input, String stack) {
        return String.format("(%s,[%s],[%s]):", cur.getName(), input, stack);
    }

    private class State {
        private String name;
        private boolean accept;
        private boolean start;

        private State(String name) {
            this.name = name;
            accept = false;
            start = false;
        }

        private State(String name, boolean accept, boolean start) {
            this.name = name;
            this.accept = accept;
            this.start = start;
        }

        String getName() {
            return name;
        }
        
        boolean isAccept() {
            return accept;
        }

        boolean isStart() {
            return start;
        }

        public String toString() {
            return String.format("[Name: %s, Accept: %s, Start: %s]", name, accept, start);
        }
    }

    private class TransitionTable {
        HashMap<String, List<Value>> table;

        public TransitionTable() {
            table = new HashMap<>();
        }

        void addTransitions(State cur, char inputRead, char stackRead, List<Value> nextValues) {

            StringBuilder sb = new StringBuilder();
            sb.append("[" + cur.getName() + ",").append(inputRead + ",").append(stackRead + "]") ;
            String key = sb.toString();
            // System.out.println(key + "goes to " + nextState.getName()); /* Testing */
            table.put(key, nextValues);
        }

        List<Value> getTransitions(State cur, char inputRead, char stackRead) {

            StringBuilder sb = new StringBuilder();
            sb.append("[" + cur.getName() + ",").append(inputRead + ",").append(stackRead + "]");
            String key = sb.toString();
            // System.out.println(key); /* Testing */
            return table.get(key);
        }

        public boolean hasTransitionAnyState(char inputRead, char stackRead) {
            boolean toReturn = false;
            for(State s : states) {
                for(Character c : stackAlphabet) {
                    if(getTransitions(s, inputRead, stackRead) != null) toReturn = true;
                }
            }
            return toReturn;
        }

        public String toString() {
            return table.entrySet()
            .stream()
            .map(e -> "\n" + e.getKey() + ": " + e.getValue().stream().map(v -> v.toString()).collect(Collectors.joining(",")) + "\n")
            .collect(Collectors.joining(", ", "{", "}"));
        }

    }

    private class Value {
        State nextState;
        Character stackWrite;

        public Value(State s, Character c) {
            nextState = s;
            stackWrite = c;
        }

        public State getNextState() {
            return nextState;
        }

        public Character getStackWrite() {
            return stackWrite;
        }

        public String toString() {
            return String.format("(%s,%s)", nextState.getName(), stackWrite);
        }
    }

}
