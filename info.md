

# Homework 4: React Pokedex


In this homework, you will use **React** and **Vite** to build a Pokedex application.

A Pokedex is a handheld device from the Pokémon franchise that displays information about Pokémon and tracks which ones you've caught. You'll be building a web-based Pokedex using the API we've provided.

This homework is open-ended, so feel free to get creative with the design and features while meeting the core requirements below.

#### API Documentation

See API.md within the starter files for complete endpoint details and response types.

**Important**: Box management endpoints require authentication via Bearer token. You'll need to obtain a JWT token from your instructor to access these features. This will be the **same JWT token** you used in HW2, so please copy and reuse your token from that homework's API!

### Assignment Goals

-   Use React to design the view for an app given a complete backend
-   Communicate with a backend API to retrieve and store data
-   Learn the project structure and syntax of a React application, making use of TypeScript for types throughout.

## Terminology & References

You will not need domain knowledge about the Pokémon franchise to do this project. However, there are some important terms to review that may help when designing your Pokedex. We'll provide their definitions as they relate to the app below:

-   **Pokémon**: A creature that can be caught and stored in your Pokedex
-   **Pokedex**: A device for viewing Pokémon information and tracking catches
-   **Box**: An online storage container for caught Pokémon entries

There are many online resources you may reference to inspire the design of your Pokedex. For instance, [Pokémon Showdown](https://dex.pokemonshowdown.com/pokemon/) has a searchable Pokedex that contains a lot of information. Your web application will show a much smaller subset of information and be paginated, but should generally show serve a similar function to similar online Pokedexes.

## Recommended Steps

### Step 1: Set up the project

Create a new React project using Vite with TypeScript:

npm create vite@latest pokedex --template react-ts

Install any necessary dependencies (we've included a package.json with linting and prettier configs) and organize your project structure appropriately.

#### Recommended Project Structure:

pokedex/
├── src/
│   ├── components/
│   │   ├── PokemonList.tsx
│   │   ├── PokemonCard.tsx
│   │   ├── PokemonDetails.tsx
│   │   ├── BoxList.tsx
│   │   ├── BoxCard.tsx
│   │   ├── BoxForm.tsx
│   │   └── Modal.tsx
│   ├── api/
│   │   └── PokemonAPI.ts
│   ├── types/
│   │   └── types.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── package.json
└── tsconfig.json

This structure keeps your code organized and makes it easy to find and modify specific features.

### Step 2: Define TypeScript types and build the basic interface

#### TypeScript Types:

First, create type definitions based on the API documentation. Create a types.ts file with interfaces that match the API responses:

// From API.md - Pokemon types
export interface PokemonType {
  name: string;
  color: string;
}

export interface PokemonMove {
  name: string;
  power?: number;
  type: PokemonType;
}

export interface Pokemon {
  id: number;
  name: string;
  description: string;
  types: PokemonType\[\];
  moves: PokemonMove\[\];
  sprites: {
    front\_default: string;
    back\_default: string;
    front\_shiny: string;
    back\_shiny: string;
  };
  stats: {
    hp: number;
    speed: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
  };
}

// Box entry types
export interface BoxEntry {
  id: string;
  createdAt: string;
  level: number;
  location: string;
  notes?: string;
  pokemonId: number;
}

export interface InsertBoxEntry {
  createdAt: string;
  level: number;
  location: string;
  notes?: string;
  pokemonId: number;
}

export interface UpdateBoxEntry {
  createdAt?: string;
  level?: number;
  location?: string;
  notes?: string;
  pokemonId?: number;
}

#### Component Structure

Create the foundational UI components for your Pokedex:

-   PokemonList — displays the paginated list of Pokémon with pagination controls
-   PokemonCard — shows individual Pokémon (image, name, types) in the list
-   PokemonDetail — displays detailed Pokémon information in a modal
-   BoxList — displays the user's caught Pokémon
-   BoxCard — shows a Box entry with edit/delete buttons
-   BoxForm — form for creating/editing Box entries
-   Modal — reusable modal component for forms and details

#### Component Props

Define clear prop interfaces for each component:

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

interface BoxCardProps {
  entry: BoxEntry;
  pokemon: Pokemon;
  onEdit: (entry: BoxEntry) => void;
  onDelete: (id: string) => void;
}

When defining prop and state types for each component, reference the response types provided in API.md.

### Step 3: Create an API service class

Create an API service class (e.g., PokemonAPI.ts) to encapsulate all API requests. This class should:

#### Configuration:

-   Use base URL: https://cis1962-hw4-server.esinx.net/api/
-   Store and manage the JWT authentication token (provided by your instructor)
-   Handle adding the Authorization: Bearer {token} header for Box endpoints
-   Implement error handling for failed requests

#### API Endpoints to Support:

Refer to API.md for complete details on all endpoints. Your class should support:

-   **Pokémon Endpoints** (no authentication required):

-   GET /pokemon/ - List Pokémon with pagination (requires limit and offset query params)
-   GET /pokemon/:name - Get details for a specific Pokémon by name

-   **Box Endpoints** (authentication required):

-   GET /box/ - List all Box entry IDs for the authenticated user
-   POST /box/ - Create a new Box entry
-   GET /box/:id - Get a specific Box entry
-   PUT /box/:id - Update a Box entry
-   DELETE /box/:id - Delete a Box entry

#### Pagination Tips:

-   Listing endpoints require limit and offset parameters
-   We recommend a page size of 10, though you're free to choose differently
-   Calculate offset as pageNumber \* pageSize to fetch the correct page

### Step 4: Integrate the API with components

With your basic interface and API class ready, connect them together.

#### State Management:

Create state variables in your components to track:

-   pokemon: Pokemon\[\] — the current page of Pokémon
-   loading: boolean — whether data is being fetched
-   error: string | null — any error messages
-   currentPage: number — the current pagination page

#### Data Fetching Flow:

-   When the component mounts, call the GET /pokemon/ endpoint with appropriate limit and offset
-   Set loading to true before the request
-   On success, update the pokemon state and set loading to false
-   On error, store the error message and set loading to false
-   Display loading spinners, error messages, or the Pokémon list based on state

#### Pagination Controls:

-   Add "Previous" and "Next" buttons to navigate between pages
-   Disable "Previous" when on the first page
-   Update the currentPage state when buttons are clicked
-   Fetch new data whenever currentPage changes (use useEffect)

#### Pokémon Details:

-   When a user clicks on a PokemonCard, fetch details via GET /pokemon/:name
-   Display the detailed information in a modal
-   The API response includes:

-   Stats (HP, Attack, Defense, Special Attack, Special Defense, Speed)
-   Sprites (front\_default, back\_default, front\_shiny, back\_shiny)
-   Types with colors (useful for styling!)
-   Moves with power and type information

By the end of this step, you should have a working Pokedex that displays a paginated list of Pokémon and shows detailed information in a modal when a Pokémon is clicked.

**Note**: You may not use third-party libraries for state management or data fetching (like React Query, SWR, Redux, etc.). Use React's built-in useState and useEffect hooks.

### Step 5: Implement Box functionality

With the basic Pokedex working, add the ability to catch and store Pokémon.

#### **Box Entry Structure**: Each Box entry must contain:

-   pokemonId: number — The Pokémon's ID
-   location: string — Where it was caught (e.g., "Route 1", "Viridian Forest")
-   createdAt: string — Catch date and time in ISO 8601 format (e.g., "2024-01-15T10:30:00Z")
-   level: number — The level at which it was caught (1-100)
-   notes?: string — Optional notes about the catch

#### Implementation Steps:

-   Add a catch button:

-   Add an "Add to Box" or "Catch" button to the PokemonDetails modal
-   When clicked, open a new modal or form overlay

-   Create a Box entry form:

-   Create form inputs for each required field
-   Use controlled components (inputs tied to state variables)
-   Add validation:

-   Location: non-empty string
-   Level: number between 1 and 100
-   Date: valid ISO 8601 string (use new Date().toISOString() for current time)

-   Notes field is optional

-   Handle form submission:

-   Construct an InsertBoxEntry object with the form data
-   Send a POST request to /box/ with the entry data in the request body
-   Include the authentication token in the Authorization header
-   On success, close the modal and refresh the Box list
-   Handle any errors appropriately

-   Error handling:

-   Handle authentication errors (401) — invalid or missing token
-   Handle validation errors (400) — invalid input data
-   Display error messages to users in a user-friendly way

By the end of this step, you should have a working Pokedex that displays a paginated list of Pokémon and shows detailed information in a modal when a Pokémon is clicked.

**Note**: You may not use third-party libraries for state management or data fetching (like React Query, SWR, Redux, etc.). Use React's built-in useState and useEffect hooks.

### Step 6: Implement Box list view

Create a view for users to see their caught Pokémon.

#### View Switching:

-   Add a toggle or tab navigation to switch between "All Pokémon" and "My Box" views
-   Keep these views separate (don't unmount them unnecessarily to preserve scroll position)
-   Consider using state like view: 'pokemon' | 'box' to control which view is shown

#### Fetching Box Data:

The Box API works differently from the Pokémon list:

-   First, call GET /box/ to get an array of Box entry IDs
-   Then, for each ID, call GET /box/:id to get the complete entry
-   For each entry, you'll need to fetch the corresponding Pokémon data

#### Important Challenge:

Box entries only store pokemonId (a number), but GET /pokemon/:name requires a name (string). To solve this:

-   **Option A**: When initially loading Pokémon, create a Map of id -> name that you can reference later
-   **Option B**: Extend your Box entry state to also store the Pokemon name when creating entries
-   **Option C**: Fetch all Pokemon first and create a lookup function that finds by ID

We recommend Option A: maintain a Pokemon ID-to-name mapping at the app level. Fetch a large batch of Pokemon on app load, build a Map, then use it to look up names when displaying Box entries.

#### Box Card Component:

Create a BoxCard component that displays:

-   The Pokémon's name and sprite (fetch from Pokemon data)
-   Catch location
-   Catch date (format the ISO string to be readable)
-   Level
-   Notes (if present)
-   Action buttons:

-   **Edit** — opens a modal with pre-filled form to update the entry
-   **Delete** — confirms and deletes the entry

#### Edit Functionality:

-   When "Edit" is clicked, open a modal with the form pre-populated with current values
-   Allow users to modify location, level, and notes
-   On submit, send a PUT request to /box/:id with the updated fields
-   Refresh the Box list after successful update

#### Delete Functionality:

-   When "Delete" is clicked, show a confirmation dialog
-   On confirmation, send a DELETE request to /box/:id
-   Remove the entry from state or refetch the entire list

#### Auto-Refresh

After creating, updating, or deleting an entry, refresh the Box list by re-fetching the data from the API.

### Step 7: Polish and test your application

Before submitting, ensure your application is complete and polished.

#### Error Handling:

-   Test what happens when the API is unreachable
-   Handle all error codes appropriately:

-   401 UNAUTHORIZED — Show message about invalid/missing authentication token
-   404 NOT\_FOUND — Handle when a Pokémon or Box entry doesn't exist
-   400 BAD\_REQUEST — Display validation errors to users
-   500 INTERNAL\_SERVER\_ERROR — Show a generic error message

#### Loading States:

-   Show loading spinners or skeletons while fetching data
-   Disable buttons during API calls to prevent duplicate requests
-   Consider optimistic updates for better UX (update UI before API response)

#### Styling and UX:

-   Make your application visually appealing
-   Use the color property from Pokemon types to add themed styling
-   Display Pokemon sprites prominently
-   Ensure forms are user-friendly with clear labels and validation messages
-   Add hover effects and transitions
-   Make it responsive for different screen sizes

#### Edge Cases to Test:

-   Empty states (no Box entries)
-   First/last page of pagination
-   Creating multiple Box entries for the same Pokémon
-   Editing entries with optional fields (notes)
-   Very long notes or location names
-   Form validation (negative levels, empty required fields)

#### TypeScript:

-   Ensure all types are properly defined
-   No any types without good reason
-   Use the types from API.md as interfaces in your code

## AI Synthesis Activity

As part of an initiative to promote honest and ethical use of AI and LLMs in programming classes, you will perform an AI synthesis activity as part of this homework. This assignment will be written within your AIAssignment.md file, and will differ based on a self-report of whether you have used AI for any part of this assignment or not. Please be truthful about your usage, because either way, you will still need to perform this AI synthesis activity! This AI synthesis activity will represent **5% of the individual homework's grade**.

### Activity A: If you used AI

-   Cite the usage by including screenshots or a link to the conversation with your AI of choice. Make sure to include any context, instructions, and all the converstations you had with the AI.
-   Write about why you used AI. Was there a gap in knowledge you wanted to fill? Were the answers through traditional search engines not adquete? Did you want to let AI help you format something in a quick manner?
-   Evaluate the AI's response. If you asked multiple questions, you can pick one of the responses the AI generated. Does the AI answer your question properly? Does it hallucinate any details? Could there be room to improve this response through manual editing? Did you accept this response fully or adapt parts of it into your work?
-   If you used unfamiliar syntax or concepts generated by AI within your assignment, be sure to research them and explain what those concepts are to demonstrate your understanding.

### Activity B: If you did NOT AI

-   Explain some improvement you want to make within your code. Perhaps you have a code block that could be more concise, or a part of your code could be improved with a library or be performed with a more efficient algorithm.
-   Ask AI how to improve your code, by picking a part of your program you are interested in improving and asking something along the lines of "how can I improve this code?" This does not have to be verbatim; you could ask more specific questions for improvement, like "what JavaScript libraries could improve the efficiency of my code?"
-   Evaluate the response the AI generates. You may need to do some research to do this evaluation, to see if the syntax generates correctly or if any libraries the AI suggests are appropriate for the current task. Report on whether the AI's solution fits within your project, or if it would need modifications to work properly.
-   You do NOT need to use the AI suggestion within your final submission, if your code already works properly. If the scope of your inquiry in this activity leads you to replace parts of your code, switch to Assignment A instead.

Templates for these responses are included in the provided AIAssignment.md starter files for this assignment. You can also refer to the dedicated [AI Policy](ai-policy) page for more information and examples of good responses. This activity will be graded mostly for effortful completion. We are looking to foster an environment of honest AI usage, so please take this activity as a learning opportunity!

## Submission & Rubric

To submit, simply push your commits to the repository generated from GitHub classroom. Make sure your latest commit before the deadline includes all files you worked on during this homework and your AIAssignment.md file containing your AI syntesis activity. Before you submit, make sure you lint your code for style errors using the command npm run lint. More details on style can be found in the [style guide](style-guide). We will take -1 points for every style error remaining in the submission for the submitted files.

### Rubric

-   Create a new React project using Vite with TypeScript
-   Fetch Pokémon data from the provided API
-   Display Pokémon data in a **paginated** list
-   Allow users to mark a Pokémon as caught and add it to their Box
-   Display a user's caught Pokémon in a Box view
-   Show detailed information for individual Pokémon
-   Enable users to delete Box entries
-   Enable users to edit Box entries