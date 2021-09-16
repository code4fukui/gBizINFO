import * as t from "https://deno.land/std/testing/asserts.ts";
import { isValid } from "./CheckDigit.js";

Deno.test("simple", () => {
  t.assert(isValid("8700110005901"));
  t.assert(!isValid("8700110005902"));
});
