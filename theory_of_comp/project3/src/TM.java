/* 
 * Adrian Rios
 * Project 3
 * Introduction to Theory of Computation
 * Spring 2025
 * 
 */

import java.util.List;
import java.util.Queue;
import java.util.Scanner;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.regex.*;
import java.util.stream.Collectors;

public class TM {
    List<String> inputAlphabet;
    List<String> tapeAlphabet;
    List<State> states;
    State rejectState;
    State initialState;
    State acceptState;
    int spacing = 0;

    public TM(String filename) {
        inputAlphabet = new ArrayList<>();
        tapeAlphabet = new ArrayList<>();
        states = new ArrayList<>();
        rejectState = null;
        initialState = null;
        acceptState = null;
        try {
            readFromFile(filename);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public void readFromFile(String filename) throws IOException {
        // System.out.printf("Reading from file %s\n--------\n", filename); /* testing */

        // Line by line scanner
        Scanner s1 = new Scanner(new File(filename));

        // boolean value for checking header
        boolean header = false;

        // number of characters in header that belong to input alphabet as well as tape alphabet
        int sizeInputAlphabet = 0;

        while(s1.hasNextLine()) {
            // Word by word scanner
            String line = s1.nextLine();
            Scanner s2 = new Scanner(line);

            // Skip comments and empty lines
            if(s2.hasNext("#") || line.trim().isEmpty()) continue;

            // if header hasn't been processed...
            if(!header) {
                // store number of characters in input alphabet
                sizeInputAlphabet = s2.nextInt();
                s2.next(); // skip '|'
                // store characters in both alphabets
                for(int i = 0; i < sizeInputAlphabet; i++) {
                    String toAdd = s2.next();
                    inputAlphabet.add(toAdd);
                    tapeAlphabet.add(toAdd);
                }
                // store remaining characters in tape alphabet only
                // Possibility for "long" entries here
                while(s2.hasNext()) {
                    tapeAlphabet.add(s2.next());
                }

                header = true;
                continue;
            }

            /* Processing state and transitions */
            // check for markers
            String startPattern = "\\->";
            boolean start = false;
            String acceptPattern = "\\*";
            boolean accept = false;
            String rejectPattern = "!";
            boolean reject = false;
            while(s2.hasNext("\\->|\\*|!")) {
                String marker = s2.next();
                if(marker.matches(startPattern)) start = true;
                if(marker.matches(acceptPattern)) accept = true; // accept xor reject
                else if(marker.matches(rejectPattern)) reject = true;
            }

            // next should be state name
            String stateName = s2.next();
            if(stateName.length() > spacing) spacing = stateName.length();
            // System.out.println(spacing);                                        /* testing */
            // Add state to list of states
            State newState = new State(stateName, start, accept, reject);
            states.add(newState);
            if(reject) rejectState = newState;
            else if(accept) acceptState = newState;
            if(start) initialState = newState;

            s2.next(); // skip '\'
            if(!s2.hasNext("\\(.+\\)|\\-")) { // adjacency list entry format
                while(s2.hasNext()) {
                    String transition = s2.next();
                    // System.out.printf("(adjacency) working on %s\n", transition); // testing
                    String[] pair = transition.split("=");
                    String key = pair[0];
                    String value = pair[1];
                    
                    // System.out.printf("key is %s\n", key); /* Testing */
                    // Find single characters or <> enclosed values
                    Pattern pattern = Pattern.compile("<[^>]+>|.");
                    Matcher matcher = pattern.matcher(key);
                    List<String> symbols = new ArrayList<>();
                    
                    while(matcher.find()) {
                        symbols.add(matcher.group());
                    }

                    // System.out.println(symbols); testing
                    value = value.replaceAll("\\(|\\)", "");
                    String[] valueParts = value.split(","); 
                    String nextState;
                    String writeSymbol;
                    String direction;
                    if(valueParts[0].isBlank()) nextState = stateName;
                    else nextState = valueParts[0];
                    direction = valueParts[2];

                    for(String s : symbols) {
                        if(valueParts[1].isBlank()) writeSymbol = s;
                        else writeSymbol = valueParts[1];
                        newState.addTransition(nextState, s, writeSymbol, direction);
                    }
                }
            }
            else { // regular format
                // scan transitions for all tape alphabet
                for(int i = 0; i < tapeAlphabet.size(); i++) {
                    String transition = s2.next();
                    // System.out.printf("Processing transition for state %s(%s%s%s) on symbol %s: %s\n", stateName, start ? "->" : "", accept ? "*" : "", reject ? "!" : "", tapeAlphabet.get(i), transition); /* Testing */
                    if(!transition.equals("-")) {
                        transition = transition.replaceAll("\\(|\\)", ""); // remove parenthesis
                        String[] parts = transition.split(",");
                        
                        // System.out.print("Working with symbols: "); /* Testing */
                        // for(int j = 0; j < parts.length; j++) {
                        //     System.out.printf("[%s]", parts[j]);

                        // }
                        // System.out.println("\n");

                        String nextState;
                        String writeSymbol;
                        String direction;
                        if(parts[0].isBlank()) nextState = stateName;
                        else nextState = parts[0];
                        if(parts[1].isBlank()) writeSymbol = tapeAlphabet.get(i);
                        else writeSymbol = parts[1];
                        direction = parts[2];

                        // add transition
                        newState.addTransition(nextState, tapeAlphabet.get(i), writeSymbol, direction);


                    }
                }
            }
        }

        /* TESTING */
        // for(State s : states) {
        //     System.out.println(s.toString());
        // }
    }
    
    public String info() {

        StringBuilder sb = new StringBuilder();
        // States
        sb.append("States: ").append(states.stream().map(s->s.getName()).collect(Collectors.joining(",", "{", "}\n")));
        // Input alphabet
        sb.append("Input alphabet: ").append(inputAlphabet.stream().collect(Collectors.joining(",", "{","}\n")));
        // Tape alphabet
        sb.append("Tape alphabet: ").append(tapeAlphabet.stream().collect(Collectors.joining(",", "{","}\n")));
        
        /* Transition Table */
        sb.append("Transition Table:\n");
        // Header
        sb.append(String.format("%-" + (spacing + 4) + "s", "") + inputAlphabet.size()).append(" | ");
        for(String s : tapeAlphabet) {
            sb.append(String.format("%-" + (spacing + 7) + "s", s));
        }
        sb.append("\n");
        // Transitions
        for(State s : states) {
            String acceptance = " ";
            if(s.isAccept()) acceptance = "*";
            else if(s.isReject()) acceptance = "!";
            String left = String.format("%s %s %" + spacing + "s ", s.isStart() ? "->" : " ", acceptance, s.getName());
            sb.append(String.format("%" + (6 + spacing) + "s", left)).append("| ");
            sb.append(s.getAllTransitions());
            sb.append("\n");
        }
        sb.append(String.format("Initial State: %s\n", this.initialState.getName()));
        sb.append(String.format(" Accept State: %s\n", this.acceptState.getName()));
        sb.append(String.format(" Reject State: %s", this.rejectState.getName()));
        return sb.toString();
    }

    public int run(String input, int moveLimit, boolean print) {
        State currentState = this.initialState;
        int currentIndex = 0;

        
        Pattern pattern = Pattern.compile("<[^>]+>|.");
        Matcher matcher = pattern.matcher(input);
        List<String> symbols = new ArrayList<>();
        
        while(matcher.find()) {
            symbols.add(matcher.group());
        }

        for(int i = 0; i <= moveLimit; i++) {
            symbols.add(currentIndex, String.format("<%s>", currentState.getName()));
            // System.out.println(symbols); // testing
            if(currentIndex == symbols.size() - 1) { // Marker is at the end
                symbols.add("_");
            }
            if(print) System.out.printf("Config: %s\n", symbols.stream().collect(Collectors.joining("")));
            if(currentState.isAccept()) {
                if(print) System.out.println("ACCEPT");
                return 1;
            }
            else if(currentState.isReject()) {
                if(print) System.out.println("REJECT");
                return -1;
            }

            String value;
            value = currentState.getTransition(symbols.get(currentIndex + 1));
            
            if(value == null) {
                if(i==0) {
                    symbols.remove(0);
                    currentIndex++;
                }
                currentState = this.rejectState;
                continue;
            }
            value = value.replaceAll("\\(|\\)", "");
            String[] valueParts = value.split(",");
            
            String nextStateName = valueParts[0];
            String writeSymbol = valueParts[1];
            String moveDirection = valueParts[2];

            currentState = findStateWithName(nextStateName);
            symbols.set(currentIndex + 1, writeSymbol);
            symbols.remove(currentIndex);
            if(currentIndex != 0) {
                if(moveDirection.equals("R")) currentIndex++;
                else currentIndex--;
            }
            else {
                if(moveDirection.equals("R")) currentIndex++;
            }
        }
        if(print) System.out.println("LIMIT");
        return 0;
    }

    public String language(int lengthLimit, int moveLimit) {
        StringBuilder sb = new StringBuilder();
        List<String> strings = generateStrings(lengthLimit);
        List<String> accepted = new ArrayList<>();
        List<String> undetermined = new ArrayList<>();

        for(String s : strings) {
            int result = run(s, moveLimit, false);
            if(s.equals("")) s = "\"\"";
            if(result == 1) {
                accepted.add(s);
            }
            else if(result == 0) {
                undetermined.add(s);
            }
        }

        sb.append(accepted.stream().collect(Collectors.joining(",\n  ", "L(M) = {\n  ", ",\n  ...\n}")));
        sb.append(undetermined.stream().collect(Collectors.joining("\n  ", undetermined.size() > 0 ? "\nUndetermined strings (due to limit):\n  " : "", "")));

        return sb.toString();
    }

    private List<String> generateStrings(int lengthLimit) {
        List<String> result = new ArrayList<>();
        Queue<String> queue = new LinkedList<>();

        queue.add(""); // Start with empty string

        while (!queue.isEmpty()) {
            String current = queue.poll();
            result.add(current);

            if (current.length() >= lengthLimit) continue;

            for (String symbol : inputAlphabet) {
                queue.add(current + symbol);
            }
        }

        return result;
    }

    private State findStateWithName(String name) {
        for(State s : this.states) {
            if(s.getName().equals(name)) {
                return s;
            }
        }
        return null;
    }
    private class State {
        String name;
        boolean start;
        boolean accept;
        boolean reject;
        HashMap<String, String> transitions;

        public State(String name) {
            this.name = name;
            this.start = false;
            this.accept = false;
            this.reject = false;
            transitions = new HashMap<>();
        }

        public State(String name, boolean start, boolean accept, boolean reject) {
            this.name = name;
            this.start = start;
            this.accept = accept;
            this.reject = reject;
            transitions = new HashMap<>();
            if(accept && reject) {
                System.out.println("ERROR: state cannot be accept and reject");
                System.exit(1);
            }
        }

        String getName() {
            return this.name;
        }

        boolean isStart() {
            return this.start;
        }

        boolean isAccept() {
            return this.accept;
        }

        boolean isReject() {
            return this.reject;
        }

        void addTransition(String nextStateName, String readSymbol, String writeSymbol, String moveDirection) {
            String key = readSymbol;
            String value = "(" + nextStateName + "," + writeSymbol + "," + moveDirection + ")";
            transitions.put(key, value);
        }

        String getTransition(String readSymbol) {
            String key = readSymbol;
            return transitions.get(key);
        }

        String getAllTransitions() {
            List<String> toReturn = new ArrayList<>();
            for(String s : tapeAlphabet) {
                String value = getTransition(s);
                toReturn.add(value);
            }
            StringBuilder sb = new StringBuilder();
            sb.append(toReturn.stream().map(s -> s == null ? String.format("%-" + (6 + spacing) + "s", "-") : String.format("%-" + (6+spacing) + "s", s)).collect(Collectors.joining(" ")));
            return sb.toString();
        }

        public String toString() {
            StringBuilder sb = new StringBuilder();
            sb.append(String.format("%s%s%s", start ? "->" : "", accept ? "*" : "", reject ? "!" : "") + this.name);
            sb.append(transitions.toString());

            return sb.toString();
        }
    }
}
