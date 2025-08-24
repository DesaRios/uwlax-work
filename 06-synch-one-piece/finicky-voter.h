/*
 * 
 *
 * CS 441/541: Finicky Voter 
 *
 */
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>
#include <errno.h>
#include <pthread.h>
#include "semaphore_support.h"

/*****************************
 * Defines
 *****************************/
#define DEFAULT_BOOTHS 10
#define DEFAULT_DEMOCRATS 5
#define DEFAULT_REPUBLICANS 5
#define DEFAULT_INDEPENDENTS 5
#define TRUE 1
#define FALSE 0
/*****************************
 * Structures
 *****************************/
typedef struct Node {
    char type;
    struct Node* next;
} Node;

/*****************************
 * Global Variables
 *****************************/

Node* front = NULL;
Node* rear = NULL;

char *station;
int num_booths;
int num_democrats;
int num_republicans;
int num_independents;
int num_voters;
int num_voted;
char turn = ' ';
int num_dem_in_station = 0;
int num_rep_in_station = 0;
//int num_voters;
//int num_voted;
semaphore_t poll_open;
semaphore_t print_mutex;
semaphore_t dem_semaphore;
semaphore_t rep_semaphore;
semaphore_t available_booths;
semaphore_t station_update_mutex;
semaphore_t check_turn_mutex;
semaphore_t queue_mutex;
semaphore_t done_voting;
semaphore_t voting_mutex;

/*****************************
 * Function Declarations
 *****************************/

/**
 * Function to simulate a democrat voter
 * 
 * @param threadid - the id of the thread
 * 
*/
void *democrat(void *threadid);

/**
 * Function to simulate a republican voter
 * 
 * @param threadid - the id of the thread
 * 
*/
void *republican(void *threadid);

/**
 * Function to simulate an independent voter
 * 
 * @param threadid - the id of the thread
 * 
*/
void *independent(void *threadid);

/**
 * Function to print a voter status message
 * 
 * @param voter_type - the type of voter
 * @param threadid - the id of the thread
 * @param message - the message to be displayed
 * 
*/
void print_message(char *voter_type, int threadid, char *message);

/**
 * Function to print the polling station
 * 
*/
void print_station();

/**
 * Function to sleep for a random amount of time between 0 and 50000 microseconds
 * 
 * @param seed - the seed for the random number generator
 * 
*/
void voter_sign_in(unsigned int *seed);

/**
 * Function for a voter to vote
 * 
 * @param seed - the seed for the random number generator
 * @param voter_type - the type of voter
 * @param threadid - the id of the thread
 * @param booth - the booth number
 * 
*/
void voter_vote(unsigned int *seed, char *voter_type, int voter_id, int booth);

/**
 * Function to occupy a booth
 * 
 * @param vt - the voter type
 * 
 * @return the booth number
 * 
*/
int occupy_booth(char vt);

/**
 * Function to release a booth
 * 
 * @param booth - the booth number
 * 
*/
void release_booth(int booth);
