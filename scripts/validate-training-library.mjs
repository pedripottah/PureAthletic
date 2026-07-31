import {
  loadJuniorTrainingLibrary,
  validateJuniorTrainingLibrary
} from "../lib/junior-training-library.mjs";

const library = await loadJuniorTrainingLibrary();
const result = validateJuniorTrainingLibrary(library);

if (!result.valid) {
  console.error("Junior training library validation failed:");
  result.errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `Junior training library is valid: ${result.counts.exercises} exercises, ${result.counts.routines} routines.`
  );
}
