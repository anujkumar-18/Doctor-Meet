const fs = require('fs');
const path = require('path');

const filesToOverwrite = [
  {
    src: 'c:\\docmeet_temp_clone2\\app\\(main)\\admin\\layout.js',
    dest: 'c:\\docmeet\\app\\(auth)\\(main)\\admin\\layout.js'
  },
  {
    src: 'c:\\docmeet_temp_clone2\\app\\(main)\\admin\\page.jsx',
    dest: 'c:\\docmeet\\app\\(auth)\\(main)\\admin\\page.jsx'
  },
  {
    src: 'c:\\docmeet_temp_clone2\\app\\(main)\\doctor\\verification\\page.jsx',
    dest: 'c:\\docmeet\\app\\(auth)\\(main)\\doctor\\verification\\page.jsx'
  },
  {
    src: 'c:\\docmeet_temp_clone2\\app\\(main)\\doctors\\[specialty]\\page.jsx',
    dest: 'c:\\docmeet\\app\\(auth)\\(main)\\doctors\\[specialty]\\page.jsx'
  },
  {
    src: 'c:\\docmeet_temp_clone2\\app\\(main)\\onboarding\\page.jsx',
    dest: 'c:\\docmeet\\app\\(auth)\\(main)\\onboarding\\page.jsx'
  },
  {
    src: 'c:\\docmeet_temp_clone2\\app\\(main)\\pricing\\page.jsx',
    dest: 'c:\\docmeet\\app\\(auth)\\(main)\\pricing\\page.jsx'
  }
];

filesToOverwrite.forEach(file => {
  if (fs.existsSync(file.src)) {
    fs.copyFileSync(file.src, file.dest);
    console.log(`Overwrote ${file.dest}`);
  }
});
