import { Ability } from "./ability.model";
import { CompetenceLevel } from "./competence-level.model";

export interface Competence {
    id: number;
    code: string;
    name: string;
    competenceLevels: CompetenceLevel[];
    abilities: Ability[];
}