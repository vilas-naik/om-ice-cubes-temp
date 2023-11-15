import { launch } from 'puppeteer';
import { compile } from 'ejs';
import { promises as fs } from 'fs';

async function generatePDF() {
  // Read the EJS template
  const templateContent = await fs.readFile('C:/vilas/Final/views/index.ejs', 'utf-8');

  // Compile the template
  const compiledTemplate = compile(templateContent);

  // Generate HTML from the compiled template
  const html = compiledTemplate();

  // Launch a headless browser
  const browser = await launch();
  const page = await browser.newPage();

  // Inject external CSS file
  await page.addStyleTag({ content:'body,ul{margin:0;font-family:sans-serif}.packOrKg,.packOrKg select,.search-container{position:relative}.packOrKg select,.search-container input{font-size:1.5rem;background-color:transparent}body{font-size:1.5rem;padding:0}.container{display:grid;height:100vh;width:100vw;grid-template-columns:1fr;grid-template-rows:1fr 80%;align-items:center;justify-items:center}input{border:0}.search-container{display:flex;flex-direction:column;width:930px;margin:15px auto;border:.1em solid;border-radius:2em 2em 0 0;left:135px}.packOrKg,.quantity,.rate{left:30px;align-self:flex-start}.search-container .suggestions,.search-container input{width:100%;text-align:left}.search-container input::placeholder{padding-left:10px}.search-container input{margin-left:40px;height:60px;width:300px;caret:#000}.search-container input:focus{outline:0;border:none;overflow:hidden}.search-container .suggestions{position:relative;z-index:2}ul{display:none;list-style-type:none;box-shadow:0 1px 2px 0 rgba(0,0,0,.2);max-height:200px;overflow-y:auto;border:1px solid gray}ul.has-suggestions{display:block}ul li{cursor:pointer;background:rgba(255,255,255,.2)}ul li:hover{background-color:rgba(63,63,63,.2)}.packOrKg select{display:inline-block;border-radius:10px;height:50px;width:100px;left:10px}.quantity input[type=number],.rate input[type=number]{border:1px solid #000;font-size:1.5rem;background-color:transparent;display:inline-block;height:40px;width:200px}#submit,.main{position:relative;border-radius:50px}.logo{grid-area:1/1/2/2}.main{display:flex;flex-direction:column;width:80%;gap:3em;align-items:center;padding:100px 20px;background-color:#efefef;box-shadow:5px 5px 50px silver,-5px 5px 50px silver,5px -5px 50px silver,-5px -5px 50px silver}#partyLabel{position:absolute;top:150px;left:85px}.quantity,.rate{position:relative}.quantityAndRate{position:relative;display:flex;gap:3em;align-self:flex-start}#submit{display:inline-block;padding:.75em 1.5em;font-size:1.3rem;margin-top:20px;left:700px;background-color:#000;color:#fff}.flex{display:flex;gap:2em}'});

  // Set content to the generated HTML
  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  // Generate PDF
  await page.pdf({ path: 'output2.pdf', format: 'A4' });

  // Close the browser
  await browser.close();
}

// Call the function to generate the PDF
generatePDF();
