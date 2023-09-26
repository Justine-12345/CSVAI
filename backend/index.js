const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');
const { error } = require('console');
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const API_ENDPOINT = "us-central1-aiplatform.googleapis.com";
const PROJECT_ID = "ctqr-cnc";
const MODEL_ID = "code-bison";

async function sendRequest(requestData) {

    try {
        const auth = new GoogleAuth({
            scopes: "https://www.googleapis.com/auth/cloud-platform",
        });
        const client = await auth.getClient();
        const accessToken = (await client.getAccessToken()).token;
        console.log("accessToken",accessToken)
        const response = await axios.post(
            `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${MODEL_ID}:predict`,
            requestData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.predictions[0].content.replace(/```/g, '').replace(/\n/g, '').replace("json", "")
    } catch (error) {
        console.error(error);
    }



}


app.post('/api/', (req, res) => {

    const arr = req.body;

    const str = JSON.stringify(arr)

    const content = `this is the raw json dataset 

    ${str}

    can you convert that to this structure
    if you see something like this "///" in a value in category, split it, put index 0 to category and put index 1 to subcategory

    {
    sku:string,
    itemAlias:string,//this must be same as sku
    name:string,//this is an item name
    type:string,//  if there is a type or itemType or item_type key in data set, else set it to null
    features:string,//if there is a features or features key in the dataset else put null
    subcategory:string,//if there is a "///" in the category value , split it, put index 0 to category and put index 1 to subcategory
    color:string,//if there is a color or colors keys or in the dataset or if there is a color mention in the name of item else put null
    weight:string, //put the actual value e.g 2ml put 2 or 3.5ml put 3.5
    count:string,// if the is a count or counts or qunatity in or stock in key in the dataset
    length:string,
    width:string,
    height:string,
    uom:string,
    cost:string, 
    price:string,//if there is a cost or cost or price or prices key in the dataset
    category:string,
    imageUrl:string, //image url
    isMarketItem:string, // if the is a isMarketItem in key in the dataset
    shouldTrack:string, // if the is a shouldTrack in key in the dataset
    }

    

    please respond the dataset/array of objects only, don't put any comments or label`

    const requestData = {
        instances: [
            {
                prefix: content,
            },
        ],
        parameters: {
            candidateCount: 1,
            maxOutputTokens: 2048,
            temperature: 0.2
        },
    };

    sendRequest(requestData).then(result => {
        res.status(200).json({
            content: result,
        })
    }).catch(error => { console.log("error", error) });

    // res.status(200).json({
    //     content: JSON.stringify(req.body),
    // })

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});