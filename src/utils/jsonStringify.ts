// From https://github.com/GoogleChromeLabs/jsbi/issues/30
export default function jsonStringify(object: any) {
  return JSON.stringify(object, (_key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}
