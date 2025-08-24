/*
 * Adrian Rios
 *
 * CS441/541: Project 3
 *
 */
#include "mysh.h"

int main(int argc, char * argv[]) {
    int ret;

    /* Initialize the job list */
    jobs = malloc(sizeof(job_t) * jobs_length);
    if(jobs == NULL) {
        fprintf(stderr, "Error: Memory allocation failed\n");
        return -1;
    }

    /* Initialize the history list */
    history = malloc(sizeof(char*) * history_length);
    if(history == NULL) {
        fprintf(stderr, "Error: Memory allocation failed\n");
        return -1;
    }

    /* Set up the signal handler */
    signal(SIGCHLD, sigchld_handler);
    
    /*
     * Parse Command line arguments to check if this is an interactive or batch
     * mode run.
     */
    if((ret = parse_args_main(argc, argv)) != 0) {
        fprintf(stderr, "Error: Invalid command line!\n");
        return -1;
    }

    /*
     * If in batch mode then process all batch files
     */
    if( is_batch == TRUE) {
        if( is_debug == TRUE) {
            printf("Batch Mode!\n");
        }

        if( (ret = batch_mode(argc, argv)) != 0 ) {
            fprintf(stderr, "Error: Batch mode returned a failure!\n");
        }
    }
    /*
     * Otherwise proceed in interactive mode
     */
    else if( is_batch == FALSE ) {
        if( is_debug  == TRUE ) {
            printf("Interactive Mode!\n");
        }

        if( (ret = interactive_mode()) != 0) {
            fprintf(stderr, "Error: Interactive mode returned a failure!\n");
        }
    }
    /*
     * This should never happen, but otherwise unknown mode
     */
    else {
        fprintf(stderr, "Error: Unknown execution mode!\n");
        return -1;
    }


    /*
     * Display counts
     */
    print_counts();

    return 0;
}

int parse_args_main(int argc, char **argv) {    
    /*
     * If no command line arguments were passed then this is an interactive
     * mode run.
     */
    if(argc == 1) {
        is_batch = FALSE;
    }
     /*
     * If command line arguments were supplied then this is batch mode.
     */
    else if(argc > 1) {
        is_batch = TRUE;
    }
    else {
        return -1;
    }

    return 0;
}

int batch_mode(int num_args, char *argv[]) {

    /*
     * For each file...
     */
    for(int i = 1; i < num_args; i++) {
        // Open the file
        FILE *file = fopen(argv[i], "r");
        // Check if the file was opened successfully
        if (file == NULL) {
            fprintf(stderr, "Error: Could not open batch file %s\n", argv[i]);
            continue;
        }

        char line[MAX_COMMAND_LINE];
        // Read the file line by line
        while(fgets(line, sizeof(line), file) != NULL) {
            // Process the line
            if (line[strlen(line) - 1] == '\n') {
                line[strlen(line) - 1] = '\0';
            }

            /* Parse and execute the command */
            char **tokens = tokenize_and_keep_delim(line, ";", "&");
            for(int i = 0; tokens[i] != NULL; i++) {
                char *token = tokens[i];
                while(isspace((unsigned char)*token)) token++; // Get rid of leading whitespace
                char *token_copy = strdup(token);
                parse_args_interactive(token_copy);
                free(token_copy);
            }
            free_tokens(tokens);
        }

        fclose(file);
    }

    /*
     * Cleanup
     */
    free(jobs);
    free(history);
    builtin_exit();

    return 0;
}

int interactive_mode(void) {
    // Loop to keep prompting the user for input
    do {
        printf(PROMPT);

        char input[MAX_COMMAND_LINE];

        // Read stdin
        if(fgets(input, sizeof(input), stdin) == NULL) {
            printf("\n");
            break;  // Exit the loop if fgets returns NULL (i.e., if CTRL-D is pressed)
        }

        // Strip off the newline
        input[strlen(input) - 1] = '\0';

        // Parse and execute the command
        char **tokens = tokenize_and_keep_delim(input, ";", "&");
        for (int i = 0; tokens[i] != NULL; i++) {
            char *token = tokens[i];
            while(isspace((unsigned char)*token)) token++; // Get rid of leading whitespace
            char *token_copy = strdup(token);
            parse_args_interactive(token_copy);
            free(token_copy);
        }
        free_tokens(tokens);
        
    } while (1);

    /*
     * Cleanup
     */
    free(jobs);
    free(history);
    builtin_exit();

    return 0;
}

char** tokenize_and_keep_delim(char *str, const char *delim1, const char *delim2) {
    char delims[3] = { *delim1, *delim2, '\0' }; // Concatenate the delimiters
    char *start = str, *end;
    char **tokens = malloc(sizeof(char*) * (strlen(str) + 1)); // Allocate memory for the tokens
    int i = 0;

    while((end = strpbrk(start, delims)) != NULL) {
        char found_delim = *end; // Save the found delimiter
        *end = '\0';
        tokens[i] = malloc(strlen(start) + 2); // Allocate memory for the token and the delimiter
        sprintf(tokens[i], "%s%c", start, found_delim); // Save the token and the delimiter
        i++;
        start = end + 1;
    }
    if(*start != '\0') {
        tokens[i] = malloc(strlen(start) + 1); // Allocate memory for the final token
        strcpy(tokens[i], start); // Save the final token
        i++;
    }
    tokens[i] = NULL; // Mark the end of the array with NULL

    return tokens;
}

void free_tokens(char **tokens) {
    for (int i = 0; tokens[i] != NULL; i++) {
        free(tokens[i]);
    }
    free(tokens);
}

char *trim_whitespace(char *str) {
    char *end;

    // Trim leading space
    while(isspace((unsigned char)*str)) str++;

    if(*str == 0)  // All spaces?
        return str;

    // Trim trailing space
    end = str + strlen(str) - 1;
    while(end > str && isspace((unsigned char)*end)) end--;

    // Write new null terminator character
    end[1] = '\0';

    return str;
}

int parse_args_interactive(char *input) {
    //Remove possible ;
    strtok(input, ";");
    char *input_copy = trim_whitespace(input);

    // check if the input is a built-in command
    int job_num;
    if (strcmp(input_copy, "exit") == 0) {
        history[total_history] = "exit";
        total_history++;
        builtin_exit();
    } 
    else if (strcmp(input_copy, "jobs") == 0) {
        history[total_history] = "jobs";
        total_history++;
        builtin_jobs();
    } 
    else if (strcmp(input_copy, "history") == 0) {
        history[total_history] = "history";
        total_history++;
        builtin_history();
    } 
    else if (strcmp(input_copy, "wait") == 0) {
        history[total_history] = "wait";
        total_history++;
        builtin_wait();
    } 
    else if (strcmp(input_copy, "fg") == 0) {
        history[total_history] = "fg";
        total_history++;
        builtin_fg();
    } 
    else if (sscanf(input_copy, "fg %d", &job_num) == 1) {
        history[total_history] = "fg";
        total_history++;
        builtin_fg_num(job_num);
    } 
    else {
        /* If not a built-in command, then it is a job */
        job_t * job = parse_job(input);
        // Redirect input/output if necessary
        if(job->input_redir == TRUE) {
            execute_with_input_redir(job);
        }
        else if(job->output_redir == TRUE) {
            execute_with_output_redir(job);
        }
        else {
            launch_job(job);
        }
    }

    return 0;
}

job_t* parse_job(char * input) {
    // create a new job
    job_t * job = malloc(sizeof(job_t));
    if (job == NULL) {
        // Handle error
        fprintf(stderr, "Error: Memory allocation failed\n");

    }
    
    // Save the full command
    job->full_command = strdup(input);

    // Check for input/output redirection
    if (strchr(input, '<') != NULL) {
        job->input_redir = TRUE;
        job->output_redir = FALSE;
        char * input_copy = strdup(input);
        strtok(input_copy, "<");
        job->input_file = strtok(NULL, " ");
    }
    else if(strchr(input, '>') != NULL) {
        job->input_redir = FALSE;
        job->output_redir = TRUE;
        char * input_copy = strdup(input);
        strtok(input_copy, ">");
        job->output_file = strtok(NULL, " ");
    }
    else {
        job->input_redir = FALSE;
        job->output_redir = FALSE;
    }

    // Get the binary
    char *saveptr;
    job->binary = strtok_r(input, " ", &saveptr);

    // Allocate memory for argv
    job->argv = malloc(MAX_COMMAND_LINE * sizeof(char*));
    if (job->argv == NULL) {
        // Handle error
        fprintf(stderr, "Error: Memory allocation failed\n");

    }   
    
    // Get the arguments
    job->argv[0] = job->binary;
    char *arg;
    job->argc = 1;
    job->is_background = FALSE;
    while((arg = strtok_r(NULL, " ", &saveptr)) != NULL) {
        if (strcmp(arg, "&") == 0) {
            job->is_background = TRUE;
            continue;
        }
        else if(strcmp(arg, ";") == 0) {
            continue;
        }
        job->argv[job->argc] = arg;
        job->argc++;
    }
    job->argv[job->argc] = NULL;  // NULL-terminate argv

    return job;
}

int launch_job(job_t * loc_job) {
    pid_t c_pid = 0;
    int status = 0;

    /*
     * Fork a child process
     */
    c_pid = fork();
    
    /* Check for an error with fork*/
    if(c_pid < 0) {
        fprintf(stderr, "Error: Fork failed!\n");
        return -1;
    }

    /*
     * Launch the job in the foreground or background
    */

   /* The child process */
    if(c_pid == 0) {
        execvp(loc_job->binary, loc_job->argv);

        // If execvp returns, then there was an error
        fprintf(stderr, "Error: Command %s does not exist or could not be executed!\n", loc_job->binary);

        exit(-1);
    }
    /* The parent process */
    else {
        if(loc_job->is_background == FALSE) {
            waitpid(c_pid, &status, 0);
        }
        else {
            // Start the job as a background job
            waitpid(c_pid, &status, WNOHANG);

            /* Background accounting */

            // Check if jobs needs to be reallocated
            if(total_jobs_joblist == jobs_length) {
                jobs_length += 50;
                jobs = realloc(jobs, sizeof(job_t) * jobs_length);
                if(jobs == NULL) {
                    fprintf(stderr, "Error: Memory allocation failed\n");
                }
            }
            jobs[total_jobs_joblist].full_command = loc_job->full_command;
            jobs[total_jobs_joblist].pid = c_pid;
            jobs[total_jobs_joblist].state = strdup("Running");
            jobs[total_jobs_joblist].job_id = total_jobs_bg + 1;
            total_jobs_in_bg++;
            total_jobs_bg++;
            total_jobs_joblist++;

        }

    }

    /*
     * General accounting
    */
    add_history(loc_job->full_command);
    total_jobs++;

    return 0;
}

int execute_with_input_redir(job_t * loc_job) {
    pid_t c_pid = 0;
    int status = 0;

    /*
     * Fork a child process
     */
    c_pid = fork();

    if(c_pid == 0) {
        // Child process
        int fd = open(loc_job->input_file, O_RDONLY);
        if(fd < 0) {
            perror("open");
            return -1;
        }

        // Redirect standard input from the file
        if(dup2(fd, STDIN_FILENO) < 0) {
            perror("dup2");
            return -1;
        }

        // close the file descriptor
        close(fd);

        // Now execute the command. Input will come from the file.
        execvp(loc_job->binary, loc_job->argv);

        // If execvp returns, there was an error
        perror("execvp");
        return -1;
    } 
    else if(c_pid < 0) {
        // Error forking
        perror("fork");
    } 
    else {
        // Parent process. Wait for the child to finish.
        waitpid(c_pid, &status, 0);
        add_history(loc_job->full_command);
        total_jobs++;
    }

    return 0;
}

int execute_with_output_redir(job_t * loc_job) {
    pid_t c_pid = 0;
    int status = 0;

    c_pid = fork();

    // Child process
    if(c_pid == 0) {
        // Open the output file
        int fd = open(loc_job->output_file, O_WRONLY | O_CREAT, S_IRUSR | S_IWUSR);
        if (fd < 0) {
            perror("open");
            return -1;
        }

        // Redirect standard output to the file
        if(dup2(fd, STDOUT_FILENO) < 0) {
            perror("dup2");
            return -1;
        }

        // close the file descriptor
        close(fd);

        // Now execute the command. Output will go to the file.
        execvp(loc_job->binary, loc_job->argv);

        // If execvp returns, there was an error
        perror("execvp");
        return -1;
    }
    else if (c_pid < 0) {
        // Error forking
        perror("fork");
    }
    else {
        // Parent process. Wait for the child to finish.
        waitpid(c_pid, &status, 0);
        add_history(loc_job->full_command);
        total_jobs++;
    }

    return 0;
}

void sigchld_handler(int signum) {
    int status;
    pid_t pid;

    while ((pid = waitpid(-1, &status, WNOHANG)) > 0) {

        for (int i = 0; i < jobs_length && jobs[i].pid != 0; i++) {
            if (jobs[i].pid == pid) {
                jobs[i].state = "Done";
                total_jobs_in_bg--;
                break;
            }
        }
    }
}

int builtin_exit(void) {
    if(total_jobs_in_bg > 0) {
        printf("There are %d background jobs running. Waiting before exiting.\n", total_jobs_in_bg);
        builtin_wait();
    }

    print_counts();
    exit(0);    
    return 0;
}

void print_counts() {
    /*
     * Display counts
     */

    printf("-------------------------------\n");
    printf("Total number of jobs               = %d\n", total_jobs);
    printf("Total number of jobs in history    = %d\n", total_history);
    printf("Total number of jobs in background = %d\n", total_jobs_bg);
}

int builtin_jobs(void) { 
    /* Print the jobs */
    for(int i = 0; i < total_jobs_joblist && jobs[i].state != NULL; i++) {
        char * dup_command = strdup(jobs[i].full_command);
        char * token = strtok(dup_command, "&");
        printf("[%d]   %-7s    %s\n", jobs[i].job_id, jobs[i].state, token);
        free(dup_command);
    }

    /* Remove jobs that are done*/
    for(int i = 0; i < total_jobs_joblist && jobs[i].state != NULL; i++) {
        if(strcmp(jobs[i].state, "Done") == 0) {
            // Shift the remaining jobs down
            for (int j = i; j < total_jobs_joblist - 1; j++) {
                jobs[j] = jobs[j + 1];
            } 
            total_jobs_joblist--;
            i--;
        }
    }

    return 0;
}

int builtin_history(void) {
    for (int i = 0; i < total_history; i++) {
        char * token = strtok(history[i], ";"); // Remove the semicolon if present
        printf("%4d   %s\n", i+1, token);
    }
    return 0;
}

int builtin_wait(void) {   
    if(total_jobs_in_bg == 0) {
        fprintf(stderr, "No background jobs to wait for\n");
        return -1;
    }
    else if(total_jobs_bg > 0) {
        int status;
        pid_t pid;
        while ((pid = waitpid(-1, &status, 0)) > 0) {
            for (int i = 0; i < jobs_length && jobs[i].pid != 0; i++) {
                if (jobs[i].pid == pid) {
                    jobs[i].state = "Done";
                    total_jobs_in_bg--;
                    break;
                }
            }
        }
        if (errno != ECHILD) {
            perror("waitpid");
            // handle error
        }
    }
    // This should never happen
    else {
        fprintf(stderr, "Error: job tracking failed\n");
    }

    return 0;
}

int builtin_fg(void) {
    if(total_jobs_in_bg == 0) {
        fprintf(stderr, "No background jobs to bring to the foreground\n");
        return -1;
    }

    /* Find the latest job that is still running */
    job_t *job;
    for(int i = total_jobs_joblist - 1; i >= 0; i--) {
        if(strcmp(jobs[i].state, "Running") == 0) {
            job = &jobs[i];
            break;
        }
    }

    /* Bring job to foreground */
    pid_t pid = job->pid;
    int status;
    waitpid(pid, &status, 0);

    /* Accounting */
    job->state = "Done";
    total_jobs_in_bg--;

    return 0;
}

int builtin_fg_num(int job_num) {
    job_t *job;
    for(int i = 0; i < total_jobs_joblist; i++) {
        if(jobs[i].job_id == job_num) {
            if(strcmp(jobs[i].state, "Done") == 0) {
                fprintf(stderr, "Error: Job %d is finished\n", job_num);
                return -1;
            }
            job = &jobs[i];
        }
    }

    if(job == NULL) {
        fprintf(stderr, "Error: Job %d does not exist or has finished executing\n", job_num);
        return -1;
    }

    /* Bring job to foreground */
    pid_t pid = job->pid;
    int status;
    waitpid(pid, &status, 0);

    /* Accounting */
    job->state = "Done";
    total_jobs_in_bg--;

    return 0;
}

int add_history(char * command) {
    if(total_history == history_length) {
        history_length += 50;
        history = realloc(history, sizeof(char*) * history_length);
        if(history == NULL) {
            fprintf(stderr, "Error: Memory allocation failed\n");
            return -1;
        }
    }

    history[total_history] = command;
    total_history++;
    return 0;
}

