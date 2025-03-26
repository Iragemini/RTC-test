import dotenv from 'dotenv';

dotenv.config();

interface Config {
  server: {
    port: number;
  };
  consumer: {
    pollingInterval: number;
  };
  simulationBaseUrl: string;
}

const port = parseInt(process.env.PORT || '4000', 10);
const pollingInterval = parseInt(process.env.POLLING_INTERVAL || '1000', 10);

const config: Config = {
  server: {
    port: isNaN(port) ? 4000 : port,
  },
  consumer: {
    pollingInterval: isNaN(pollingInterval) ? 1000 : pollingInterval,
  },
  simulationBaseUrl: process.env.SIMULATION_BASE_URL || 'localhost:3000',
};

export { Config, config };
