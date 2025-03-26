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

const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '4000', 10),
  },
  consumer: {
    pollingInterval: parseInt(process.env.POLLING_INTERVAL || '1000', 10),
  },
  simulationBaseUrl: process.env.SIMULATION_BASE_URL || 'localhost:3000',
};

export { Config, config };
