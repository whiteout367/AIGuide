import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

//chat gpt
export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid country",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.5,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    });
    let result = completion.data.choices[0].text
    console.log(completion.data.choices[0].text.search("."));

    const response = await openai.createImage({
      prompt: generatePanitPrompt(animal),
      n: 1,
      size: "1024x1024",
    });
    let image_url = response.data.data[0].url;
    //console.log("image_url", image_url);
    res.status(200).json({ resultImg: image_url, result: result });

  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}


function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `I am an experienced guide.
  If you ask me for a guide about any country, I will recommend 5 great places with Detail explanation. 
  Descriptions are separated by ' - '. 
  Just print the location and description. 
  If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with "Unknown".

  Q: ${capitalizedAnimal}

  A:`;
}

function generatePanitPrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `a great photograph of subject, 
  wide shot, 
  outdoors, 
  joyful, 
  traditional, 
  ${capitalizedAnimal} sunrise photo at golden hour`;
}
