'use client'
import { ChangeEvent, useState, useEffect } from "react";
import axios from "axios";


export default function Home() {
  const [jsonResult, setJsonResult] = useState<string | null>(null);
  const [jsonResultAI, setJsonResultAI] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setProgress(jsonResultAI.length)
  }, [jsonResultAI])

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      alert('Please select a CSV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        const csvText = event.target.result as string;
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        const jsonData: Record<string, string>[] = [];

        for (let i = 1; i < rows.length; i++) {
          const data = rows[i].split(',');
          const row: Record<string, string> = {};

          for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = data[j];
          }

          jsonData.push(row);
        }

        setJsonResult(JSON.stringify(jsonData, null, 2));
      }
    };

    reader.readAsText(file);
  };

  const Run = async () => {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const batchSize = 10;
    const arr = JSON.parse(jsonResult ? jsonResult : "")
    const n = arr.length;
    let start = 0;

    setDone(false)
    setLoading(true)
    setTotal(n - 1)

    while (start < n) {
      const end = Math.min(start + batchSize, n);
      const batch = JSON.stringify(arr.slice(start, end));

      const resultJson = await axios.post("http://localhost:3001/api", batch, config)

      console.log("resultJson", JSON.parse(resultJson.data.content))

      setJsonResultAI((oldArry: any) => [...oldArry, ...JSON.parse(resultJson.data.content)])


      start = end;
    }

    setLoading(false)
    setDone(true)
    console.log("Done!!!")

  }

  const structureHandler = () => {
    console.log("jsonResultAI", jsonResultAI)
  }



  const convertJsonToCsv = () => {
    // Convert the array of objects to a CSV string
    const csvData = convertArrayOfObjectsToCsv(jsonResultAI);

    // Create a Blob containing the CSV data
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Create a download link for the Blob
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'data.csv';

    // Trigger a click event to download the file
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const convertArrayOfObjectsToCsv = (array: any) => {
    const header = Object.keys(array[0]);
    const csvRows = [];

    // Add the header row
    csvRows.push(header.join(','));

    // Add the data rows
    array.forEach((obj: any) => {
      const row = header.map((fieldName) => {
        const cell = obj[fieldName];
        return JSON.stringify(cell !== undefined ? cell : '', (key, value) => {
          return value !== null && typeof value === 'object' ? JSON.stringify(value) : value;
        });
      });
      csvRows.push(row.join(','));
    });

    // Combine rows into a CSV string
    return csvRows.join('\n');
  };



  return (
    <div className=" pl-8 space-y-6 " >
      <h2>CSV to JSON Converter</h2>
      <input type="file" accept=".csv" onChange={handleFileInputChange} />

      <div className=" flex gap-3 " >
        <button disabled={loading} className={`bg-slate-800 p-2 rounded-lg  ${loading ? "bg-slate-500" : "hover:bg-slate-500"}  `} onClick={Run} >
          {loading ? `Converting... ${progress}/${total}` : "Convert"}</button>
        {/* <button onClick={structureHandler} >View Structured</button> */}
        {done ?
          <button className=" bg-slate-800 p-2 rounded-lg hover:bg-slate-500 " onClick={convertJsonToCsv}>{progress ? `(${progress}/${total})` : ""} Download as CSV</button>
          : null
        }

      </div>

      <div className=" flex " >
        <div className="  w-[50%]" >
          <h3>JSON Input:</h3>
          <pre>{jsonResult}</pre>
        </div>
        <div className="  w-[50vw]">
          <h3>JSON Output:</h3>
          {jsonResultAI.length >= 1 ?
            <p className=" break-words " >{JSON.stringify(jsonResultAI)}</p> : ""
          }
         

        </div>
      </div>
    </div>
  );
}
