import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';

vi.mock('dotenv', () => ({
  default: { config: vi.fn() },
}));

describe('Config Module', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('Should load default config values when env variables are missing', async () => {
    const { config } = await import('../../config/config.js');

    expect(config.server.port).toBe(4000);
    expect(config.consumer.pollingInterval).toBe(1000);
    expect(config.simulationBaseUrl).toBe('localhost:3000');
  });

  test('Should correctly load environment variables', async () => {
    vi.stubEnv('PORT', '5000');
    vi.stubEnv('POLLING_INTERVAL', '2000');
    vi.stubEnv('SIMULATION_BASE_URL', 'http://example.com');

    const { config } = await import('../../config/config.js');

    expect(config.server.port).toBe(5000);
    expect(config.consumer.pollingInterval).toBe(2000);
    expect(config.simulationBaseUrl).toBe('http://example.com');
  });

  test('Should handle invalid number values gracefully', async () => {
    vi.stubEnv('PORT', 'invalid');
    vi.stubEnv('POLLING_INTERVAL', 'invalid');

    const { config } = await import('../../config/config.js');

    expect(config.server.port).toBe(4000);
    expect(config.consumer.pollingInterval).toBe(1000);
  });
});
