const axios = require("axios");

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
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: languageId,
        stdin: "",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": "497b63e2f5msh6a0c4e3e3b3e3b3p1a2b3cjsn1a2b3c4d5e6f",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        timeout: 15000,
      }
    );

    const { stdout, stderr, compile_output, status } = response.data;
    res.json({
      output: stdout || stderr || compile_output || "No output",
      status: status?.description || "Unknown",
    });
  } catch (err) {
    // Fallback to free public instance
    try {
      const fallback = await axios.post(
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

      const { stdout, stderr, compile_output, status } = fallback.data;
      res.json({
        output: stdout || stderr || compile_output || "No output",
        status: status?.description || "Unknown",
      });
    } catch (fallbackErr) {
      res.status(500).json({
        error: "Code execution failed",
        details: fallbackErr.message,
      });
    }
  }
};
