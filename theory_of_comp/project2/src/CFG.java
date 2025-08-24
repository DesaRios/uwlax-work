/* 
 * Adrian Rios
 * CS453
 * Project 2
 */

package project2.src;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Scanner;
import java.util.Set;
import java.util.stream.Collectors;

public class CFG {
    private List<String> variables; // i.e. non-terminals
    private List<String> terminals;
    private String startVariable;
    private ProductionTable productionTable;
    private List<String> sentences;

    public CFG(String filename) throws IOException {
        // Instantiate lists
        variables = new ArrayList<>();
        sentences = new ArrayList<>();

        // Instantiate production table
        productionTable = new ProductionTable();

        // Process file
        readFromFile(filename);

        // System.out.println(productionTable.toString()); /* Testing */
        // terminals = productionTable.findTerminals();
    }

    private void readFromFile(String filename) throws IOException {
        // Upper level scanner
        Scanner s1 = new Scanner(new File(filename));

        // To check if first variable
        boolean firstFound = false;

        // To process production bodies
        List<String> productionBodies = new ArrayList<>();

        // Read file until eof
        while(s1.hasNextLine()) {
            String line = s1.nextLine();

            // Lower level scanner 
            Scanner s2 = new Scanner(line);

            // Skip empty and comment lines
            if(!s2.hasNext() || s2.hasNext("#")) {
                continue;
            }

            // s2 should be scanning a production line
            // form: A -> body1 | body2 | ...
            String variable = s2.next();
            if(!firstFound) {
                startVariable = variable;
                firstFound = true;
            }

            // Add variable to list if not contained
            if(!variables.contains(variable)) variables.add(variable);

            // Skip ->
            s2.next();

            // Read all bodies on this line
            while(s2.hasNext()) {
                // Skip |'s
                if(s2.hasNext("\\|")) s2.next();
                
                String productionBody = s2.next();
                if(productionBody.equals("epsilon")) productionBody = "";
                else productionBodies.add(productionBody); // For processing terminals later

                productionTable.addProduction(variable, productionBody);
            }
            s2.close();
        }

        s1.close();
        getTerminals(productionBodies);
    }

    private void getTerminals(List<String> productionBodies) {
        this.terminals = new ArrayList<>();
        // For every production body b
        for(String b : productionBodies) {
            // For every character in b
            for(int i = 0; i < b.length(); i++) {
                char c = b.charAt(i);

                //  Since this method is called after visiting all 
                //  lines of the input file, we should have all
                //  of our variables in the global variables list
                if(!variables.contains(String.valueOf(c)) && !terminals.contains(String.valueOf(c))) {
                    // If the character in the production body we are
                    // scanning is not in the list of variables,
                    // then it must be a terminal
                    this.terminals.add(String.valueOf(c));
                }
            }
        }
    }

    public String info() {
        StringBuilder sb = new StringBuilder();
        
        sb.append("Variables: ").append(this.variables.stream().collect(Collectors.joining(",", "{", "}\n")));
        sb.append("Terminals: ").append(this.terminals.stream().collect(Collectors.joining(",", "{", "}\n")));
        sb.append("Productions:\n");

        for(String s : variables) {
            List<String> productionBodies = productionTable.getProductions(s);
            for(String pb : productionBodies) {
                if(pb.equals("")) pb = "epsilon";
                sb.append(String.format("%s -> %s\n", s, pb));
            }
        }
        sb.append("Start Variable: " + startVariable);
        return sb.toString();
    }

    public String sentences(int derivLimit) {
        // Populate sentences via derive
        derive(startVariable, derivLimit, 1, true, sentences);
        if(sentences.remove("")) {
            sentences.add("\"\"");
        }
        sortStrings(sentences);
        StringBuilder sb = new StringBuilder();
        sb.append("L(G) = {\n  ");
        sb.append(sentences.stream().collect(Collectors.joining(",\n  ")));
        sb.append(",\n  ...\n}");
        return sb.toString();
    }

    private void sortStrings(List<String> list) {
        Collections.sort(list, (a, b) -> {
            String sa = a.equals("\"\"") ? "" : a;
            String sb = b.equals("\"\"") ? "" : b;

            if (sa.length() != sb.length()) {
                return Integer.compare(sa.length(), sb.length());
            } else {
                return sa.compareTo(sb);
            }
        });
    }

    public void derivations(int derivLimit) {
       derive(startVariable, derivLimit, 1, false, sentences);
    }

    private void derive(String sentential, int derivLimit, int spacing, boolean sentences, List<String> allSentences) {
        List<String> productionBodies = sentBodies(sentential);
        if(!sentences){
            System.out.printf("%" + spacing + "s%s]\n", "[", sentential);
        } else {
            if(productionBodies == null && !allSentences.contains(sentential)) {
                // Found a new sentence
                allSentences.add(sentential);
            }
        }

        if(productionBodies != null) {
            // System.out.printf("New forms for sentential form %s : %s", sentential, productionBodies.stream().collect(Collectors.joining(",", "{", "}\n"))); /* testing */
            if(derivLimit != 0) {
                for(String s : productionBodies) {
                    derive(s, derivLimit - 1, spacing + 2, sentences, allSentences);
                }
            }
        }
        return;
    }

    /* A method that takes in a string,
     * if a sentential form,
     * finds the leftmost variable,
     * returns list of strings where variable is replaced with possible production bodies
     * 
     * If the string is a sentence,
     * return null
     */
    private List<String> sentBodies(String sent) {
        for(int i = 0; i < sent.length(); i++) {
            // Found the leftmost variable
            if(variables.contains(String.valueOf(sent.charAt(i)))) {
                List<String> productionBodies = productionTable.getProductions(String.valueOf(sent.charAt(i)));
                List<String> newSents = new ArrayList<>();
                for(String pb : productionBodies) {
                    // Replace variable with production body
                    String newSent;

                    if(i == 0 && i == sent.length() - 1) {
                        // Form A
                        newSent = pb;
                    }
                    else if(i > 0 && i == sent.length() - 1) {
                        // Form ...A
                        newSent = sent.substring(0, i) + pb;
                    } 
                    else if(i == 0 && i < sent.length() - 1) {
                        // Form A...
                        newSent = pb + sent.substring(i+1, sent.length());
                    }
                    else {
                        // in the middle somewhere(...A...)
                        newSent = sent.substring(0, i) + pb + sent.substring(i+1, sent.length());
                        // System.out.printf("* newSent for case middle on sentential [%s] with i=%d is: %s *", sent, i, newSent); /* testing */
                    }
                    newSents.add(newSent);
                }
                return newSents;
            }
        }
        return null;
    }

    public PDA toPDA() {
        PDA pda = new PDA();
        //States
        pda.addState("qStart", false, true);
        pda.addState("qInit",  false, false);
        pda.addState("qLoop",  false, false);
        pda.addState("qAccept", true,  false);
    
        //  Alphabets
        //   Input: all terminals + ε
        for (String t : terminals) {
            pda.addInputSymbol(t.charAt(0));
        }
        pda.addInputSymbol(PDA.EPSILON);
    
        //   Stack: variables, terminals, bottom‐marker $, and ε
        for (String v : variables) {
            pda.addStackSymbol(v.charAt(0));
        }
        for (String t : terminals) {
            pda.addStackSymbol(t.charAt(0));
        }
        pda.addStackSymbol('$');
        pda.addStackSymbol(PDA.EPSILON);
    
        // Initial push of bottom‐marker and start variable
        //    qStart —ε,ε→ push '$' → qInit
        pda.addTransition("qStart", PDA.EPSILON, PDA.EPSILON, "qInit,$");
        //    qInit  —ε,ε→ push S  → qLoop
        pda.addTransition("qInit", PDA.EPSILON, PDA.EPSILON, "qLoop," + startVariable.charAt(0));
    
        // For each production A → X...
        HashMap<String,Integer> prodCount = new HashMap<>();
        for (String A : variables) {
            prodCount.put(A, 0);
        }
        for (String A : variables) {
            List<String> bodies = productionTable.getProductions(A);
            int count = prodCount.get(A);
            for (String body : bodies) {
                char Achar = A.charAt(0);
                // reverse the RHS s
                ArrayList<Character> rev = new ArrayList<>();
                for (int i = body.length() - 1; i >= 0; i--) {
                    rev.add(body.charAt(i));
                }
    
                if (rev.isEmpty()) {
                    // ε‐production: pop A and push nothing
                    pda.addTransition("qLoop", PDA.EPSILON, Achar, "qLoop,");
                } else {
                    // chain through intermediate states
                    String prev = "qLoop";
                    for (int j = 0; j < rev.size(); j++) {
                        // final push goes back to qLoop
                        String next = (j == rev.size() - 1)
                                      ? "qLoop"
                                      : "q" + A + ":" + count + ":" + j;
                        if (j < rev.size() - 1) {
                            pda.addState(next, false, false);
                        }
    
                        // only the first transition pops A; the rest pop ε
                        char popSym = (j == 0 ? Achar : PDA.EPSILON);
                        char pushSym = rev.get(j);
                        pda.addTransition(prev, PDA.EPSILON, popSym, next + "," + pushSym);
                        prev = next;
                    }
                }
                count++;
            }
            prodCount.put(A, count);
        }
    
        // Terminal‐matching: for each terminal a, read a & pop a → stay in qLoop
        for (String t : terminals) {
            char tch = t.charAt(0);
            pda.addTransition("qLoop", tch, tch, "qLoop,");
        }
    
        // Final accept: pop '$' → qAccept
        pda.addTransition("qLoop", PDA.EPSILON, '$', "qAccept,");
    
        return pda;
    }

    private String buildNextValues(String v) {
        List<String> bodies = sentBodies(v);
        StringBuilder sb = new StringBuilder();
        for(String b : bodies) {
            sb.append(String.format(" qloop,%s ", b));
        }
        return sb.toString();
    }

    private class ProductionTable {
        HashMap<String, List<String>> table;

        public ProductionTable() {
            table = new HashMap<>();
        }

        public void addProduction(String variable, String yield) {
            if(table.containsKey(variable)) {
                List<String> productions = table.get(variable);
                productions.add(yield);
            }
            else {
                List<String> productions = new ArrayList<>();
                productions.add(yield);
                table.put(variable, productions);
            }
        }

        public List<String> getProductions(String variable) {
            if(table.containsKey(variable)) {
                return table.get(variable);
            }
            else {
                return null;
            }
        }

        public String toString() {
            return table.entrySet()
            .stream()
            .map(e -> "\n" + e.getKey() + ": " + e.getValue().stream().map(v -> v.toString()).collect(Collectors.joining(",")) + "\n")
            .collect(Collectors.joining(", ", "{", "}"));
        }
    }
}
