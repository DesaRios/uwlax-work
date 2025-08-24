#include <stdio.h>

int main(int argc, char * argv[]) {
	printf("Hello, World!\n");
	printf("What is your name?\n");
	
	char * name[100];
	scanf("%s", name);
	printf("Hello, %s!\n", name);

	return 0;
}
