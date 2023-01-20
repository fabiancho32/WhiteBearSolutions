export interface property {
    type: string;
    format: string;
    title: string;
    default: string | number | boolean;
    pattern: string;
    value: string | number | boolean;
    error: string;
}