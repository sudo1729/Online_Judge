#include<stdio.h> 
  
int main() 
{ 
#ifndef ONLINE_JUDGE 
  
    // For getting input from input.txt file 
    freopen("input.txt", "r", stdin); 
  
    // Printing the Output to output.txt file 
    freopen("output.txt", "w", stdout); 
  
#endif 

long x;scanf("%d",&x);
for(long i=0;i<x;i++)
    printf("%d ",i);

    return 0; 
} 