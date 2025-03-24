export interface IState {
  odds: string;
}

export interface ISimulationAPIClient {
  getState(): Promise<IState>;
}
