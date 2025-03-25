export interface IState {
  odds: string;
}

export interface IMappings {
  mappings: string;
}

export interface ISimulationAPIClient {
  getState(): Promise<IState>;
  getMappings(): Promise<IMappings>;
}
