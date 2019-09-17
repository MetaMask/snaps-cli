
function parseRequestedPermissions (source) {
  let requestedPermissions = source.match(
    /ethereumProvider\.[A-z0-9_\-$]+/g
  )

  if (requestedPermissions) {
    requestedPermissions = requestedPermissions.reduce(
      (acc, current) => ({ ...acc, [current.split('.')[1]]: {} }),
      {}
    )
  }
  return requestedPermissions
}
