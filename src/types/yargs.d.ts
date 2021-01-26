import { Arguments, Options } from "yargs";

interface Argument extends Arguments{
    sourceMaps: boolean,
    stripComments: boolean,
}

interface Option extends Options{
    stripComments: boolean,
}