/*
 * Adrian Rios
 *
 * CS441/541: Project 3
 *
 */
#ifndef MYSHELL_H
#define MYSHELL_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <errno.h>

/* For fork, exec, sleep */
#include <sys/types.h>
#include <unistd.h>
/* For waitpid */
#include <sys/wait.h>
/* For isspace */
#include <ctype.h>

/******************************
 * Defines
 ******************************/
#define TRUE  1
#define FALSE 0

#define MAX_COMMAND_LINE 1024

#define PROMPT ("mysh$ ")



/******************************
 * Structures
 ******************************/
/*
 * A job struct.  Feel free to change as needed.
 */
struct job_t {
    char * full_command;
    int argc;
    char **argv;
    int is_background;
    char * binary;
    pid_t pid;
    char* state;
    int input_redir;
    int output_redir;
    char* input_file;
    char* output_file;
    int job_id;
};
typedef struct job_t job_t;

/******************************
 * Global Variables
 ******************************/
 
/*
 * Interactive or batch mode
 */
int is_batch = FALSE;

/*
 * Background Jobs array
 */
int jobs_length = 512;
job_t *jobs;

/*
 * History array
 */
int history_length = 512;
char** history;

/*
 * Counts
 */
int total_jobs_display_ctr = 0;
int total_jobs    = 0;
int total_jobs_bg = 0;
int total_jobs_in_bg = 0;
int total_jobs_joblist = 0;
int total_history = 0;

/*
 * Debugging mode
 */
int is_debug = FALSE;

/******************************
 * Function declarations
 ******************************/
/*
 * Parse command line arguments passed to myshell upon startup.
 *
 * Parameters:
 *  argc : Number of command line arguments
 *  argv : Array of pointers to strings
 *
 * Returns:
 *   0 on success
 *   Negative value on error
 */
int parse_args_main(int argc, char **argv);

/*
 * Parse command line arguments passed to myshell in interactive mode.
 *
 * Parameters:
 *  input : Command line input
 *
 * Returns:
 *   0 on success
 *   Negative value on error
 */
int parse_args_interactive(char *input);

/*
 * remove spaces from a string
 * 
 *  Parameters:
 * str : String to remove spaces from
 * 
 *  Retuirns:
 *  String with spaces removed
*/
char *trim_whitespace(char *str);

/*
 * Tokenize a string and return an array of strings
 * Include the delimiters in the array of strings
 *
 * Parameters:
 *  str : String to tokenize
 *  delim1 : First delimiter to use
 *  delim2 : Second elimiter to use
 *
 * Returns:
 *   Array of strings
 */
char** tokenize_and_keep_delim(char *str, const char *delim1, const char *delim2);

/* Free space allocated in tokenize_and_keep_delim 
*
*Parameters:
*  tokens: Array of strings
*
*/
void free_tokens(char **tokens);

/*
 * Use command line argument to make a job.
 *
 * Parameters:
 *  input : Command line input
 *
 * Returns:
 *   A job struct
 */
job_t* parse_job(char * input);

/*
 * Main routine for batch mode
 *
 * Parameters:
 *  None
 *
 * Returns:
 *   0 on success
 *   Negative value on error
 */
int batch_mode(int num_args, char *argv[]);

/*
 * Main routine for interactive mode
 *
 * Parameters:
 *  argv : Array of pointers to strings representing batch files
 *
 * Returns:
 *   0 on success
 *   Negative value on error
 */
int interactive_mode(void);

/*
 * Launch a job
 *
 * Parameters:
 *   loc_job : job to execute
 *
 * Returns:
 *   0 on success
 *   Negative value on error 
 */
int launch_job(job_t * loc_job);

/*
* Launch a job with input redirection
*
* Parameters:
*   loc_job : job to execute
*
* Returns:
*   0 on success
*   Negative value on error
*/
int execute_with_input_redir(job_t * loc_job);

/*
* Launch a job with output redirection
*
* Parameters:
*   loc_job : job to execute
*
* Returns:
*   0 on success
*   Negative value on error
*/
int execute_with_output_redir(job_t * loc_job);


/*
* Signal handler for when a child terminates
*
* Parameters:
*   signum : signal number
*   
*/
void sigchld_handler(int signum);

/*
 * Built-in 'exit' command
 *
 * Parameters:
 *   None
 *
 * Returns:
 *   0 on success
 *   Negative value on error
 */
int builtin_exit(void);

/*
* Displays job count information
* 
* Parameters:
*   None
*
*/
void print_counts();

/*
 * Built-in 'jobs' command
 *
 * Parameters:
 *   None
 *
 * Returns:
 *   0 on success
 *   Negative value on error
 */
int builtin_jobs(void);

/*
 * Built-in 'history' command
 *
 * Parameters:
 *   None
 *
 * Returns:
 *   0 on success
 *   Negative value on error
 */
int builtin_history(void);

/*
 * Built-in 'wait' command
 *
 * Parameters:
 *   None
 *
 * Returns:
 *   0 on success
 *   Negative value on error
 */
int builtin_wait(void);

/*
 * Built-in 'fg' command
 *
 * Parameters:
 *   None (use default behavior)
 *
 * Returns:
 *   0 on success
 *   Negative value on error
 */
int builtin_fg(void);

/*
 * Built-in 'fg' command
 *
 * Parameters:
 *   Job id
 *
 * Returns:
 *   0 on success
 *   Negative value on error
 */
int builtin_fg_num(int job_num);

/*
 * Function to add a command to the history
 * 
 * Parameters:
 *  command : command to add to history
 * 
 * 
 *  Returns:
 *  0 on success
 *  Negative value on error
 * 
*/
int add_history(char * command);

#endif /* MYSHELL_H */
