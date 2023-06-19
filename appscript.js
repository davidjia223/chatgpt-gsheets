// Constants
const API_KEY = "sk-xxxx";
const MODEL_TYPE = "gpt-3.5-turbo"; //chatGPT model


// Creates a custom menu in Google Sheet
function onOpen() {
  SpreadsheetApp.getUi().createMenu("ChatGPT")
      .addItem("Generate Keywords", "generateKeywords")
      .addItem("Create Ad Copy", "generateAdCopy")
      .addItem("Search web related result", "generateWeb")
      .addToUi();
}

function generateWeb() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const selectedText = sheet.getActiveRange().getValue();
  const prompt = "Generate the top 5 recommended websites for this keyword : " + selectedText;
  const temperature = 0;
  const maxTokens = 2050;

  const requestBody = createRequestBody(prompt, temperature, maxTokens);

  callApi(requestBody, sheet); // Call the API function
}

function generateAdCopy() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const selectedText = sheet.getActiveRange().getValue();
  const prompt = "Generate 5 Google Adwords Copies for this keyword : " + selectedText;
  const temperature = 0;
  const maxTokens = 2050;

  const requestBody = createRequestBody(prompt, temperature, maxTokens);

  callApi(requestBody, sheet); // Call the API function
}


function generateKeywords() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const selectedText = sheet.getActiveRange().getValue();
  const prompt = "Generate 10 Keywords similar to this keyword : " + selectedText;
  const temperature = 0;
  const maxTokens = 2050;

  const requestBody = createRequestBody(prompt, temperature, maxTokens);

  callApi(requestBody, sheet); // Call the API function
}

// New function to handle API requests
function callApi(requestBody, sheet) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + API_KEY,
    },
    payload: JSON.stringify(requestBody),
  };

  // Function to create the requestBody object
function createRequestBody(prompt, temperature, maxTokens) {
  return {
    model: MODEL_TYPE,
    messages: [{ role: "user", content: prompt }],
    temperature,
    max_tokens: maxTokens,
  };
}

  const response = UrlFetchApp.fetch("https://api.openai.com/v1/chat/completions", requestOptions);
  const responseText = response.getContentText();
  const json = JSON.parse(responseText);
  const generatedText = json['choices'][0]['message']['content'];
  Logger.log(generatedText);

  sheet.getRange(sheet.getLastRow() + 1, 1).setValue(generatedText.toString());
}
