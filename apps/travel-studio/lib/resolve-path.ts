export function resolvePath(puckPath: string[] = []) {
  const hasPath = puckPath.length > 0;
  const isEdit = hasPath && puckPath[puckPath.length - 1] === "edit";

  const pathSegments = isEdit
    ? puckPath.slice(0, puckPath.length - 1)
    : puckPath;

  return {
    isEdit,
    path: `/${pathSegments.join("/")}`,
  };
}
