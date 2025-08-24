/*
 * 
 *
 * CS 441/541: Finicky Voter 
 *
 */
#include "./finicky-voter.h"

int main(int argc, char * argv[]) {
    num_booths = DEFAULT_BOOTHS;
    num_democrats = DEFAULT_DEMOCRATS;
    num_republicans = DEFAULT_REPUBLICANS;
    num_independents = DEFAULT_INDEPENDENTS;
    num_voted = 0;

    if(argc > 1) num_booths = atoi(argv[1]);
    if(argc > 2) num_democrats = atoi(argv[2]);
    if(argc > 3) num_republicans = atoi(argv[3]);
    if(argc > 4) num_independents = atoi(argv[4]);
    if(argc > 5) {
        printf("Usage: %s [num_booths] [num_democrats] [num_republicans] [num_independents]\n", argv[0]);
        return 1;
    }
    num_voters = num_democrats + num_republicans + num_independents;

    /* Print Command Line Arguments */
    printf("Number of Voting Booths   :  %d\n", num_booths);
    printf("Number of Democrat        :  %d\n", num_democrats);
    printf("Number of Republican      :  %d\n", num_republicans);
    printf("Number of Independent     :  %d\n", num_independents);
    printf("---------------------------------------------\n");

    // Allocate space for polling station
    station = malloc(sizeof(char) * num_booths);
    if(station == NULL) {
        printf("Error: Unable to allocate memory for polling station\n");
        return 1;
    }

    // Initialize polling station
    for(int i = 0; i < num_booths; i++) {
        station[i] = '.';
    }

    // Initialize the semaphores
    semaphore_create(&poll_open, 0);
    semaphore_create(&print_mutex, 1);
    semaphore_create(&available_booths, num_booths);
    semaphore_create(&check_turn_mutex, 1);
    semaphore_create(&rep_semaphore, 0);
    semaphore_create(&dem_semaphore, 0);
    semaphore_create(&station_update_mutex, 1);
    semaphore_create(&queue_mutex, 1);
    semaphore_create(&done_voting, 0);
    semaphore_create(&voting_mutex, 1);

    int rc, t;

    // Create democrat threads
    pthread_t democrats[num_democrats];
    for(t = 0; t < num_democrats; t++) {
        rc = pthread_create(&democrats[t], NULL, democrat, (void *)(intptr_t)t);
        if(rc) {
            printf("Error: Unable to create democrat thread %d\n", t);
            exit(-1);
        }
    }

    // Create republican threads
    pthread_t republicans[num_republicans];
    for(t = 0; t < num_republicans; t++) {
        rc = pthread_create(&republicans[t], NULL, republican, (void *)(intptr_t)t);
        if(rc) {
            printf("Error: Unable to create republican thread %d\n", t);
            exit(-1);
        }
    }

    // Create independent threads
    pthread_t independents[num_independents];
    for(t = 0; t < num_independents; t++) {
        rc = pthread_create(&independents[t], NULL, independent, (void *)(intptr_t)t);
        if(rc) {
            printf("Error: Unable to create independent thread %d\n", t);
            exit(-1);
        }
    }

    // Sleep before opening the polling station
    sleep(2);

    // Open the polling station
    printf("---------------------------------------------\n");
    semaphore_post(&poll_open);

    /* Sleep before closing the polling station
    * Eventually the program will exit once all voters have voted 
    */
    semaphore_wait(&done_voting);
    /* Cleanup */

    // Join democrat threads
    for(t = 0; t < num_democrats; t++) {
        pthread_cancel(democrats[t]);
        rc = pthread_join(democrats[t], NULL);
        if(rc) {
            printf("Error: Unable to join democrat thread %d\n", t);
            exit(-1);
        }
    }

    // Join republican threads
    for(t = 0; t < num_republicans; t++) {
        pthread_cancel(republicans[t]);
        rc = pthread_join(republicans[t], NULL);
        if(rc) {
            printf("Error: Unable to join republican thread %d\n", t);
            exit(-1);
        }
    }

    // Join independent threads
    for(t = 0; t < num_independents; t++) {
        pthread_cancel(independents[t]);
        rc = pthread_join(independents[t], NULL);
        if(rc) {
            printf("Error: Unable to join independent thread %d\n", t);
            exit(-1);
        }
    }

    free(station);
    return 0;
}

void *democrat(void * threadID) {
    unsigned int seed = time(NULL) ^ (int)pthread_self();
    // Wait for polling station to open
    print_message("Democrat", (int)(intptr_t)threadID, "Waiting for polling station to open...");
    semaphore_wait(&poll_open);

    // Enter the polling station
    print_message("Democrat", (int)(intptr_t)threadID, "Entering the polling station"); 
    semaphore_post(&poll_open);

    // Sign in at voters registration
    voter_sign_in(&seed);
    
    // Add to queue
    semaphore_wait(&queue_mutex);
    Node* node = malloc(sizeof(Node));
    node->type = 'D';
    node->next = NULL;
    if (rear == NULL) {
        front = rear = node;
    } else {
        rear->next = node;
        rear = node;
    }
    semaphore_post(&queue_mutex);

    // Check if it's the voter's turn
    semaphore_wait(&queue_mutex);
    if (front == node) {
        semaphore_post(&dem_semaphore);
    }
    semaphore_post(&queue_mutex);

    // Wait for turn
    semaphore_wait(&dem_semaphore);

    // Check if the next voter is a democrat
    semaphore_wait(&queue_mutex);
    if (front->next != NULL && front->next->type == 'D') {
        semaphore_post(&dem_semaphore);
    }
    semaphore_post(&queue_mutex);

    semaphore_wait(&voting_mutex);
    num_dem_in_station++;
    semaphore_post(&voting_mutex);

   // Check for available booths
    print_message("Democrat", (int)(intptr_t)threadID, "Waiting on a voting booth");
    semaphore_wait(&available_booths);

    // Occupy a booth
    int booth = occupy_booth('D');

    // Vote
    voter_vote(&seed, "Democrat", (int)(intptr_t)threadID, booth);

    // Release the booth
    print_message("Democrat", (int)(intptr_t)threadID, "Leaving the polling station");
    release_booth(booth);
    semaphore_post(&available_booths);

    // Give turn to next voter
    semaphore_wait(&queue_mutex);
    num_dem_in_station--;
    if (front != NULL) {
        Node* temp = front;
        front = front->next;
        if (front == NULL) {
            rear = NULL;
        }
        if (front != NULL && front->type == 'R' && num_dem_in_station == 0) {
            semaphore_post(&rep_semaphore);
        }
        free(temp);
    }

    num_voted++;
    // Check if all voters have voted
    if(num_voted == num_voters) {
        printf("All %d voters have voted\n", num_voters);
        printf("Closing the polling station\n");
        semaphore_post(&done_voting);
    }

    semaphore_post(&queue_mutex);

    pthread_exit(NULL);
}

void *republican(void * threadID) {
    unsigned int seed = time(NULL) ^ (int)pthread_self();
    // Wait for polling station to open
    print_message("Republican", (int)(intptr_t)threadID, "Waiting for polling station to open...");
    semaphore_wait(&poll_open);

    // Enter the polling station
    print_message("Republican", (int)(intptr_t)threadID, "Entering the polling station");
    semaphore_post(&poll_open);

    // Sign in at voters registration
    voter_sign_in(&seed);

    // Add to queue
    semaphore_wait(&queue_mutex);
    Node* node = malloc(sizeof(Node));
    node->type = 'R';
    node->next = NULL;
    if (rear == NULL) {
        front = rear = node;
    } else {
        rear->next = node;
        rear = node;
    }
    semaphore_post(&queue_mutex);

    // Check if it's the voter's turn
    semaphore_wait(&queue_mutex);
    if (front == node) {
        semaphore_post(&rep_semaphore);
    }
    semaphore_post(&queue_mutex);

    // Wait for turn
    semaphore_wait(&rep_semaphore);

    // Check if the next voter is a republican
    semaphore_wait(&queue_mutex);
    if (front->next != NULL && front->next->type == 'R') {
        semaphore_post(&rep_semaphore);
    }
    semaphore_post(&queue_mutex);

    semaphore_wait(&voting_mutex);
    num_rep_in_station++;
    semaphore_post(&voting_mutex);
    
    // Check for available booths
    print_message("Republican", (int)(intptr_t)threadID, "Waiting on a voting booth");
    semaphore_wait(&available_booths);

    // Occupy a booth
    int booth = occupy_booth('R');

    // Vote
    voter_vote(&seed, "Republican", (int)(intptr_t)threadID, booth);

    // Release the booth
    print_message("Republican", (int)(intptr_t)threadID, "Leaving the polling station");
    release_booth(booth);
    semaphore_post(&available_booths);

    // Give turn to next voter
    semaphore_wait(&queue_mutex);
    num_rep_in_station--;
    if (front != NULL) {
        Node* temp = front;
        front = front->next;
        if (front == NULL) {
            rear = NULL;
        }
        if (front != NULL && front->type == 'D' && num_rep_in_station == 0) {
            semaphore_post(&dem_semaphore);
        }
        free(temp);
    }

    num_voted++;
    // Check if all voters have voted
    if(num_voted == num_voters) {
        printf("All %d voters have voted\n", num_voters);
        printf("Closing the polling station\n");
        semaphore_post(&done_voting);
    }
    semaphore_post(&queue_mutex);

    pthread_exit(NULL);
}

void *independent(void * threadID) {
    unsigned int seed = time(NULL) ^ (int)pthread_self();
    // Wait for polling station to open
    print_message("Independent", (int)(intptr_t)threadID, "Waiting for polling station to open...");
    semaphore_wait(&poll_open);

    // Enter the polling station
    print_message("Independent", (int)(intptr_t)threadID, "Entering the polling station");
    semaphore_post(&poll_open);

    // Sign in at voters registration
    voter_sign_in(&seed);


    // Check for available booths
    print_message("Independent", (int)(intptr_t)threadID, "Waiting on a voting booth");
    semaphore_wait(&available_booths);

    // Occupy a booth
    int booth = occupy_booth('I');

    // Vote
    voter_vote(&seed, "Independent", (int)(intptr_t)threadID, booth);

    // Release the booth
    print_message("Independent", (int)(intptr_t)threadID, "Leaving the polling station");
    release_booth(booth);
    semaphore_post(&available_booths);

    // Give turn to next voter
    semaphore_wait(&queue_mutex);

    num_voted++;
    // Check if all voters have voted
    if(num_voted == num_voters) {
        printf("All %d voters have voted\n", num_voters);
        printf("Closing the polling station\n");
        semaphore_post(&done_voting);
    }
    semaphore_post(&queue_mutex);

    pthread_exit(NULL);
}

void print_message(char *voter_type, int voter_id, char *message) {
    semaphore_wait(&print_mutex);
    printf("%-11s    %d         |-> ", voter_type, voter_id);
    print_station();
    printf(" <-| %s\n", message);
    semaphore_post(&print_mutex);
}
void print_station() {
    for(int i = 0; i < num_booths; i++) {
        printf("%c", station[i]);
    }
}

void voter_sign_in(unsigned int *seed) {
    int microseconds = rand_r(seed) % 50001;
    usleep(microseconds);
}

void voter_vote(unsigned int *seed, char *voter_type, int voter_id, int booth) {
    semaphore_wait(&print_mutex);
    printf("%-11s    %d in   %d  |-> ", voter_type, voter_id, booth);
    print_station();
    printf(" <-| Voting!\n");
    semaphore_post(&print_mutex);
    
    // Sleep for a random amount of time between 0 and 100,000 microseconds
    int microseconds = rand_r(seed) % 100001;
    usleep(microseconds);
}

int occupy_booth(char vt) {
    semaphore_wait(&station_update_mutex);
    int ret = -1;
    for(int i = 0; i < num_booths; i++) {
        if(station[i] == '.') {
            station[i] = vt;
            ret = i;
            break;
        }
    }
    semaphore_post(&station_update_mutex);
    return ret;
}

void release_booth(int booth) {
    semaphore_wait(&station_update_mutex);
    station[booth] = '.';
    semaphore_post(&station_update_mutex);
}
