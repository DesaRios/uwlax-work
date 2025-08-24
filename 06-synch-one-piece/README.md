# CS441/541 Synchronization Project

## Author(s):

Adrian Rios


## Date:

4/15/2024


## Description:

This program simulates an election polling station that services a steady stream of voters throughout the day. The polling station has a fixed number of voting booths available. The program adheres to a new voter law that restricts the types of registered voters that are allowed to vote at the same time. There are three types of registered voters: Democrats, Independents, and Republicans. According to the law, Republicans and Democrats should never be allowed to vote at the same time. Independents, however, can vote with either Republicans or Democrats. The program creates the requisite number of Democrat, Independent, and Republican threads, representing the voters. It then uses semaphores to synchronize the voting at the polling station, ensuring that the voting law is adhered to. Each voter thread identifies itself by political party and thread identifier whenever its state changes. This allows for easy tracking of the voting process and ensures that the law is being followed correctly.


## How to build the software

Run 'make'


## How to use the software

The program accepts up to four arguments in the following order:

Number of voting booths at the polling station (positive integer greater than 0). This argument is optional. The default value is 10.
Number of Democrats (positive integer greater than 0). This argument is optional. The default value is 5.
Number of Republicans (positive integer greater than 0). This argument is optional. The default value is 5.
Number of Independents (positive integer greater than 0). This argument is optional. The default value is 5.
You can run the program with these arguments like so:

./finicky-voter <num_booths> <num_democrats> <num_republicans> <num_independents>

After starting all of the threads, the threads must wait for the polling station to open up. The main thread will wait for two whole seconds after creating the threads before opening the polling station. Once the station opens then voters are allowed to lineup to vote.

Each voter will print a message, identifying itself with its political party and identifier, as it goes through the voting process. This includes when it's waiting for the polling station to open, enters the polling station and signs-in at the registration desk, starts waiting on the first available voting booth, enters a voting booth (identifying which voting booth it entered by number), and leaves the voting booth and polling station.
## How the software was tested

TODO


## Known bugs and problem areas

Independents are not subject to queue

## Special Section

1. My solution to the problem involves the use of semaphores and a queue. When a democrat or republican enters the station after signing in, they enter the queue. The first thread in the queue is allowed to pass the blocking semaphore(dem_semaphore or rep_semaphore) and continue to wait for a booth. However, before waiting for a booth, they check to see if the thread behind them in the queue is of the same type. If the thread behind them is the same type, then they are also allowed to wait for a booth. The number of dems and reps currently waiting or voting is kept track of because whenever a thread is done voting, they only let the other type wait for a turn if they are the last of their type to leave. This prevents republicans and democrats from waiting for a booth and voting at the same time.

2. My solution is fair because it follows the order of arrival for republicans and democrats but not fair regarding independent voters because they are not subject to the queue. Starvation is prevented by only allowing a streak of dems or reps to vote based on their arrival order.



