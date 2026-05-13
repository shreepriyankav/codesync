const axios = require("axios");

// Free public Judge0 instance - no API key needed
const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";

const LANGUAGE_MAP = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
};

exports.executeCode = async (req, res) => {
  const { code, language } = req.body;
  const languageId = LANGUAGE_MAP[language];

  if (!languageId) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  try {
    // Use free public Judge0 instance (no API key required)
    const submitRes = await axios.post(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: languageId,
        stdin: "",
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    const { stdout, stderr, compile_output, status } = submitRes.data;
    res.json({
      output: stdout || stderr || compile_output || "No output",
      status: status?.description || "Unknown",
    });
  } catch (err) {
    res.status(500).json({
      error: "Code execution failed",
      details: err.message,
    });
  }
};
