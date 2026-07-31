import {
  loadYouthFootballData,
  validateYouthFootballData
} from "../lib/youth-football-catalog.mjs";

const data = await loadYouthFootballData();
const result = validateYouthFootballData(data);

if (!result.valid) {
  console.error("U5-U17 football data validation failed:");
  result.errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    [
      "U5-U17 football data is valid:",
      `${result.counts.sources} sources,`,
      `${result.counts.ageBands} age bands,`,
      `${result.counts.goals} goals,`,
      `${result.counts.routines} routines,`,
      `${result.counts.indexedCombinations} indexed level combinations.`
    ].join(" ")
  );
}
