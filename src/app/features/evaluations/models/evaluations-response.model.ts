import { PaginatedResult } from "../../../shared/models/pagination.model";
import { Simulation, SimulationHistoryItem } from "./simulation.model";

export interface GetSimulationsResponse {
    simulations: PaginatedResult<Simulation>;
}

export interface GetSimulationsHistoryResponse {
    history: PaginatedResult<SimulationHistoryItem>;
}
