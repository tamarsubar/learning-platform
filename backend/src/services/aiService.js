const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateResponse = async (promptText) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: promptText }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI Error:", error);
    return "מצטער, ה-AI נתקל בשגיאה. נסה שוב מאוחר יותר.";
  }
};