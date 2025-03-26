# Real-time Crawlers - Solution

## Requirements

- node `>=18`

## How to use

1. Install Dependencies

Run the following command to install the required dependencies:

```bash
> npm i
```

2. Create a `.env` file and add the necessary configuration variables. See [Configuration](#configuration) section

3. Run Simulation API

Start the simulation API using:

```bash
> npm run start_deps
```

4. Build the Code

Build the project using:

```bash
> npm run build
```

5. Start the Express Server

Start the Express server using:

```bash
> npm run start
```

This will run the server and handle any errors using the custom errorHandler middleware.

> [!Note]
> By default, the service will be available on port `4000`. You can change this in the `.env` file. See `.env.example` for more details.

## Configuration

Configurable parameters are presented in the`.env.example` file:

- `PORT` - port the server will be running on
- `POLLING_INTERVAL` - interval to execute calls to the API
- `SIMULATION_BASE_URL` - base URL of the simulation API

### Default Values

- `port: 4000`
- `pollingInterval: 1000`
- `simulationBaseUrl: 'http://localhost:3000'`

## Functionality

1.  The Service is responsible for constantly pulling events from the third-party Simulation API.
2.  The Service exposes `/client/state` endpoint to fetch active events from the state.
3.  The Service stores all events in the storage

## Architecture

**API Client**

The Service uses an Axios-based client to interact with the third-party API.

**Polling mechanism**

Once the Service is started, the consumer begins pulling data from the third-party API and processing the retrieved events.

**REST API**

The Service exposes `/client/state` endpoint to retrieve formatted **active** events from the state.

- Example of the response:

```ts
{
  "3eccf850-571f-4e18-8cb3-2c9e3afade7b": {
    "id": "3eccf850-571f-4e18-8cb3-2c9e3afade7b",
    "status": "LIVE",
    "scores": {
      "CURRENT": {
        "type": "CURRENT",
        "home": "0",
        "away": "0"
      }
    },
    "startTime": "2024-03-04T10:36:07.812Z",
    "sport": "FOOTBALL",
    "competitors": {
      "HOME": {
        "type": "HOME",
        "name": "Juventus"
      },
      "AWAY": {
        "type": "AWAY",
        "name": "Paris Saint-Germain"
      }
    },
    "competition": "UEFA Champions League"
  }
}
```

**Storage**

The service stores all events in memory using a `Map` data structure, allowing for quick lookups and efficient event processing.

## Testing

To run the tests for the application, use the following command:

```bash
> npm run test
```

This will execute the test suite and display the results in the terminal. Make sure to have all dependencies installed before running the tests.
