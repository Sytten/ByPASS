#pragma once

#if 1
//Enable debug
#include <cstdio>
#define DBG(x, ...) std::printf("[BRIDGE : DBG]"x"\r\n", ##__VA_ARGS__) 
#define WARN(x, ...) std::printf("[BRIDGE : WARN]"x"\r\n", ##__VA_ARGS__) 
#define ERR(x, ...) std::printf("[BRIDGE : ERR]"x"\r\n", ##__VA_ARGS__)

#else
//Disable debug
#define DBG(x, ...) 
#define WARN(x, ...)
#define ERR(x, ...) 

#endif