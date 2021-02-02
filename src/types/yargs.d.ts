import { Arguments, Options } from 'yargs';

interface YargsArgs extends Arguments{
  sourceMaps: boolean;
  stripComments: boolean;
  port: number;
  dist: string;
  src: string;
}

interface Option extends Options{
  stripComments: boolean;
}
