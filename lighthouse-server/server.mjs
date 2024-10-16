import express from 'express';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';

const app = express();
const port = 3000;

async function launchChromeAndRunLighthouse(url, options, config = null) {
  try {
    console.log('Launching Chrome...');
    const chrome = await launch({
      chromePath: process.env.CHROME_PATH,
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
    });
    options.port = chrome.port;
    console.log('Chrome launched on port:', chrome.port);
    
    const result = await lighthouse(url, options, config);
    await chrome.kill();
    return result.lhr;
  } catch (error) {
    console.error('Error during Chrome launch or Lighthouse run:', error);
    throw error;
  }
}

app.get('/audit', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send('URL is required');
  }
  const options = { output: 'json' };
  try {
    console.log('Running Lighthouse audit for URL:', url);
    const report = await launchChromeAndRunLighthouse(url, options);
    res.json(report);
  } catch (error) {
    console.error('Error during Lighthouse audit:', error);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Lighthouse server listening at http://localhost:${port}`);
});
