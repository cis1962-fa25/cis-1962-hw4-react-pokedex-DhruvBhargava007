# Homework 4 AI Synthesis Activity

## Activity: You used AI

### Part 1

I used ChatGPT to learn how to interact with the provided backend server and API.
I pasted the provided `API.md` documentation into the chat and asked for guidance on how to consume the endpoints using JavaScript/TypeScript.
The full conversation is recorded in the link - https://chatgpt.com/share/692501d2-50e0-8002-898a-0733a1c656d6.

### Part 2

I used AI because although I was given the API documentation and the backend server was already built for me, I needed assistance in writing the client-side code to communicate with it.
I wanted to know the best practices for structuring `fetch` requests, handling the JWT authentication headers, and managing the asynchronous nature of the API calls.

### Part 3

The AI's response was excellent. It analyzed the provided `API.md` and generated a structured approach to interacting with the server.
It showed me how to create a reusable request function that handles the base URL and authorization headers automatically.
I adapted the AI's suggestion to fit my project's structure, specifically the `apiClient.ts` implementation.

### Part 4

The AI introduced the concept of a generic `request<T>` function to handle different return types from the API in a type-safe manner.
It also demonstrated the use of `URLSearchParams` for constructing query strings for the paginated endpoints.
I researched these patterns to ensure I understood how they improved the code's maintainability and type safety.
