export{};
declare global {
  namespace NodeJS {
    interface Global {
      snaps: {
            verboseErrors: boolean,
            suppressWarnings: boolean,
            isWatching: boolean
          }
    } 
  }
}