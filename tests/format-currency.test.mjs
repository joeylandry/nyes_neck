import assert from "node:assert/strict";
import { test } from "node:test";
import { formatCurrency } from "../src/lib/formatCurrency.ts";

test("whole-dollar prices are shown without decimals", () => {
  assert.equal(formatCurrency(3400, "USD"), "$34");
  assert.equal(formatCurrency(0, "USD"), "$0");
  assert.equal(formatCurrency(125000, "USD"), "$1,250");
});

test("prices carrying cents keep them so totals match the checkout", () => {
  assert.equal(formatCurrency(3499, "USD"), "$34.99");
  assert.equal(formatCurrency(3450, "USD"), "$34.50");
  assert.equal(formatCurrency(5, "USD"), "$0.05");
});
