const axios = require("axios");

exports.luminai = async (q, username) => {
  try {
    const response = await axios.post("https://luminai.siputzx.my.id/sesi", {
      content: q,
      user: username,
    });
    return response.data.result;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error;
  }
};

exports.goodyai = async (q) => {
  try {
    const headers = {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,af;q=0.6',
      'Content-Type': 'application/json',
      'Origin': 'https://www.goody2.ai',
      'Referer': 'https://www.goody2.ai/chat',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    };

    const params = {
      message: q,
      debugParams: null
    };

    const response = await axios.post("https://www.goody2.ai/send", params, {
      headers,
      responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
      let fullText = '';

      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n');
        for (let line of lines) {
          if (line.startsWith('data: {"content":')) {
            try {
              const content = JSON.parse(line.slice(6)).content;
              fullText += content;
            } catch (err) {
              console.error('Error parsing JSON:', err);
            }
          }
        }
      });

      response.data.on('end', () => {
        resolve(fullText);
      });

      response.data.on('error', (err) => {
        reject(err);
      });
    });

  } catch (error) {
    console.error(error);
    throw error;
  }
}
