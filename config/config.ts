import dotenv from 'dotenv';

dotenv.config();

interface Config {
  server: {
    port: number;
  };
  consumer: {
    pollingInterval: number;
  };
}

const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '4000', 10),
  },
  consumer: {
    pollingInterval: parseInt(process.env.POLLING_INTERVAL || '1000', 10),
  },
};

export { Config, config };
