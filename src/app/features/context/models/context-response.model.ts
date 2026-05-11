import { Level } from "./level.model";
import { Modality } from "./modality.model";
import { Specialization } from "./specialization.model";

export interface GetContextFiltersResponse {
    modalities: Modality[];
    levels: Level[];
    specializations: Specialization[];
}