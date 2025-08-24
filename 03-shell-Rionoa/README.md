# CS441/541 Shell Project

## Author(s):

Adrian Rios


## Date:

3/7/2024


## Description:

This assignment involves the implementation of a simple command line interpreter, commonly known as a shell. The shell operates by creating child processes to execute user-entered commands and prompts for additional input once the command execution is complete. The shell supports both interactive mode, where users input commands one at a time, and batch mode, where commands are read from a file. The shell handles sequential and concurrent execution of multiple jobs, with the ability to run jobs in the background. Built-in commands like jobs, history, wait, fg, and exit are supported. The shell also handles redirection using < and > for stdin and stdout, respectively.


## How to build the software

run 'make'


## How to use the software

To use the shell, run it from the command line, providing optional batch file(s) as arguments. In interactive mode, the shell displays the prompt "mysh$," and users can input commands one at a time. Commands are executed sequentially, and the prompt is returned when all jobs are completed. In batch mode, the shell processes commands from the specified batch file(s) without displaying a prompt. The shell supports the execution of multiple jobs sequentially or concurrently. Users can run jobs in the background using "&" and check their status with the "jobs" command.

Built-in commands like "history" and "wait" provide additional functionality. Redirection is supported using < and > for stdin and stdout, respectively. The shell terminates upon encountering the "exit" command or reaching the end of the input stream. Before exiting, the shell displays statistics, including the total number of executed jobs, jobs in history, and jobs executed in the background.


## How the software was tested

Test1 tests for:
    single command per line
    exiting without 'exit' command and waiting for background process

Test2 tests for:
    sequential commands
    'wait' command used when no background jobs are running
    'history' command
    'exit' command

Test3 tests for:
    sequential background commands
    'jobs' showing background commands
    'fg' with an argument
    'fg' without an argument
    'wait' with background process to wait for
    exiting wihtout 'exit' command

Test4 tests for:
    'exit' waiting for background processes

Test 5 tests for:
    redirection input
    redirection output
    redirection commands shown in 'history'

Test 6 tests for:
    a mix of all builtin commands and empty lines


## Known bugs and problem areas

Test 5 prints job data prematurely
