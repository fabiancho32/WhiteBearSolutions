import { properties } from './properties-model';
export interface form {
    title?: string;
    description?: string;
    required?: string[];
    properties?: properties;
}