exports.generateResponse = async (promptText) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: promptText }]
      })
    });

    const data = await response.json();

    if (!response.ok || !data.choices) {
      console.error("OpenAI API error:", JSON.stringify(data));
      throw new Error(data.error?.message || "Unknown OpenAI error");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Error:", error.message);
    return "Sorry, the AI encountered an error. Please try again later.";
  }
};