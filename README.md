# AgentQL Tutorial


## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd agentql-tutorial
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file by copying the `.env.example` file:
    ```sh
    cp .env.example .env
    ```

4. Add your `AGENTQL_API_KEY` to the `.env` file:
    ```dotenv
    AGENTQL_API_KEY=your_agentql_api_key_here
    ```

5. Install Playwright browsers:
    ```sh
    npx playwright install
    ```

## Running Tests

To run the tests, use the following command:
```sh
npm test
``
