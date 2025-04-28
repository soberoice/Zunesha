const parseWebVTT = (vttText) => {
  const lines = vttText.split("\n");
  console.log(vttText)

  const cues = [];

  let cue = null;

  for (let line of lines) {
    line = line.trim();

    // Skip empty lines and the WEBVTT header

    if (line === "" || line === "WEBVTT") continue;

    // Check for cue timing

    const timeMatch = line.match(
      /(\d{2}:\d{2}:\d{2}\.\d{3})\s-->\s(\d{2}:\d{2}:\d{2}\.\d{3})/
    );

    if (timeMatch) {
      // If we have a cue, push it to the array

      if (cue) {
        cues.push(cue);
      }

      cue = {
        start: timeMatch[1],

        end: timeMatch[2],

        text: "",
      };

      continue;
    }

    // If we have a cue, append the text

    if (cue) {
      cue.text += line + " ";
    }
  }

  // Push the last cue if it exists

  if (cue) {
    cues.push(cue);
  }

  // Log the parsed cues for debugging

  console.log("Parsed Cues:", cues);

  return cues.map((cue) => ({
    start: convertTimeToSeconds(cue.start),

    end: convertTimeToSeconds(cue.end),

    text: cue.text.trim(),
  }));
};

// Helper function to convert time format to seconds

const convertTimeToSeconds = (time) => {
  const parts = time.split(":");

  const seconds = parseFloat(parts[2].replace(".", "."));

  return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + seconds;
};

export default parseWebVTT;
