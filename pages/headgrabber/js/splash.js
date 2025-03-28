window.onload = function() {
  fetch('styling/splashtxt.json')
    .then(response => response.json())
    .then(splashTextList => {

      const randomIndex = Math.floor(Math.random() * splashTextList.length);
      const randomSplashText = splashTextList[randomIndex];
      
      addText(randomSplashText);
    })
    .catch(error => console.error('Error loading splash text:', error));
};

function addText(text) {
    const displayTextElement = document.getElementById("displayText");

    if (text.startsWith(":") && text.endsWith(":")) {
        let name = text.slice(1, -1).trim();
        if (name) {
            let img = document.createElement("img");
            img.src = `../head/${name}/48`;
            displayTextElement.appendChild(img);
        }
        return;
    }

  var colorMapping = {
      '0': '000000', // Black
      '1': '0000AA', // Dark Blue
      '2': '00AA00', // Dark Green
      '3': '00AAAA', // Dark Aqua
      '4': 'AA0000', // Dark Red
      '5': 'AA00AA', // Dark Purple
      '6': 'FFAA00', // Gold
      '7': 'AAAAAA', // Gray
      '8': '555555', // Dark Gray
      '9': '5555FF', // Blue
      'a': '55FF55', // Green
      'b': '55FFFF', // Aqua
      'c': 'FF5555', // Red
      'd': 'FFC0CB', // Pink
      'e': 'FFFF55', // Yellow
      'f': 'FFFFFF',  // White
      'r': 'FFFF55' // Yellow - Reset
  };

    const markdownMapping = {
        '**': 'strong',
        '*': 'em',
        '__': 'u',
        '~~': 's'
    };

    text = text.replace(/&([0-9a-fklmnors])/gi, function(match, code) {
      if (code in colorMapping) {
          return '<span style="color: #' + colorMapping[code] + '">';
      } else if (code in formattingMapping) {
          return '<span style="' + formattingMapping[code] + '">';
      } else {
          return '';
      }
  });

  text = text.replace(/&r/gi, '</span>');

  while (text.match(/(\*\*|__|~~|\*)(.*?)\1/)) {
    text = text.replace(/(\*\*|__|~~|\*)(.*?)\1/, function(match, openTag, content) {
        if (openTag in markdownMapping) {
          const htmlTag = markdownMapping[openTag];
          return '<' + htmlTag + '>' + content + '</' + htmlTag + '>';
      } else {
          return match;
      }
    });
  }

  displayTextElement.innerHTML = text;
}
