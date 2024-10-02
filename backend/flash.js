const { log } = require('console');
const path=require('path');
require('dotenv').config({path: path.join(process.cwd(),"/.env")});
console.log(process.env.FLASH_KEY);

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.FLASH_KEY}`;

async function callFlash(prompt) {
    return new Promise(async(res,rej)=>{
    console.log(prompt);
    
    const data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generation_config": {
            "stopSequences": ["Title"],
            "temperature": 0,
            "topP": 0.8,
            "topK": 10
        }
    }

    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Error calling Gemini Flash: ${response.statusText}`);
    }
    response = await response.json();
    res(response
        .candidates[0]
        .content
        .parts[0]
        .text);
});
}

const imgst = "''"

async function callFlashwithImg(prompt, Img,) {
    const data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": `${prompt}`
                    }, {
                        "inline_data": {
                            "mime_type": "image/jpg",
                            "data": `${Img}`
                        }
                    }
                ]
            }
        ],
        "generation_config": {
            "stopSequences": ["Title"],
            "temperature": 0,
            "topP": 1,
            "topK": 10
        }
    }

    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Error calling Gemini Flash: ${response.statusText}`);
    }
    response = await response.json();
    return response
        .candidates[0]
        .content
        .parts[0]
        .text;
}
/*
  callGeminiFlash(nam)
    .then((res)=>{
      console.log(res.candidates[0].content.parts.length);
      console.log(res.candidates[0].content.parts[0].text);
    })
    .catch(error => {
      console.error("Error:", error);
    });
*/
module.exports = {
    callFlash,
    callFlashwithImg
}
