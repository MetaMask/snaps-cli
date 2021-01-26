import { Arguments, Options } from "yargs";

interface Argument extends Arguments{
    sourceMaps: boolean,
    stripComments: boolean,
    port: number,
    dist: string,
}

interface Option extends Options{
    stripComments: boolean,
}