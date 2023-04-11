import jsonStringify from "src/utils/jsonStringify";

// From https://github.com/GoogleChromeLabs/jsbi/issues/30
export default function toObject(object: any) {
  return JSON.parse(jsonStringify(object));
}
